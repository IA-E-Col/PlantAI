import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { FormsModule, Validators } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { ProjectsActions, NavigationActions, CollectionsActions } from '../../store';
import { 
  selectProjectById
} from '../../store/projects/projects.selectors';
import { 
  selectNavigationProjectId
} from '../../store/navigation/navigation.selectors';
import { 
  selectAllSpecimens,
  selectSpecimensByCollection,
  selectCollectionsLoading,
  selectCollectionsError
} from '../../store/collections/collections.selectors';



@Component({
  selector: 'app-images-form',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    DatePipe,
    FormsModule,
    RouterLink,
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './images-form.component.html',
  styleUrl: './images-form.component.css'
})
export class ImagesFormComponent implements OnInit, OnDestroy {
  afficherBouton: boolean = true;
  cheminPlante = 'assets/plante.png';
  p: number = 1;
  searchtext: any;
  // NgRx Observables
  project$: Observable<any>;
  projectId$: Observable<string | null>;
  specimens$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Component data
  plantes: any;
  test!: any
  id: string = '';
  isGridView = false;
  nb_img: number = 0;
  
  private destroy$ = new Subject<void>();

  // Tableau d'objets contenant les informations sur chaque plante
  /*plantes = [
    {
      nom: 'Rose',
      description: 'The rose is a type of flowering shrub. Its name comes from the Latin word Rosa. The flowers of the rose grow in many different colors, from the well-known red rose or yellow roses to white roses and even purple or blue roses.',
      taille: 'Medium to Large',
      genre: 'Rosa'
    },
    {
      nom: 'Sunflower',
      description: 'Sunflowers are usually tall annual or perennial plants that grow to a height of 300 cm (120 in) or more.',
      taille: 'Large',
      genre: 'Helianthus'
    },
    {
      nom: 'Orchid',
      description: 'Orchids are a diverse and widespread family of flowering plants, with blooms that are often colorful and fragrant.',
      taille: 'Small to Medium',
      genre: 'Orchidaceae'
    },
    {
      nom: 'Cactus',
      description: 'Cacti are succulent plants in the family Cactaceae, known for their distinctive appearance, often with spines and specialized photosynthetic stems.',
      taille: 'Small to Medium',
      genre: 'Cactaceae'
    },
    {
      nom: 'Tulip',
      description: 'Tulips are spring-blooming perennials that grow from bulbs. They are known for their vibrant colors and cup-shaped flowers.',
      taille: 'Small to Medium',
      genre: 'Tulipa'
    }
  ];*/

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.specimens$ = this.store.select(selectAllSpecimens);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    this.project$ = this.route.parent?.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        if (projectId) {
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId }));
          return this.store.select(selectProjectById(parseInt(projectId)));
        }
        return this.store.select(selectProjectById(0));
      })
    ) || this.store.select(selectProjectById(0));
  }

  ngOnInit(): void {
    this.afficherBouton = this.route.snapshot.data['afficherBouton'] !== false;
    
    // Get project ID from NgRx store
    this.project$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        if (project) {
          this.id = project.id;
          console.log('Project loaded via NgRx:', project);
        }
      });

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.test = params['id'];
        this.handleDataChange();
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.handleDataChange();
      });
    
    console.log('Images form component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDataChange(): void {
    console.log('Executing handleDataChange for project ID:', this.test);
    
    // Check if filtered specimens were passed from the parent component
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state['specimens']) {
      console.log('Using filtered specimens from parent component:', navigation.extras.state['specimens'].length);
      this.plantes = navigation.extras.state['specimens'];
      this.nb_img = this.plantes.length;
      // Sort specimens by scientific name if method exists
      if (this.plantes && this.plantes.length > 0) {
        this.plantes.sort((a: any, b: any) => {
          const nameA = a.nomScientifique || '';
          const nameB = b.nomScientifique || '';
          return nameA.localeCompare(nameB);
        });
      }
      return;
    }
    
    // Load real specimens from the project's corpus (collection)
    if (this.test && Number(this.test) > 0) {
      console.log('Loading specimens from project corpus for project ID:', this.test);
      
      // Try to get the project from the store first
      this.project$
        .pipe(takeUntil(this.destroy$))
        .subscribe(project => {
          if (project && project.collection && project.collection.id) {
            const collectionId = project.collection.id;
            console.log('Loading specimens from collection ID:', collectionId);
            this.loadSpecimensForCollection(collectionId);
          } else {
            console.log('Project not found in store for project ID:', this.test, 'project:', project);
            // If project not found in store, try to load it directly
            this.loadProjectAndSpecimens(Number(this.test));
          }
        });
    } else {
      console.log('Invalid project ID:', this.test);
      this.plantes = [];
      this.nb_img = 0;
    }
  }

  private loadProjectAndSpecimens(projectId: number): void {
    // Make a direct API call to get the project data
    fetch(`http://localhost:8080/api/projets/${projectId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Project with ID ${projectId} not found (${response.status})`);
        }
        return response.json();
      })
      .then(project => {
        if (project && project.collection && project.collection.id) {
          const collectionId = project.collection.id;
          console.log('Project loaded via direct API call, collection ID:', collectionId);
          this.loadSpecimensForCollection(collectionId);
        } else {
          console.log('Project or collection not found for project ID:', projectId);
          this.plantes = [];
          this.nb_img = 0;
        }
      })
      .catch(error => {
        console.error('Error loading project:', error);
        console.log('Available projects: 1, 2, 3, 28, 29. Please use an existing project ID.');
        this.plantes = [];
        this.nb_img = 0;
      });
  }

  private loadSpecimensForCollection(collectionId: number): void {
    // Load specimens from the project's corpus
    this.store.dispatch(CollectionsActions.loadSpecimensByCollection({ collectionId }));
    
    // Subscribe to specimens data for this specific collection only
    this.store.select(selectSpecimensByCollection(collectionId))
      .pipe(takeUntil(this.destroy$))
      .subscribe(specimens => {
        if (specimens && specimens.length > 0) {
          this.plantes = specimens;
          this.nb_img = specimens.length;
          console.log('Real specimens loaded from corpus:', specimens.length, 'items for collection ID:', collectionId);
        } else {
          console.log('No specimens found in corpus for collection ID:', collectionId);
          this.plantes = [];
          this.nb_img = 0;
        }
      });
  }

  // Mock data generation method removed - now using real API calls


  navigateToImageInf(plante: any) {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: this.plantes }
    });
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

}
