import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of, Subscription, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectAllCollections,
  selectCollectionsLoading,
  selectCollectionsError,
  selectAllSpecimens,
  selectSpecimensCount
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-collection-info',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './collection-info.component.html',
  styleUrl: './collection-info.component.css'
})
export class CollectionInfoComponent implements OnInit, OnDestroy {
  // NgRx Observables
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  collectionId$: Observable<string | null>;
  
  // Component state
  collectionId: any;
  collection: any = null;
  errorMessage: string = '';
  cheminDtl = "assets/INFO1.png";
  NbSpecimens: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.collections$ = this.store.select(selectAllCollections);
    this.collectionsLoading$ = this.store.select(selectCollectionsLoading);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
  }

  ngOnInit(): void {
    // Subscribe to errors
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorMessage = error;
          console.error('Collection loading error:', error);
        }
      });

    // Get collection ID from route
    if (this.route.parent) {
      this.route.parent.paramMap
        .pipe(takeUntil(this.destroy$))
        .subscribe(params => {
          this.collectionId = params.get('id');
          if (this.collectionId) {
            this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: this.collectionId }));
            this.loadCollection(this.collectionId);
          }
        });
    }
    
    console.log('Collection-info component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCollection(collectionId: string): void {
    console.log('Loading collection:', collectionId);
    
    // Load real collection data via NgRx
    this.store.dispatch(CollectionsActions.loadCollections());
    
    // Subscribe to collections to find the specific one
    this.collections$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collections => {
        const foundCollection = collections.find(c => c.id === parseInt(collectionId));
        if (foundCollection) {
          this.collection = foundCollection;
          console.log('Collection loaded via NgRx:', foundCollection);
          console.log('Collection dateCreation:', foundCollection.dateCreation, 'Type:', typeof foundCollection.dateCreation);
          
          // Load specimens for this collection
          this.store.dispatch(CollectionsActions.loadSpecimensByCollection({ collectionId: parseInt(collectionId) }));
        }
      });
    
    // Subscribe to specimens count - wait for loading to complete
    this.store.select(selectCollectionsLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        if (!isLoading) {
          // Only count specimens after loading is complete
          this.store.select(selectSpecimensCount)
            .pipe(takeUntil(this.destroy$))
            .subscribe(count => {
              // Since we're loading specimens for a specific collection,
              // all specimens in the store should belong to this collection
              this.NbSpecimens = count;
              console.log('Specimens count for collection', collectionId, ':', this.NbSpecimens);
            });
        }
      });
  }


  // UI Helper methods
  getCollectionStatus(): string {
    return this.collection?.statut || 'unknown';
  }

  getCollectionStatusClass(): string {
    const status = this.getCollectionStatus();
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-warning';
      case 'archived': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  formatDate(dateString: string | number): string {
    if (!dateString) return '00/00/0000';
    
    try {
      let date: Date;
      
      if (typeof dateString === 'number') {
        // Handle timestamp (milliseconds)
        date = new Date(dateString);
      } else if (typeof dateString === 'string') {
        // Handle string dates
        date = new Date(dateString);
      } else {
        return '00/00/0000';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date received:', dateString);
        return '00/00/0000';
      }
      
      // Format as DD/MM/YYYY
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '00/00/0000';
    }
  }

  getCurrentUser(): string {
    try {
      const userString = localStorage.getItem('authUser');
      if (userString) {
        const user = JSON.parse(userString);
        return user.nom || user.email || 'Unknown User';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return 'Unknown User';
  }

  onEditCollection(): void {
    this.router.navigate(['/admin/collections/edit', this.collectionId]);
  }

  onViewSpecimens(): void {
    this.router.navigate(['/admin/collections', this.collectionId, 'specimens']);
  }

  onBackToList(): void {
    this.router.navigate(['/admin/collections']);
  }
}
