import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, Subject, takeUntil, combineLatest, map } from 'rxjs';
import { CreeCollectionComponent } from "../cree-collection/cree-collection.component";
import { MatDialog } from "@angular/material/dialog";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectAllCollections, 
  selectCollectionsLoading, 
  selectCollectionsError 
} from '../../store/collections/collections.selectors';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    FontAwesomeModule,
    AsyncPipe
  ],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css'
})
export class ExplorerComponent implements OnInit, OnDestroy {
  
  // UI state
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext: any;
  p: number = 1;
  
  // Font Awesome icons
  faSearch = faSearch;
  faTrash = faTrash;
  faEdit = faEdit;
  
  // NgRx Observables
  collections$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  sortedFilteredCollections$: Observable<any[]>;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private dialogRef: MatDialog,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.collections$ = this.store.select(selectAllCollections);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    
    // Create a combined observable for sorted and filtered collections
    this.sortedFilteredCollections$ = combineLatest([
      this.collections$,
      // We'll add searchtext observable later
    ]).pipe(
      map(([collections]) => this.sortCollections(collections))
    );
  }

  ngOnInit(): void {
    // Load collections through NgRx
    this.store.dispatch(CollectionsActions.loadCollections());
    
    // Subscribe to error state for user feedback
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collections: ${error}`, 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  func_ajout_Col(): void {
    const dialogRefa = this.dialogRef.open(CreeCollectionComponent, {
      width: '700px',
      height: '500px',
      data: { is_active : false }
    });
    
    dialogRefa.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // Refresh collections list after dialog closes
          this.store.dispatch(CollectionsActions.loadCollections());
        }
      });
  }

  supprimerCol(id: any): void { 
    console.log("Deleting collection:", id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this corpus. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete corpus',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting collection with NgRx:', id);
        
        // Dispatch delete action through NgRx
        this.store.dispatch(CollectionsActions.deleteCollection({ collectionId: id }));
        
        // Listen for successful deletion
        this.error$
          .pipe(takeUntil(this.destroy$))
          .subscribe(error => {
            if (!error) {
              // Success case - when no error and loading is false
              this.isLoading$
                .pipe(takeUntil(this.destroy$))
                .subscribe(isLoading => {
                  if (!isLoading) {
                    Swal.fire('Success', 'Corpus deleted successfully', 'success');
                  }
                });
            }
          });
      }
    });
  }

  ouvrirCol(id: any): void {
    // Dispatch navigation action to update NgRx state
    this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: id.toString() }));
    
    // Navigate to the collection edit page
    this.router.navigateByUrl(`/admin/corpus/${id}/edit`);
  }

  sortBy(field: string): void {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    // Update the sorted collections observable
    this.sortedFilteredCollections$ = combineLatest([
      this.collections$,
    ]).pipe(
      map(([collections]) => this.sortCollections(collections))
    );
  }

  private sortCollections(collections: any[]): any[] {
    if (!collections || !this.currentSortField) {
      return collections || [];
    }

    return [...collections].sort((a, b) => {
      let comparison = 0;
      if (typeof a[this.currentSortField] === 'string' && typeof b[this.currentSortField] === 'string') {
        comparison = a[this.currentSortField].localeCompare(b[this.currentSortField]);
      } else {
        comparison = a[this.currentSortField] - b[this.currentSortField];
      }
      return this.isAscending ? comparison : -comparison;
    });
  }

  trackByCollectionId(index: number, collection: any): number {
    return collection.id;
  }
}