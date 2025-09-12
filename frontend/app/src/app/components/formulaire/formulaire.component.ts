import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { CollectionsActions, ProjectsActions, ModelsActions, NavigationActions } from '../../store';
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
  selectAllModels,
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';
import { 
  selectNavigationProjectId,
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';
interface ClasseAnnotation {
  id: number;
  identifier: string;
  name: string;
}

// Interface pour Modele
interface Modele {
  id: number;
  name: string;
  description: string;
  urlModele: string;
  categorie: string;
}

// Interface pour ModelResponse
interface ModelResponse {
  model: Modele;
  classes: ClasseAnnotation[];
  selectedClass: string | null; // Utilisation de 'number' pour correspondre à 'Long' en Java
}
@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, AsyncPipe],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})

// Define the Specimen interface

export class FormulaireComponent implements OnInit, OnDestroy {
  // NgRx Observables
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  projects$: Observable<any[]>;
  projectsLoading$: Observable<boolean>;
  projectsError$: Observable<string | null>;
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  projectId$: Observable<string | null>;
  collectionId$: Observable<string | null>;
  
  // Reactive state management
  private filterValuesSubject = new BehaviorSubject<string[][]>([]);
  private modelsForAnnotationsSubject = new BehaviorSubject<ModelResponse[]>([]);
  private specimensSubject = new BehaviorSubject<any[]>([]);
  
  // Component state
  filterValues: string[][] = [];
  message_err: string = '';
  familyOptions: string[] = [];
  genreOptions: string[] = [];
  specificEpithetOptions: string[] = [];
  scientificNameOptions: string[] = [];
  scientificNameAuthorOptions: string[] = [];
  countryOptions: string[] = [];
  cityOptions: string[] = [];
  locationOptions: string[] = [];
  departmentOptions: string[] = [];
  recordedByOptions: string[] = [];
  id: any;
  ModelsForAnnotations: ModelResponse[] = [];
  Filtres: {
    test: string[][];
    selectedAnnotations: { modelid: number; classeid: string | null }[];
  } = {
    test: [],
    selectedAnnotations: []
  };
  p: number = 1;
  isLoading: boolean = false;
  
  // Reactive form
  filterForm: FormGroup;
  
  private destroy$ = new Subject<void>();

  constructor(
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
    this.models$ = this.store.select(selectAllModels);
    this.modelsLoading$ = this.store.select(selectModelsLoading);
    this.modelsError$ = this.store.select(selectModelsError);
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
    
    // Initialize reactive form
    this.filterForm = new FormGroup({
      country: new FormControl(''),
      genus: new FormControl(''),
      collectedBy: new FormControl(''),
      family: new FormControl(''),
      specificEpithet: new FormControl(''),
      scientificName: new FormControl(''),
      scientificNameAuthor: new FormControl(''),
      city: new FormControl(''),
      department: new FormControl(''),
      location: new FormControl('')
    });
  }

