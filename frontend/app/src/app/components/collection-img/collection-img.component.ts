import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, takeUntil, BehaviorSubject, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule, AsyncPipe } from '@angular/common';
import { NgForOf, NgIf, DatePipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from "../../filter.pipe";
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectCollectionById,
  selectCollectionsLoading,
  selectCollectionsError,
  selectAllCollections,
  selectAllSpecimens
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationCollectionId,
  selectNavigationProjectId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-collection-img',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './collection-img.component.html',
  styleUrl: './collection-img.component.css'
})

export class CollectionImgComponent implements OnInit, OnDestroy {

  // NgRx Observables
  collection$: Observable<any>;
  collectionId$: Observable<string | null>;
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Reactive state management
  private specimensSubject = new BehaviorSubject<any[]>([]);
  specimens$: Observable<any[]> = this.specimensSubject.asObservable();
  
  // Component state
  collectionId: string | null = null;
  collectionSpecimens: any[] = [];
  errorMessage: string = '';
  p: number = 1;
  isGridView: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    
    this.collection$ = this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const collectionId = params.get('Id') || params.get('id');
        if (collectionId) {
          this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId }));
          return this.store.select(selectCollectionById(parseInt(collectionId)));
        }
        return this.store.select(selectCollectionById(0));
      })
    ) || this.store.select(selectCollectionById(0));
  }

  ngOnInit(): void {
    // Check if we're in a formulaire context (no collection ID in URL)
    if (this.router.url.includes('/formulaire')) {
      console.log('In formulaire context - fetching project collection');
      this.fetchProjectCollection();
    } else if (this.route.parent) {
      // Normal corpus context - get collection ID from URL
      this.route.parent.paramMap
        .pipe(takeUntil(this.destroy$))
        .subscribe(params => {
          this.collectionId = params.get('Id') || params.get('id');
          console.log('Collection ID from URL:', this.collectionId);
          if (this.collectionId) {
            this.loadSpecimens();
          }
        });
    }
    
    // Subscribe to collection data
    this.collection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collection => {
        if (collection) {
          console.log('Collection loaded via NgRx:', collection);
        }
      });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collection: ${error}`, 'error');
        }
      });
    
    console.log('Collection image component initialized with NgRx');
  }

  fetchProjectCollection(): void {
    console.log('Fetching project collection for formulaire context');
    
    // Load real collections using NgRx action
    this.store.dispatch(CollectionsActions.loadCollections());
    
    // Subscribe to real collections data
    this.store.select(selectAllCollections)
      .pipe(takeUntil(this.destroy$))
      .subscribe(collections => {
        if (collections && collections.length > 0) {
          // Use the first collection for now (in real app, would be based on project context)
          const collection = collections[0];
          this.collectionId = collection.id.toString();
          this.loadSpecimens();
          
          console.log('Real project collection loaded:', collection);
        } else {
          console.log('No collections found');
        }
      });
  }

  // Mock collection generation method removed - now using real API calls

  loadSpecimens(): void {
    if (this.collectionId) {
      console.log('Loading specimens for collection:', this.collectionId);
      
      // Load real specimens using NgRx action
      this.store.dispatch(CollectionsActions.loadSpecimensByCollection({ collectionId: parseInt(this.collectionId) }));
      
      // Subscribe to real specimens data
      this.store.select(selectAllSpecimens)
        .pipe(takeUntil(this.destroy$))
        .subscribe(specimens => {
          if (specimens && specimens.length > 0) {
            this.collectionSpecimens = specimens;
            this.specimensSubject.next(specimens);
            this.sortPlantsByScientificName();
            
            console.log('Real specimens loaded:', specimens.length, 'items');
          } else {
            console.log('No specimens found for collection:', this.collectionId);
            this.collectionSpecimens = [];
            this.specimensSubject.next([]);
          }
        });
    }
  }

  // Mock specimens generation method removed - now using real API calls

  sortPlantsByScientificName(): void {
    this.collectionSpecimens.sort((a, b) => a.nomScientifique.localeCompare(b.nomScientifique));
    this.specimensSubject.next([...this.collectionSpecimens]);
  }

  navigateToImageInf(plante: any): void {
    console.log('Navigating to image info for specimen:', plante.id);
    
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: this.collectionId! }));
    
    this.router.navigate([`/admin/corpus/${this.collectionId}/images`, plante.id], {
      state: { plante, plantes: this.collectionSpecimens }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
    console.log('View changed to:', view, 'isGridView:', this.isGridView);
  }
  
  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => 
      (word.includes('.') || word.endsWith('.') || word === '&') ? word : `<i>${word}</i>`
    ).join(' ');
  }

  // UI Helper methods
  trackBySpecimenId(index: number, specimen: any): number {
    return specimen.id;
  }

  getFamilyBadgeClass(family: string): string {
    switch (family) {
      case 'Fabaceae': return 'badge-primary';
      case 'Poaceae': return 'badge-success';
      case 'Asteraceae': return 'badge-warning';
      case 'Rubiaceae': return 'badge-info';
      case 'Euphorbiaceae': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getCountryFlag(country: string): string {
    switch (country) {
      case 'Senegal': return '🇸🇳';
      case 'Mali': return '🇲🇱';
      case 'Burkina Faso': return '🇧🇫';
      case 'Niger': return '🇳🇪';
      default: return '🌍';
    }
  }

  getSpecimenCount(): number {
    return this.collectionSpecimens.length;
  }

  getImageCount(): number {
    return this.collectionSpecimens.length; // Assuming one image per specimen
  }
}