import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faCircleInfo, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, takeUntil, BehaviorSubject, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, ProjectsActions, NavigationActions } from '../../store';
import { 
  selectAllCollections,
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectAllProjects,
  selectProjectsLoading,
  selectProjectsError 
} from '../../store/projects/projects.selectors';
import { 
  selectNavigationProjectId,
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';
@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    FontAwesomeModule,
    DatePipe,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent implements OnInit, OnDestroy {
  // UI Icons
  faTrash = faTrash;
  faEdit = faEdit;
  faCircleInfo = faCircleInfo;
  
  // NgRx Observables
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  projects$: Observable<any[]>;
  projectsLoading$: Observable<boolean>;
  projectsError$: Observable<string | null>;
  projectId$: Observable<string | null>;
  collectionId$: Observable<string | null>;
  
  // Reactive state management
  private collectionsSubject = new BehaviorSubject<any[]>([]);
  private projectsSubject = new BehaviorSubject<any[]>([]);
  private statsSubject = new BehaviorSubject<any>(null);
  
  // Component state
  sortMenuActive: boolean = false;
  p: number = 1;
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext: any;
  projets: Array<any> = [];
  collection: Array<any> = [];
  nbr_c = 0;
  nbr_m = '0';
  nbr_s = 0;
  nbr_e = '999.2M';
  formatted_nbr_s: string = '';
  formatted_nbr_c: string = '';
  projectId: any;
  cheminPlus = "assets/plus.png";
  cheminTot = "assets/tous.png";
  cheminMod = "assets/mod.png";
  cheminSpe = "assets/spe.png";
  cheminEsp = "assets/esp.png";
  collections: any = [];
  message_err: any;
  inProject: boolean = true;
  width: boolean = true;
  
  private destroy$ = new Subject<void>();

  /*data = {
    collect1: [
      {
        id: 'I22T455',
        nom: 'Rosiers hybrides',
        descrption: 'Variétés hybrides de rosiers',
        date: '29-01-2001',
        createur: 'Mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T456',
        nom: 'Légumes biologiques',
        descrption: 'Variétés de légumes biologiques',
        date: '30-01-2001',
        createur: 'Fatima',
        modele: 'Machine learning'
      },
      {
        id: 'I22T457',
        nom: 'Plantes succulentes',
        descrption: 'Variétés de plantes succulentes pour la décoration',
        date: '31-01-2001',
        createur: 'Sara',
        modele: 'Support vector machines'
      },
      {
        id: 'I22T458',
        nom: 'Fleurs exotiques',
        descrption: 'Variétés rares de fleurs exotiques',
        date: '28-01-2001',
        createur: 'Karim',
        modele: 'Neural networks'
      },
      {
        id: 'I22T459',
        nom: 'Herbes aromatiques',
        descrption: 'Variétés d\'herbes aromatiques pour la cuisine',
        date: '27-01-2001',
        createur: 'Amina',
        modele: 'Random forest'
      },
      {
        id: 'I22T460',
        nom: 'Plantes médicinales',
        descrption: 'Variétés de plantes médicinales pour la phytothérapie',
        date: '26-01-2001',
        createur: 'Ahmed',
        modele: 'Decision trees'
      },
    ],

    collect2: [
      {
        id: 'I22T458',
        nom: 'Fleurs exotiques',
        descrption: 'Variétés rares de fleurs exotiques',
        date: '28-01-2001',
        createur: 'Karim',
        modele: 'Neural networks'
      },
      {
        id: 'I22T459',
        nom: 'Herbes aromatiques',
        descrption: 'Variétés d\'herbes aromatiques pour la cuisine',
        date: '27-01-2001',
        createur: 'Amina',
        modele: 'Random forest'
      },
      {
        id: 'I22T460',
        nom: 'Plantes médicinales',
        descrption: 'Variétés de plantes médicinales pour la phytothérapie',
        date: '26-01-2001',
        createur: 'Ahmed',
        modele: 'Decision trees'
      },
    ]
  };*/
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.collections$ = this.store.select(selectAllCollections);
    this.collectionsLoading$ = this.store.select(selectCollectionsLoading);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    this.projects$ = this.store.select(selectAllProjects);
    this.projectsLoading$ = this.store.select(selectProjectsLoading);
    this.projectsError$ = this.store.select(selectProjectsError);
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
  }

  formatNumber(number: number): string {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + ' M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + ' K';
    } else {
      return number.toString();
    }
  }

  ngAfterViewInit() {
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(segment => segment.path).join('/');
      console.log(path)
      if (path === 'datasets') {
        this.width = true;
      } else {
        this.width = false;
      }
    });
  }

  ngOnInit(): void {
    this.inProject = this.router.url.includes('projects');
    
    // Subscribe to errors
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collections: ${error}`, 'error');
        }
      });
    
    this.projectsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load projects: ${error}`, 'error');
        }
      });
    
    // Handle route changes
    this.route.url
      .pipe(takeUntil(this.destroy$))
      .subscribe(urlSegments => {
        const path = urlSegments.map(segment => segment.path).join('/');
        this.handleRouteChange(path);
      });
    
    console.log('Collection component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleRouteChange(path: string): void {
    if (path === 'datasets' && !this.inProject) {
      console.log('Loading global datasets view');
      this.width = true;
      this.loadGlobalDatasets();
    } else {
      console.log('Loading project-specific collections');
      this.width = false;
      this.loadProjectCollections();
    }
  }

  private loadGlobalDatasets(): void {
    console.log('Loading global datasets from real API');
    
    // Load real data using NgRx actions
    this.store.dispatch(ProjectsActions.loadProjects({ userId: 1 })); // TODO: Get real user ID
    this.store.dispatch(CollectionsActions.loadCollections());
    
    // Subscribe to real data from store
    this.store.select(selectAllProjects)
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        if (projects && projects.length > 0) {
          this.projets = projects;
          this.projectsSubject.next(projects);
          console.log('Real projects loaded:', projects.length);
        }
      });
    
    this.store.select(selectAllCollections)
      .pipe(takeUntil(this.destroy$))
      .subscribe(collections => {
        if (collections && collections.length > 0) {
          this.collections = collections;
          this.collectionsSubject.next(collections);
          console.log('Real collections loaded:', collections.length);
          
          // Calculate statistics from real data
          this.calculateGlobalStats();
        }
      });
  }

  private loadProjectCollections(): void {
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.projectId = params['id'];
        console.log('Loading collections for project:', this.projectId);
        
        if (this.projectId) {
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: this.projectId }));
          
          // Load real collections using NgRx action
          this.store.dispatch(CollectionsActions.loadCollections());
          
          // Subscribe to real collections data
          this.store.select(selectAllCollections)
            .pipe(takeUntil(this.destroy$))
            .subscribe(collections => {
              if (collections && collections.length > 0) {
                this.collections = collections;
                this.collectionsSubject.next(collections);
                
                // Calculate statistics from real data
                this.calculateProjectStats(collections[0]); // Use first collection for stats
                
                console.log('Real project collections loaded:', {
                  projectId: this.projectId,
                  collections: collections.length,
                  stats: { nbr_c: this.nbr_c, nbr_s: this.nbr_s }
                });
              } else {
                console.log('No collections found for project:', this.projectId);
                this.collections = [];
                this.collectionsSubject.next([]);
              }
            });
        }
      });
  }

  private generateMockProjects(): any[] {
    return [
      {
        id: 1,
        nom: 'African Herbarium Research',
        description: 'Comprehensive study of African plant specimens',
        dateCreation: '2023-01-15',
        statut: 'active'
      },
      {
        id: 2,
        nom: 'Medicinal Plants Database',
        description: 'Collection of medicinal plant specimens',
        dateCreation: '2023-02-20',
        statut: 'active'
      },
      {
        id: 3,
        nom: 'Endangered Species Study',
        description: 'Research on endangered plant species',
        dateCreation: '2023-03-10',
        statut: 'active'
      }
    ];
  }

  private generateMockGlobalCollections(): any[] {
    return [
      {
        id: 1,
        nom: 'African Herbarium Collection',
        description: 'A comprehensive collection of African plant specimens',
        dateCreation: '2023-01-15',
        numberOfSpecimen: 1250,
        numberOfDataset: 5,
        projet: { id: 1, nom: 'African Herbarium Research' }
      },
      {
        id: 2,
        nom: 'Medicinal Plants Dataset',
        description: 'Collection of medicinal plant specimens with therapeutic properties',
        dateCreation: '2023-02-20',
        numberOfSpecimen: 850,
        numberOfDataset: 3,
        projet: { id: 2, nom: 'Medicinal Plants Database' }
      },
      {
        id: 3,
        nom: 'Endangered Species Collection',
        description: 'Research collection of endangered plant species',
        dateCreation: '2023-03-10',
        numberOfSpecimen: 420,
        numberOfDataset: 2,
        projet: { id: 3, nom: 'Endangered Species Study' }
      }
    ];
  }

  // Mock data generation methods removed - now using real API calls

  private calculateGlobalStats(): void {
    this.nbr_c = this.collections.length;
    this.nbr_s = this.collections.reduce((sum: number, collection: any) => sum + (collection.numberOfSpecimen || 0), 0);
    this.formatted_nbr_s = this.formatNumber(this.nbr_s);
    this.formatted_nbr_c = this.formatNumber(this.nbr_c);
  }

  private calculateProjectStats(collection: any): void {
    this.nbr_c = 1;
    this.nbr_s = collection.numberOfSpecimen || 0;
    this.formatted_nbr_s = this.formatNumber(this.nbr_s);
    this.formatted_nbr_c = this.formatNumber(this.nbr_c);
  }

  func_inf_C(c: any): void {
    console.log('Deleting collection:', c.id);
    
    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this collection. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete collection',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User confirmed deletion, calling backend API');
        
        // Dispatch NgRx action to delete from backend
        this.store.dispatch(CollectionsActions.deleteCollection({ collectionId: c.id }));
        
        // Subscribe to delete success/failure
        this.store.select(selectCollectionsLoading)
          .pipe(takeUntil(this.destroy$))
          .subscribe(isLoading => {
            if (!isLoading) {
              // Check if there's an error
              this.store.select(selectCollectionsError)
                .pipe(takeUntil(this.destroy$))
                .subscribe(error => {
                  if (!error) {
                    // Success - remove from local state
                    this.collections = this.collections.filter((collection: any) => collection.id !== c.id);
                    this.collectionsSubject.next([...this.collections]);
                    
                    // Recalculate statistics
                    if (this.inProject) {
                      this.calculateProjectStats(this.collections[0] || { numberOfSpecimen: 0 });
                    } else {
                      this.calculateGlobalStats();
                    }
                    
                    Swal.fire('Success', 'Collection deleted successfully', 'success');
                    console.log('Collection deleted successfully from backend');
                  } else {
                    // Error - show error message
                    Swal.fire('Error', `Failed to delete collection: ${error}`, 'error');
                    console.error('Failed to delete collection:', error);
                  }
                });
            }
          });
      }
    });
  }


  func_ajout_col(): void {
    console.log('Navigating to formulaire for collection creation');
    this.router.navigateByUrl("/admin/formulaire");
  }

  sortBy(field: string): void {
    console.log('Sorting by field:', field);
    
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    // Sort collections
    this.collections.sort((a: any, b: any) => {
      let aValue = this.getFieldValue(a, field);
      let bValue = this.getFieldValue(b, field);

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue - bValue;
      }
      return this.isAscending ? comparison : -comparison;
    });
    
    // Update reactive state
    this.collectionsSubject.next([...this.collections]);
  }

  getFieldValue(object: any, field: string): any {
    return field.split('.').reduce((o, i) => o?.[i], object);
  }

  onFinishClicked(collection: any): void {
    console.log('Navigating to collection details:', collection.id);
    
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: collection.id.toString() }));
    
    this.router.navigateByUrl(`/admin/datasets/${collection.id}/details`);
  }

  toggleSortMenu(): void {
    this.sortMenuActive = !this.sortMenuActive;
  }

  // UI Helper methods
  trackByCollectionId(index: number, collection: any): number {
    return collection.id;
  }

  trackByProjectId(index: number, project: any): number {
    return project.id;
  }

  getCollectionStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-secondary';
      case 'pending': return 'badge-warning';
      default: return 'badge-info';
    }
  }

  getProjectStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-secondary';
      case 'pending': return 'badge-warning';
      default: return 'badge-info';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getSortIcon(field: string): string {
    if (this.currentSortField !== field) {
      return 'bi-chevron-expand';
    }
    return this.isAscending ? 'bi-caret-up' : 'bi-caret-down';
  }

  isSortActive(field: string): boolean {
    return this.currentSortField === field;
  }


}