  ngOnInit(): void {
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
    
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });
    
    // Load filter data
    this.loadFilterData();
    this.loadModelsForAnnotations();
    
    console.log('Formulaire component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFilterData(): void {
    console.log('Loading filter data');
    
    // Load real filter values from specimen data instead of mock data
    this.loadRealFilterValues();
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('Filter data loading initiated - will load real specimens');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(CollectionsActions.loadFilterFields());
  }

  private loadRealFilterValues(): void {
    console.log('Loading real filter values from specimen data');
    
    // Get the current project ID from NgRx store
    this.projectId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectId => {
        if (projectId) {
          console.log('Loading real specimens for filter options, project ID:', projectId);
          
          // Load real specimens from the project's corpus to extract filter options
          this.loadSpecimensForFilterOptions(Number(projectId));
        } else {
          console.log('No project ID available, using mock filter values');
          // Fallback to mock values if no project is selected
          const mockFilterValues = this.generateMockFilterValues();
          this.filterValues = mockFilterValues;
          this.filterValuesSubject.next(mockFilterValues);
          this.populateFilterOptions();
          this.populateSuggestions();
        }
      });
  }

  private loadSpecimensForFilterOptions(projectId: number): void {
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
          console.log('Loading specimens from collection ID for filter options:', collectionId);
          
          // Load specimens from the collection
          return fetch(`http://localhost:8080/api/collections/${collectionId}/specimen`);
        } else {
          throw new Error('Project or collection not found');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load specimens (${response.status})`);
        }
        return response.json();
      })
      .then(specimens => {
        console.log('Real specimens loaded for filter options:', specimens.length);
        
        // Extract unique values from real specimen data
        const realFilterValues = this.extractFilterValuesFromSpecimens(specimens);
        this.filterValues = realFilterValues;
        this.filterValuesSubject.next(realFilterValues);
        
        // Populate options
        this.populateFilterOptions();
        this.populateSuggestions();
        
        console.log('Real filter values extracted:', realFilterValues);
      })
      .catch(error => {
        console.error('Error loading specimens for filter options:', error);
        // Fallback to mock values on error
        const mockFilterValues = this.generateMockFilterValues();
        this.filterValues = mockFilterValues;
        this.filterValuesSubject.next(mockFilterValues);
        this.populateFilterOptions();
        this.populateSuggestions();
      });
  }

  private extractFilterValuesFromSpecimens(specimens: any[]): string[][] {
    const uniqueValues: { [key: string]: Set<string> } = {
      countries: new Set(),
      recordedBy: new Set(),
      locations: new Set(),
      cities: new Set(),
      departments: new Set(),
      scientificNames: new Set(),
      families: new Set(),
      specificEpithets: new Set(),
      genera: new Set(),
      scientificNameAuthors: new Set()
    };

    specimens.forEach(specimen => {
      if (specimen.pays) uniqueValues['countries'].add(specimen.pays);
      if (specimen.enregistrePar) uniqueValues['recordedBy'].add(specimen.enregistrePar);
      if (specimen.lieu) uniqueValues['locations'].add(specimen.lieu);
      if (specimen.ville) uniqueValues['cities'].add(specimen.ville);
      if (specimen.departement) uniqueValues['departments'].add(specimen.departement);
      if (specimen.nomScientifique) uniqueValues['scientificNames'].add(specimen.nomScientifique);
      if (specimen.famille) uniqueValues['families'].add(specimen.famille);
      if (specimen.epitheteSpecifique) uniqueValues['specificEpithets'].add(specimen.epitheteSpecifique);
      if (specimen.genre) uniqueValues['genera'].add(specimen.genre);
      if (specimen.nomScientifiqueAuteur) uniqueValues['scientificNameAuthors'].add(specimen.nomScientifiqueAuteur);
    });

    return [
      Array.from(uniqueValues['countries']).sort(),
      [], // Empty for index 1
      Array.from(uniqueValues['recordedBy']).sort(),
      Array.from(uniqueValues['locations']).sort(),
      Array.from(uniqueValues['cities']).sort(),
      Array.from(uniqueValues['departments']).sort(),
      Array.from(uniqueValues['scientificNames']).sort(),
      Array.from(uniqueValues['families']).sort(),
      Array.from(uniqueValues['specificEpithets']).sort(),
      Array.from(uniqueValues['genera']).sort(),
      [], // Empty for index 10
      [], // Empty for index 11
      [], // Empty for index 12
      [], // Empty for index 13
      [], // Empty for index 14
      Array.from(uniqueValues['scientificNameAuthors']).sort()
    ];
  }

  private loadModelsForAnnotations(): void {
    console.log('Loading models for annotations');
    
    // Generate mock models for annotations
    const mockModels = this.generateMockModelsForAnnotations();
    this.ModelsForAnnotations = mockModels;
    this.modelsForAnnotationsSubject.next(mockModels);
    
    console.log('Models for annotations loaded:', mockModels);
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(ModelsActions.loadModelsForAnnotations());
  }

  private generateMockFilterValues(): string[][] {
    return [
      // Country options (index 0) - Updated with real data
      ['France', 'Afrique australe', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Guinea', 'Ivory Coast'],
      // Recorded by options (index 2) - Updated with real data
      ['Wilms, F.', 'Dr. Marie Dubois', 'Prof. Jean Martin', 'Dr. Sophie Laurent', 'Dr. Ahmed Diallo'],
      // Location options (index 3)
      ['Dakar', 'Bamako', 'Ouagadougou', 'Niamey', 'Conakry', 'Abidjan'],
      // City options (index 4)
      ['Dakar', 'Bamako', 'Ouagadougou', 'Niamey', 'Conakry', 'Abidjan'],
      // Department options (index 5)
      ['Botany', 'Ecology', 'Taxonomy', 'Conservation'],
      // Scientific name options (index 6) - Updated with real data
      ['Senecio pubigerus L.', 'Acacia senegalensis', 'Panicum maximum', 'Vernonia amygdalina', 'Psychotria capensis'],
      // Family options (index 7) - Updated with real data
      ['Apiaceae', 'Asteraceae', 'Caryophyllaceae', 'Fabaceae', 'Poaceae', 'Rubiaceae', 'Euphorbiaceae'],
      // Specific epithet options (index 8) - Updated with real data
      ['pubigerus', 'senegalensis', 'maximum', 'amygdalina', 'capensis', 'hirta'],
      // Genus options (index 9) - Updated with real data
      ['Eryngium', 'Senecio', 'Silene', 'Astragalus', 'Ononis', 'Acacia', 'Panicum', 'Vernonia', 'Psychotria', 'Euphorbia'],
      // Scientific name author options (index 15) - Updated with real data
      ['L.', 'Willd.', 'Schumach.', 'Thonn.', 'Benth.']
    ];
  }

  private generateMockModelsForAnnotations(): ModelResponse[] {
    return [
      {
        model: {
          id: 1,
          name: 'PlantNet African Model',
          description: 'AI model for African plant identification',
          urlModele: '/models/plantnet-african.pt',
          categorie: 'Plant Identification'
        },
        classes: [
          { id: 1, identifier: 'acacia_senegalensis', name: 'Acacia senegalensis' },
          { id: 2, identifier: 'panicum_maximum', name: 'Panicum maximum' },
          { id: 3, identifier: 'vernonia_amygdalina', name: 'Vernonia amygdalina' }
        ],
        selectedClass: null
      },
      {
        model: {
          id: 2,
          name: 'Leaf Classification Model',
          description: 'Model for leaf shape and texture classification',
          urlModele: '/models/leaf-classification.pt',
          categorie: 'Leaf Analysis'
        },
        classes: [
          { id: 4, identifier: 'simple_leaf', name: 'Simple Leaf' },
          { id: 5, identifier: 'compound_leaf', name: 'Compound Leaf' },
          { id: 6, identifier: 'needle_leaf', name: 'Needle Leaf' }
        ],
        selectedClass: null
      }
    ];
  }

  private populateFilterOptions(): void {
    if (this.filterValues.length >= 10) {
      this.countryOptions = this.filterValues[0].filter(option => option !== null);
      this.recordedByOptions = this.filterValues[2].filter(option => option !== null);
      this.locationOptions = this.filterValues[3].filter(option => option !== null);
      this.cityOptions = this.filterValues[4].filter(option => option !== null);
      this.departmentOptions = this.filterValues[5].filter(option => option !== null);
      this.scientificNameOptions = this.filterValues[6].filter(option => option !== null);
      this.familyOptions = this.filterValues[7].filter(option => option !== null);
      this.specificEpithetOptions = this.filterValues[8].filter(option => option !== null);
      this.genreOptions = this.filterValues[9].filter(option => option !== null);
      this.scientificNameAuthorOptions = this.filterValues[15]?.filter(option => option !== null) || [];
    }
  }

  populateSuggestions(): void {
    const suggestions: { [key: string]: string[] } = {
      'Family': this.familyOptions,
      'Genre': this.genreOptions,
      'Specific Epithet': this.specificEpithetOptions,
      'Scientific Name': this.scientificNameOptions,
      'Scientific Name Author': this.scientificNameAuthorOptions,
      'Country': this.countryOptions,
      'City': this.cityOptions,
      'Location': this.locationOptions,
      'Department': this.departmentOptions,
      'Recorded By': this.recordedByOptions
    };

    console.log(suggestions);

    Object.keys(suggestions).forEach(key => {
      const datalist = document.getElementById(`${key.toLowerCase().replace(/\s+/g, '-')}-suggestions`) as HTMLDataListElement | null;
      if (datalist) {
        suggestions[key].forEach(value => {
          const option = document.createElement('option');
          option.value = value;
          datalist.appendChild(option);
        });
      }
    });
  }

  setupEventListeners(): void {
    const form = document.getElementById('tag-form') as HTMLFormElement;

    // Empêcher la soumission automatique du formulaire sur 'Enter'
    form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        event.preventDefault(); // Empêche la soumission par défaut sur 'Enter'
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();  //Empêche la soumission par défaut du formulaire
      this.handleSubmit(form); // Soumet le formulaire via votre méthode handleSubmit
    });

    const inputFields = form.querySelectorAll('.input-field');
    inputFields.forEach(inputField => {
      inputField.addEventListener('keyup', (event) => {
        const keyboardEvent = event as KeyboardEvent;
        const target = event.target as HTMLInputElement;
        if (keyboardEvent.key === 'Enter' && target.value.trim() !== '') {
          this.addTag(target.value.trim(), inputField.closest('.tag-container') as HTMLElement);
          target.value = '';
          event.stopPropagation(); //Empêche la propagation de l'événement pour éviter la soumission automatique du formulaire
        }
      });
    });
  }

  handleSubmit(form: HTMLFormElement): void {
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Handling form submission');
    this.isLoading = true;
    
    // Prepare selected annotations
    this.Filtres.selectedAnnotations = this.ModelsForAnnotations.map(m => ({
      modelid: m.model.id,
      classeid: m.selectedClass,
    }));

    console.log("Selected annotations:", this.Filtres.selectedAnnotations);

    // Extract tags from form
    const allTags: { [key: string]: string[] } = {};
    const fieldContainers = form.querySelectorAll('.field-container');

    console.log('Extracting tags from form...');
    fieldContainers.forEach(container => {
      const label = container.querySelector('label')?.innerText || '';
      const tagContainer = container.querySelector('.tag-container') as HTMLElement;

      if (tagContainer) {
        const tags = this.getUniqueTags(tagContainer);
        allTags[label] = tags;
        console.log(`Field "${label}":`, tags);
      } else {
        console.warn(`No tag container found for ${label}`);
      }
    });
    
    console.log('All extracted tags:', allTags);

    // Prepare filter options - match the array structure from generateMockFilterValues
    const selectedOptions = [
      allTags['Country'] || [],                    // index 0
      [],                                          // index 1 (empty)
      allTags['Collected By'] || [],              // index 2
      allTags['Location'] || [],                  // index 3
      allTags['City'] || [],                      // index 4
      allTags['Department'] || [],                // index 5
      allTags['Scientific Name'] || [],           // index 6
      allTags['Family'] || [],                    // index 7
      allTags['Specific Epithet'] || [],          // index 8
      allTags['Genus'] || [],                     // index 9
      [],                                          // index 10 (empty)
      [],                                          // index 11 (empty)
      [],                                          // index 12 (empty)
      [],                                          // index 13 (empty)
      [],                                          // index 14 (empty)
      allTags['Scientific Name Author'] || []     // index 15
    ];
    
    this.Filtres.test = selectedOptions;
    console.log('Complete filters:', this.Filtres);
    
    // Simulate specimen filtering
    this.filterSpecimens();
  }

  private filterSpecimens(): void {
    console.log('Filtering specimens with filters:', this.Filtres);
    
    // Get the current project ID from NgRx store
    this.projectId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectId => {
        if (projectId) {
          console.log('Loading real specimens for project ID:', projectId);
          
          // Load real specimens from the project's corpus
          this.loadRealSpecimensAndFilter(Number(projectId));
        } else {
          console.error('No project ID available for filtering');
          Swal.fire('Error', 'No project selected. Please select a project first.', 'error');
        }
      });
  }

  private loadRealSpecimensAndFilter(projectId: number): void {
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
          console.log('Loading specimens from collection ID:', collectionId);
          
          // Load specimens from the collection
          return fetch(`http://localhost:8080/api/collections/${collectionId}/specimen`);
        } else {
          throw new Error('Project or collection not found');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load specimens (${response.status})`);
        }
        return response.json();
      })
      .then(specimens => {
        console.log('Real specimens loaded:', specimens.length);
        
        // Apply filters to real specimens
        const filteredSpecimens = this.applyFiltersToSpecimens(specimens);
        console.log('Specimens after filtering:', filteredSpecimens.length);
        
        // Navigate to images form with filtered specimens
        const timestamp = new Date().getTime();
        this.router.navigate([`/admin/formulaire/images-form/${projectId}`], { 
          queryParams: { timestamp },
          state: { specimens: filteredSpecimens, filters: this.Filtres }
        });
        
        console.log('Specimens filtered successfully:', filteredSpecimens.length, 'items');
      })
      .catch(error => {
        console.error('Error loading specimens:', error);
        Swal.fire('Error', `Failed to load specimens: ${error.message}`, 'error');
      });
  }

  private applyFiltersToSpecimens(specimens: any[]): any[] {
    let filteredSpecimens = [...specimens];
    
    // Apply family filter
    if (this.Filtres.test[7] && this.Filtres.test[7].length > 0) {
      const families = this.Filtres.test[7];
      filteredSpecimens = filteredSpecimens.filter(specimen => 
        families.some(family => specimen.famille && specimen.famille.toLowerCase().includes(family.toLowerCase()))
      );
    }
    
    // Apply genus filter
    if (this.Filtres.test[9] && this.Filtres.test[9].length > 0) {
      const genera = this.Filtres.test[9];
      filteredSpecimens = filteredSpecimens.filter(specimen => 
        genera.some(genus => specimen.genre && specimen.genre.toLowerCase().includes(genus.toLowerCase()))
      );
    }
    
    // Apply country filter
    if (this.Filtres.test[0] && this.Filtres.test[0].length > 0) {
      const countries = this.Filtres.test[0];
      filteredSpecimens = filteredSpecimens.filter(specimen => 
        countries.some(country => specimen.pays && specimen.pays.toLowerCase().includes(country.toLowerCase()))
      );
    }
    
    // Apply scientific name filter
    if (this.Filtres.test[6] && this.Filtres.test[6].length > 0) {
      const scientificNames = this.Filtres.test[6];
      filteredSpecimens = filteredSpecimens.filter(specimen => 
        scientificNames.some(name => specimen.nomScientifique && specimen.nomScientifique.toLowerCase().includes(name.toLowerCase()))
      );
    }
    
    // Apply location filter
    if (this.Filtres.test[3] && this.Filtres.test[3].length > 0) {
      const locations = this.Filtres.test[3];
      filteredSpecimens = filteredSpecimens.filter(specimen => 
        locations.some(location => specimen.lieu && specimen.lieu.toLowerCase().includes(location.toLowerCase()))
      );
    }
    
    // Apply city filter
    if (this.Filtres.test[4] && this.Filtres.test[4].length > 0) {
      const cities = this.Filtres.test[4];
      filteredSpecimens = filteredSpecimens.filter(specimen => 
        cities.some(city => specimen.ville && specimen.ville.toLowerCase().includes(city.toLowerCase()))
      );
    }
    
    return filteredSpecimens;
  }

  private generateMockFilteredSpecimens(): any[] {
    const specimens = [];
    const families = ['Fabaceae', 'Poaceae', 'Asteraceae', 'Rubiaceae', 'Euphorbiaceae'];
    const genres = ['Acacia', 'Panicum', 'Vernonia', 'Psychotria', 'Euphorbia'];
    const species = ['senegalensis', 'maximum', 'amygdalina', 'capensis', 'hirta'];
    const countries = ['Senegal', 'Mali', 'Burkina Faso', 'Niger'];
    
    for (let i = 1; i <= 50; i++) {
      const family = families[Math.floor(Math.random() * families.length)];
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const specie = species[Math.floor(Math.random() * species.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      
      specimens.push({
        id: i,
        nom: `${genre} ${specie}`,
        nomScientifique: `${genre} ${specie}`,
        famille: family,
        genre: genre,
        espece: specie,
        pays: country,
        ville: country === 'Senegal' ? 'Dakar' : 'Capital',
        localisation: `${country} - Region ${i}`,
        collecteur: ['Dr. Marie Dubois', 'Prof. Jean Martin', 'Dr. Sophie Laurent'][Math.floor(Math.random() * 3)],
        departement: ['Botany', 'Ecology', 'Taxonomy'][Math.floor(Math.random() * 3)],
        imageUrl: `assets/uploads/specimen_${i}.jpg`,
        dateCollecte: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        statut: 'active'
      });
    }
    
    return specimens;
  }

  getUniqueTags(tagContainer: HTMLElement): string[] {
    const tags: string[] = [];
    const tagValues = new Set<string>();

    const tagElements = tagContainer.getElementsByClassName('tag');
    for (let i = 0; i < tagElements.length; i++) {
      const tagElement = tagElements[i] as HTMLElement;
      let tagValue = tagElement.textContent?.trim() || '';

      // Remove the 'x' from the end of the tag if present
      if (tagValue.endsWith('x')) {
        tagValue = tagValue.slice(0, -1).trim();
      }

      if (!tagValues.has(tagValue)) {
        tagValues.add(tagValue);
        tags.push(tagValue);
      }
    }

    return tags;
  }


  getTags(tagContainer: HTMLElement): string[] {
    const tags: string[] = [];
    const tagElements = tagContainer.getElementsByClassName('tag');
    for (let i = 0; i < tagElements.length; i++) {
      const tagElement = tagElements[i] as HTMLElement;
      tags.push(tagElement.textContent?.trim() || '');
    }
    return tags;
  }

  removeTag(tag: HTMLElement, tagContainer: HTMLElement): void {
    tag.style.animation = 'fadeOut 0.3s';

    // Assurez-vous que la suppression se produit après l'animation
    setTimeout(() => {
      if (tag.parentElement === tagContainer) {
        tagContainer.removeChild(tag);
      }
    }, 100); // 300 ms correspond à la durée de l'animation fadeOut
  }

  addTag(value: string, tagContainer: HTMLElement): void {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerText = value;
    tag.style.background = '#86A786';
    tag.style.color = 'white';
    tag.style.padding = '5px 10px';
    tag.style.borderRadius = '20px';
    tag.style.display = 'flex';
    tag.style.alignItems = 'center';
    tag.style.transform = 'scale(0.8)';
    tag.style.animation = 'fadeIn 0.3s forwards';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerText = 'x';
    closeBtn.style.background = '#fff';
    closeBtn.style.color = '#86A786';
    closeBtn.style.marginLeft = '5px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.padding = '0 8px';
    closeBtn.style.fontWeight = 'bolder';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => {
      this.removeTag(tag, tagContainer);
    });

    tag.appendChild(closeBtn);
    tagContainer.insertBefore(tag, tagContainer.querySelector('.input-field'));
  }

  // UI Helper methods
  onModelClassChange(modelId: number, classId: string): void {
    console.log('Model class changed:', { modelId, classId });
    
    const modelIndex = this.ModelsForAnnotations.findIndex(m => m.model.id === modelId);
    if (modelIndex !== -1) {
      this.ModelsForAnnotations[modelIndex].selectedClass = classId;
      this.modelsForAnnotationsSubject.next([...this.ModelsForAnnotations]);
    }
  }

  getModelClasses(modelId: number): ClasseAnnotation[] {
    const model = this.ModelsForAnnotations.find(m => m.model.id === modelId);
    return model ? model.classes : [];
  }

  getSelectedClass(modelId: number): string | null {
    const model = this.ModelsForAnnotations.find(m => m.model.id === modelId);
    return model ? model.selectedClass : null;
  }

  isFormValid(): boolean {
    // Check if at least one filter is applied or one model class is selected
    const hasFilters = this.Filtres.test.some(filterArray => filterArray.length > 0);
    const hasSelectedClasses = this.Filtres.selectedAnnotations.some(annotation => annotation.classeid !== null);
    
    return hasFilters || hasSelectedClasses;
  }

  getFilterCount(): number {
    const filterCount = this.Filtres.test.reduce((count, filterArray) => count + filterArray.length, 0);
    const annotationCount = this.Filtres.selectedAnnotations.filter(annotation => annotation.classeid !== null).length;
    
    return filterCount + annotationCount;
  }

  clearAllFilters(): void {
    // Clear all tags from the form
    const tagContainers = document.querySelectorAll('.tag-container');
    tagContainers.forEach(container => {
      const tags = container.querySelectorAll('.tag');
      tags.forEach(tag => tag.remove());
    });
    
    // Clear selected model classes
    this.ModelsForAnnotations.forEach(model => {
      model.selectedClass = null;
    });
    this.modelsForAnnotationsSubject.next([...this.ModelsForAnnotations]);
    
    // Reset filters
    this.Filtres = {
      test: [],
      selectedAnnotations: []
    };
    
    console.log('All filters cleared');
  }

  trackByModelId(index: number, model: ModelResponse): number {
    return model.model.id;
  }

  trackByClassId(index: number, classe: ClasseAnnotation): number {
    return classe.id;
  }
}
