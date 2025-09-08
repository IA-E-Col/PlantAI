import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { FormsModule, Validators } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { SafeHtml } from '@angular/platform-browser';
import { Observable, Subject, takeUntil, BehaviorSubject, combineLatest, map } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { NavigationActions } from '../../store';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';



@Component({
  selector: 'app-list-images',
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
  templateUrl: './list-images.component.html',
  styleUrls: ['./list-images.component.css'],
})

export class ListImagesComponent implements OnInit, OnDestroy {

  afficherBouton: boolean = true;
  cheminPlante = 'assets/plante.png';
  p: number = 1;
  searchtext: any;
  // NgRx Observables
  datasetId$: Observable<string | null>;
  
  // Component data and reactive state
  private plantesSubject = new BehaviorSubject<any[]>([]);
  plantes$: Observable<any[]> = this.plantesSubject.asObservable();
  private originalPlantesSubject = new BehaviorSubject<any[]>([]);
  
  plantes: any;
  Old_plantes: any;
  test!: any
  id: string = '';
  isGridView = false;
  
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
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
  }

  ngOnInit(): void {
    this.afficherBouton = this.route.snapshot.data['afficherBouton'] !== false;
    
    // Get dataset ID from route and update navigation state
    this.test = this.route.snapshot.parent?.paramMap.get('id');
    console.log('Dataset ID from route:', this.test);
    
    if (this.test) {
      this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: this.test }));
    }
    
    this.handleDataChange();
    
    console.log('List images component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDataChange(): void {
    console.log('Executing handleDataChange for dataset:', this.test);

    // Generate mock specimen data based on dataset ID
    if (Number(this.test) <= 0) {
      console.log('Loading default specimens for ID <= 0');
      this.plantes = this.generateMockSpecimensForDataset('default');
    } else {
      console.log('Loading specimens for dataset:', this.test);
      this.plantes = this.generateMockSpecimensForDataset(this.test);
    }
    
    this.sortPlantsByScientificName();
    this.Old_plantes = [...this.plantes]; // Create copy
    this.extractDistinctValues();
    
    // Update reactive subjects
    this.plantesSubject.next(this.plantes);
    this.originalPlantesSubject.next(this.Old_plantes);
    
    console.log('Mock specimens loaded:', this.plantes?.length || 0, 'items');
    
    // TODO: Replace with proper NgRx specimens loading
    // this.store.dispatch(SpecimensActions.loadSpecimensByDataset({ datasetId: this.test }));
  }

  private generateMockSpecimensForDataset(datasetId: string): any[] {
    const baseSpecimens = [
      {
        id: 1,
        catalogueCode: `DS${datasetId}_SPEC001`,
        nomScientifique: 'Rosa gallica L.',
        genre: 'Rosa',
        famille: 'Rosaceae',
        epitheteSpecifique: 'gallica',
        pays: 'France',
        ville: 'Paris',
        image: { image_url: 'assets/uploads/rose1.jpg' },
        dateCreation: '2023-01-15'
      },
      {
        id: 2,
        catalogueCode: `DS${datasetId}_SPEC002`,
        nomScientifique: 'Quercus robur L.',
        genre: 'Quercus',
        famille: 'Fagaceae',
        epitheteSpecifique: 'robur',
        pays: 'Germany',
        ville: 'Berlin',
        image: { image_url: 'assets/uploads/oak1.jpg' },
        dateCreation: '2023-01-20'
      },
      {
        id: 3,
        catalogueCode: `DS${datasetId}_SPEC003`,
        nomScientifique: 'Pinus sylvestris L.',
        genre: 'Pinus',
        famille: 'Pinaceae',
        epitheteSpecifique: 'sylvestris',
        pays: 'Sweden',
        ville: 'Stockholm',
        image: { image_url: 'assets/uploads/pine1.jpg' },
        dateCreation: '2023-01-25'
      },
      {
        id: 4,
        catalogueCode: `DS${datasetId}_SPEC004`,
        nomScientifique: 'Fagus sylvatica L.',
        genre: 'Fagus',
        famille: 'Fagaceae',
        epitheteSpecifique: 'sylvatica',
        pays: 'France',
        ville: 'Lyon',
        image: { image_url: 'assets/uploads/beech1.jpg' },
        dateCreation: '2023-02-01'
      }
    ];
    
    // Add more variety for different datasets
    if (datasetId !== 'default' && Number(datasetId) > 0) {
      return baseSpecimens.concat(baseSpecimens.map(s => ({ 
        ...s, 
        id: s.id + 10, 
        catalogueCode: s.catalogueCode.replace('SPEC', 'VAR'), 
        nomScientifique: s.nomScientifique + ' var. ' + datasetId 
      })));
    }
    
    return baseSpecimens;
  }

  sortPlantsByScientificName(): void {
    this.plantes.sort((a: { nomScientifique: number; }, b: { nomScientifique: number; }) => {
      if (a.nomScientifique < b.nomScientifique) {
        return -1;
      } else if (a.nomScientifique > b.nomScientifique) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  navigateToImageInf(plante: any) {
    this.router.navigate([`/admin/datasets/${this.test}/images`, plante.id], {
      state: { plante: plante, plantes: this.plantes }
    });
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => {
      // Check if the word contains a period or ends with a period, or is '&'
      if (word.includes('.') || word.endsWith('.') || word === '&') {
        return word; // Return word as is
      } else {
        return `<i>${word}</i>`; // Italicize other words
      }
    }).join(' '); // Join words back into a string
  }

  filterMenuActive: boolean = false;

  distinctGenera: string[] = [];
  distinctFamilies: string[] = [];
  distinctSpecificEpithets: string[] = [];

  filters = {
    Genus: '',
    Family: '',
    SpecificEpithet: ''
  };

  toggleFilterMenu() {
    this.filterMenuActive = !this.filterMenuActive;
  }

  resetFilters() {
    this.filters = {
      Genus: '',
      Family: '',
      SpecificEpithet: ''
    };
    this.plantes = [...this.Old_plantes]; // Create copy
    
    // Update reactive state
    this.plantesSubject.next(this.plantes);
    
    this.extractDistinctValues();
    this.toggleFilterMenu();
    
    console.log('Filters reset. Showing all specimens:', this.plantes.length);
  }

  applyFilters() {
    if (this.filters.Genus === '' && this.filters.Family === '' && this.filters.SpecificEpithet === '') {
      this.resetFilters();
    } else {
      this.plantes = this.Old_plantes.filter((plante: { genre: string; famille: string; epitheteSpecifique: string; }) => {
        return (
          (this.filters.Genus === '' || plante.genre === this.filters.Genus) &&
          (this.filters.Family === '' || plante.famille === this.filters.Family) &&
          (this.filters.SpecificEpithet === '' || plante.epitheteSpecifique === this.filters.SpecificEpithet)
        );
      });
    }
    
    // Update reactive state
    this.plantesSubject.next(this.plantes);
    
    this.extractDistinctValues();
    this.toggleFilterMenu();
    
    console.log('Filters applied. Results:', this.plantes.length, 'specimens');
  }

  extractDistinctValues() {
    const generaSet = new Set<string>();
    const familiesSet = new Set<string>();
    const specificEpithetsSet = new Set<string>();

    this.plantes.forEach((plante: { genre: string; famille: string; epitheteSpecifique: string; }) => {
      if (plante.genre) {
        generaSet.add(plante.genre);
      }
      if (plante.famille) {
        familiesSet.add(plante.famille);
      }
      if (plante.epitheteSpecifique) {
        specificEpithetsSet.add(plante.epitheteSpecifique);
      }
    });

    this.distinctGenera = Array.from(generaSet);
    this.distinctFamilies = Array.from(familiesSet);
    this.distinctSpecificEpithets = Array.from(specificEpithetsSet);
  }

}
