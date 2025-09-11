import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../../filter.pipe';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectAllSpecimens,
  selectSpecimensByCollection,
  selectCollectionsLoading,
  selectCollectionsError
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationProjectId,
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-specimen-selection',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    FormsModule,
    NgxPaginationModule,
    FilterPipe,
    AsyncPipe
  ],
  templateUrl: './specimen-selection.component.html',
  styleUrl: './specimen-selection.component.css'
})
export class SpecimenSelectionComponent implements OnInit, OnDestroy {
  
  // NgRx Observables
  specimens$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  projectId$: Observable<string | null>;
  collectionId$: Observable<string | null>;
  
  // Component state
  specimens: any[] = [];
  selectedSpecimens: Set<number> = new Set();
  searchText: string = '';
  p: number = 1;
  itemsPerPage: number = 20;
  
  // Reactive state management
  private specimensSubject = new BehaviorSubject<any[]>([]);
  specimensSubject$ = this.specimensSubject.asObservable();
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.specimens$ = this.store.select(selectAllSpecimens);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
  }

  ngOnInit(): void {
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load specimens: ${error}`, 'error');
        }
      });
    
    // Load specimens from collection
    this.loadSpecimens();
    
    // Subscribe to specimens data
    this.specimens$
      .pipe(takeUntil(this.destroy$))
      .subscribe(specimens => {
        if (specimens && specimens.length > 0) {
          this.specimens = specimens;
          this.specimensSubject.next(specimens);
          console.log('Specimens loaded for selection:', specimens.length);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSpecimens(): void {
    this.collectionId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collectionId => {
        if (collectionId) {
          console.log('Loading specimens from collection:', collectionId);
          
          // Load specimens from the collection
          this.store.dispatch(CollectionsActions.loadSpecimensByCollection({ 
            collectionId: parseInt(collectionId) 
          }));
        }
      });
  }

  toggleSpecimenSelection(specimenId: number): void {
    if (this.selectedSpecimens.has(specimenId)) {
      this.selectedSpecimens.delete(specimenId);
    } else {
      this.selectedSpecimens.add(specimenId);
    }
    console.log('Selected specimens:', Array.from(this.selectedSpecimens));
  }

  isSpecimenSelected(specimenId: number): boolean {
    return this.selectedSpecimens.has(specimenId);
  }

  selectAllSpecimens(): void {
    const currentPageSpecimens = this.getCurrentPageSpecimens();
    currentPageSpecimens.forEach(specimen => {
      this.selectedSpecimens.add(specimen.id);
    });
    console.log('All specimens on current page selected');
  }

  deselectAllSpecimens(): void {
    this.selectedSpecimens.clear();
    console.log('All specimens deselected');
  }

  getCurrentPageSpecimens(): any[] {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.specimens.slice(startIndex, endIndex);
  }

  getSelectedSpecimensCount(): number {
    return this.selectedSpecimens.size;
  }

  addSelectedSpecimensToDataset(): void {
    if (this.selectedSpecimens.size === 0) {
      Swal.fire('Warning', 'Please select at least one specimen to add to the dataset.', 'warning');
      return;
    }

    // Get dataset ID from route
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const datasetId = params['datasetId'];
        
        if (datasetId) {
          const specimenIds = Array.from(this.selectedSpecimens);
          
          Swal.fire({
            title: 'Add Specimens to Dataset?',
            text: `Are you sure you want to add ${specimenIds.length} specimens to this dataset?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#86A786',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add specimens',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('Adding specimens to dataset:', { datasetId, specimenIds });
              
              // Dispatch NgRx action to add specimens to dataset
              this.store.dispatch(CollectionsActions.addSpecimensToDataset({ 
                datasetId: parseInt(datasetId), 
                specimenIds: specimenIds 
              }));
              
              // Subscribe to success/failure
              this.store.select(selectCollectionsLoading)
                .pipe(takeUntil(this.destroy$))
                .subscribe(isLoading => {
                  if (!isLoading) {
                    this.store.select(selectCollectionsError)
                      .pipe(takeUntil(this.destroy$))
                      .subscribe(error => {
                        if (!error) {
                          // Success
                          Swal.fire({
                            title: 'Success!',
                            text: `${specimenIds.length} specimens have been added to the dataset.`,
                            icon: 'success',
                            timer: 3000
                          }).then(() => {
                            // Navigate back to dataset details
                            this.router.navigate([`/admin/datasets/${datasetId}/details`]);
                          });
                          
                          // Clear selection
                          this.selectedSpecimens.clear();
                        } else {
                          // Error
                          Swal.fire('Error', `Failed to add specimens: ${error}`, 'error');
                        }
                      });
                  }
                });
            }
          });
        }
      });
  }

  navigateToDatasetDetails(): void {
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const datasetId = params['datasetId'];
        if (datasetId) {
          this.router.navigate([`/admin/datasets/${datasetId}/details`]);
        }
      });
  }

  // UI Helper methods
  trackBySpecimenId(index: number, specimen: any): number {
    return specimen.id;
  }

  formatScientificName(name: string): string {
    if (!name) return '';
    return name.replace(/([A-Z][a-z]+)/g, '<em>$1</em>');
  }

  getFilteredSpecimens(): any[] {
    if (!this.searchText) {
      return this.specimens;
    }
    
    const searchLower = this.searchText.toLowerCase();
    return this.specimens.filter(specimen => 
      specimen.nomScientifique?.toLowerCase().includes(searchLower) ||
      specimen.genre?.toLowerCase().includes(searchLower) ||
      specimen.famille?.toLowerCase().includes(searchLower) ||
      specimen.pays?.toLowerCase().includes(searchLower)
    );
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/plante.png';
    }
  }
}
