import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { Router, ActivatedRoute} from "@angular/router";
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of, Subscription, Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectAllCollections,
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-gerer-dataset',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './gerer-dataset.component.html',
  styleUrl: './gerer-dataset.component.css'
})
export class GererDatasetComponent implements OnInit, OnDestroy {
  // NgRx Observables
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  datasetId$: Observable<string | null>;
  
  // Component state
  afficherLeFormulaire: boolean = true;
  IdDataset!: any;
  DatasetNam!: any;
  DatasetDescription!: any;
  errorMessage!: string;
  datasetFormGroup!: FormGroup;
  currentDataset: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.collections$ = this.store.select(selectAllCollections);
    this.collectionsLoading$ = this.store.select(selectCollectionsLoading);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
    
    // Initialize form
    this.initializeForm();
  }

  ngOnInit(): void {
    // Subscribe to errors
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorMessage = error;
          console.error('Dataset loading error:', error);
        }
      });
    
    // Get dataset ID from route
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.IdDataset = params['id'];
        if (this.IdDataset) {
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: this.IdDataset }));
          this.loadDataset(this.IdDataset);
        }
      });
    
    console.log('Gerer-dataset component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.datasetFormGroup = this.fb.group({
      nomDataset: this.fb.control(this.DatasetNam || '', [Validators.required]),
      description: this.fb.control(this.DatasetDescription || '', [Validators.required, Validators.minLength(3)]),
    });
  }

  private loadDataset(datasetId: string): void {
    console.log('Loading dataset:', datasetId);
    
    // Generate mock dataset data
    const mockDataset = this.generateMockDataset(parseInt(datasetId));
    this.currentDataset = mockDataset;
    
    // Populate form with dataset data
    this.datasetFormGroup.patchValue({
      nomDataset: mockDataset.name,
      description: mockDataset.description
    });
    
    console.log('Dataset loaded:', mockDataset);
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(CollectionsActions.loadDataset({ datasetId }));
  }

  private generateMockDataset(datasetId: number): any {
    return {
      id: datasetId,
      name: `Dataset ${datasetId}`,
      description: `Description for dataset ${datasetId}`,
      dateCreation: new Date().toISOString(),
      statut: 'active',
      nbrSpecimens: Math.floor(Math.random() * 1000) + 100,
      nbrImages: Math.floor(Math.random() * 2000) + 200
    };
  }

  afficherFormulaire(afficher: boolean): void {
    this.afficherLeFormulaire = afficher;
  }

  modifier_prt(): void {
    if (this.datasetFormGroup.valid && this.currentDataset) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to modify this dataset. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#86A786',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, modify dataset',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedDataset = {
            ...this.currentDataset,
            ...this.datasetFormGroup.value,
            dateModification: new Date().toISOString()
          };
          
          console.log('Updating dataset:', updatedDataset);
          
          // Dispatch update action
          this.store.dispatch(CollectionsActions.updateCollection({ 
            collectionId: this.currentDataset.id, 
            changes: this.datasetFormGroup.value 
          }));
          
          Swal.fire('Success', 'Dataset modified successfully', 'success').then(() => {
            this.router.navigateByUrl(`/admin/corpus/${this.IdDataset}`);
          });
        }
      });
    } else {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
    }
  }

  // UI Helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.datasetFormGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.datasetFormGroup.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  onCancel(): void {
    this.router.navigateByUrl(`/admin/corpus/${this.IdDataset}`);
  }

  onDeleteDataset(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this dataset. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#86A786',
      confirmButtonText: 'Yes, delete dataset',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting dataset:', this.IdDataset);
        
        // TODO: Implement delete functionality with NgRx
        // this.store.dispatch(CollectionsActions.deleteCollection({ collectionId: this.IdDataset }));
        
        Swal.fire('Success', 'Dataset deleted successfully', 'success').then(() => {
          this.router.navigate(['/admin/corpus']);
        });
      }
    });
  }
}
