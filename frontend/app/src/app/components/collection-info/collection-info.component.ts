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
  selectCollectionsError 
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
    
    // Generate mock collection data
    const mockCollection = this.generateMockCollection(parseInt(collectionId));
    this.collection = mockCollection;
    
    // Generate mock specimens data
    const mockSpecimens = this.generateMockSpecimens(parseInt(collectionId));
    this.NbSpecimens = mockSpecimens.length;
    
    console.log('Collection loaded:', mockCollection);
    console.log('Specimens count:', this.NbSpecimens);
    
    // TODO: Replace with proper NgRx actions
    // this.store.dispatch(CollectionsActions.loadCollection({ collectionId }));
    // this.store.dispatch(CollectionsActions.loadSpecimensByCollection({ collectionId }));
  }

  private generateMockCollection(collectionId: number): any {
    return {
      id: collectionId,
      nom: `Collection ${collectionId}`,
      description: `Description for collection ${collectionId}`,
      dateCreation: new Date().toISOString(),
      statut: 'active',
      nbrSpecimens: Math.floor(Math.random() * 1000) + 100,
      nbrImages: Math.floor(Math.random() * 2000) + 200,
      projectId: 1,
      createdBy: 1
    };
  }

  private generateMockSpecimens(collectionId: number): any[] {
    const specimenCount = Math.floor(Math.random() * 1000) + 100;
    const specimens: any[] = [];
    
    for (let i = 1; i <= specimenCount; i++) {
      specimens.push({
        id: i,
        collectionId: collectionId,
        nomScientifique: `Specimen ${i}`,
        famille: `Family ${i}`,
        genre: `Genus ${i}`,
        espece: `Species ${i}`,
        pays: `Country ${i}`,
        dateCollecte: new Date().toISOString(),
        imageUrl: `assets/specimens/specimen_${i}.jpg`
      });
    }
    
    return specimens;
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

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
