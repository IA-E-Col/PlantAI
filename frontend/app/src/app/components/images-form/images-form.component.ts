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
import { ProjectsActions, NavigationActions } from '../../store';
import { 
  selectProjectById
} from '../../store/projects/projects.selectors';
import { 
  selectNavigationProjectId
} from '../../store/navigation/navigation.selectors';



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
    console.log('Executing handleDataChange for test ID:', this.test);
    
    // Generate mock specimen data based on test ID
    if (this.test === '17') {
      console.log('Loading specimens for special ID 17');
      this.plantes = this.generateMockSpecimens('special');
      this.nb_img = this.plantes.length;
    } else {
      console.log('Loading default specimens for ID:', this.test);
      this.plantes = this.generateMockSpecimens('default');
      this.nb_img = this.plantes.length;
    }
    
    console.log('Mock specimens loaded:', this.plantes?.length || 0, 'items');
    
    // TODO: Replace with proper NgRx specimens loading
    // this.store.dispatch(SpecimensActions.loadSpecimensByDataset({ datasetId: this.test }));
  }

  private generateMockSpecimens(type: 'special' | 'default'): any[] {
    const baseSpecimens = [
      {
        id: 1,
        catalogueCode: 'SPEC001',
        nomScientifique: 'Rosa gallica L.',
        genre: 'Rosa',
        famille: 'Rosaceae',
        image: { image_url: 'assets/uploads/rose1.jpg' },
        dateCreation: '2023-01-15'
      },
      {
        id: 2,
        catalogueCode: 'SPEC002',
        nomScientifique: 'Quercus robur L.',
        genre: 'Quercus',
        famille: 'Fagaceae',
        image: { image_url: 'assets/uploads/oak1.jpg' },
        dateCreation: '2023-01-20'
      },
      {
        id: 3,
        catalogueCode: 'SPEC003',
        nomScientifique: 'Pinus sylvestris L.',
        genre: 'Pinus',
        famille: 'Pinaceae',
        image: { image_url: 'assets/uploads/pine1.jpg' },
        dateCreation: '2023-01-25'
      }
    ];
    
    if (type === 'special') {
      // Add more specimens for special case
      return [...baseSpecimens, ...baseSpecimens.map(s => ({ ...s, id: s.id + 10, catalogueCode: s.catalogueCode + '_SP' }))];
    }
    
    return baseSpecimens;
  }


  navigateToImageInf(plante: any) {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: this.plantes }
    });
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

}
