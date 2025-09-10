import { NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil, BehaviorSubject, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectDatasetById,
  selectCollectionsLoading,
  selectCollectionsError,
  selectSpecimensByDataset
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationDatasetId,
  selectNavigationModelId
} from '../../store/navigation/navigation.selectors';



@Component({
  selector: 'app-dataset-prediction',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgxPaginationModule,
    RouterOutlet,
    CommonModule,
    FilterPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './dataset-prediction.component.html',
  styleUrl: './dataset-prediction.component.css'
})
export class DatasetPredictionComponent implements OnInit, OnDestroy {
  private IdDataset: any;
  private modelId: any;
  annotations: any;
  isCalculated: boolean = true; //false
  Dataset: any;
  Specimens: any;
  Old_Specimens: any;
  p: number = 1;
  filterForm: FormGroup;
  familyOptions: string[] = [];
  genreOptions: string[] = [];

  // NgRx Observables
  dataset$: Observable<any>;
  datasetId$: Observable<string | null>;
  modelId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Reactive state management
  private filteredSpecimensSubject = new BehaviorSubject<any[]>([]);
  filteredSpecimens$: Observable<any[]> = this.filteredSpecimensSubject.asObservable();
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
    this.modelId$ = this.store.select(selectNavigationModelId);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    
    this.dataset$ = this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const datasetId = params.get('id');
        if (datasetId) {
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId }));
          return this.store.select(selectDatasetById(parseInt(datasetId)));
        }
        return this.store.select(selectDatasetById(0));
      })
    ) || this.store.select(selectDatasetById(0));
    
    this.filterForm = this.fb.group({
      annotationModel: [''],
      validation: [''],
      minAccuracy: [''],
      maxAccuracy: [''],
      family: [''],
      genre: ['']
    });
  }

  onSubmit(): void {
    const formValue = this.filterForm.value;
    console.log('Filter form submitted:', formValue);

    // Process form values
    const annotationModel = formValue.annotationModel;
    const validation = formValue.validation;
    const minAccuracy = formValue.minAccuracy;
    const maxAccuracy = formValue.maxAccuracy;
    const family = formValue.family;
    const genre = formValue.genre;

    let filteredSpecimens = [...this.Old_Specimens];

    // Apply family filter
    if (family) {
      console.log(`Filtering by family: ${family}`);
      filteredSpecimens = filteredSpecimens.filter((specimen: { famille: any; }) => specimen.famille === family);
    }
    
    // Apply genre filter
    if (genre) {
      console.log(`Filtering by genre: ${genre}`);
      filteredSpecimens = filteredSpecimens.filter((specimen: { genre: any; }) => specimen.genre === genre);
    }
    
    // Apply validation filter
    if (validation) {
      console.log(`Filtering by validation: ${validation}`);
      filteredSpecimens = filteredSpecimens.filter((specimen: { validation: any; }) => specimen.validation === validation);
    }
    
    // Apply accuracy range filter
    if (minAccuracy || maxAccuracy) {
      const min = minAccuracy ? parseFloat(minAccuracy) : 0;
      const max = maxAccuracy ? parseFloat(maxAccuracy) : 1;
      console.log(`Filtering by accuracy range: ${min} - ${max}`);
      filteredSpecimens = filteredSpecimens.filter((specimen: { accuracy: any; }) => {
        const accuracy = parseFloat(specimen.accuracy);
        return accuracy >= min && accuracy <= max;
      });
    }

    console.log('Filtered specimens:', filteredSpecimens.length, 'items');

    // Update the reactive state with the filtered specimens
    this.Specimens = filteredSpecimens;
    this.filteredSpecimensSubject.next(filteredSpecimens);
  }

  ngOnInit(): void {
    // Handle route parameters
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.IdDataset = params.get("id");
        this.modelId = params.get("modelId");
        
        if (this.IdDataset) {
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: this.IdDataset }));
        }
        if (this.modelId) {
          this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: this.modelId }));
        }
        
        this.loadDataset();
      });
    
    // Subscribe to dataset data
    this.dataset$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dataset => {
        if (dataset) {
          this.Dataset = dataset;
          this.Specimens = dataset.specimens || [];
          this.Old_Specimens = [...this.Specimens];
          this.filteredSpecimensSubject.next(this.Specimens);
          
          this.isCalculated = true;
          
          // Extract family and genre options
          this.extractFilterOptions();
          
          console.log('Dataset loaded via NgRx:', this.Dataset);
          console.log('Specimens loaded:', this.Specimens.length, 'items');
        }
      });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load dataset: ${error}`, 'error');
        }
      });
    
    console.log('Dataset prediction component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDataset(): void {
    if (this.IdDataset) {
      console.log('Loading dataset for prediction:', this.IdDataset);
      
      // Load real dataset using NgRx action
      this.store.dispatch(CollectionsActions.loadDataset({ datasetId: parseInt(this.IdDataset) }));
      
      // Subscribe to real dataset data
      this.store.select(selectDatasetById(parseInt(this.IdDataset)))
        .pipe(takeUntil(this.destroy$))
        .subscribe(dataset => {
          if (dataset) {
            this.Dataset = dataset;
            this.Specimens = dataset.specimens || [];
            this.Old_Specimens = [...this.Specimens];
            this.filteredSpecimensSubject.next(this.Specimens);
            
            this.isCalculated = true;
            this.extractFilterOptions();
            
            console.log('Real dataset loaded for prediction:', dataset);
          }
        });
      
      // Also load specimens by dataset
      this.store.dispatch(CollectionsActions.loadSpecimensByDataset({ datasetId: this.IdDataset }));
      
      // Subscribe to specimens data
      this.store.select(selectSpecimensByDataset(this.IdDataset))
        .pipe(takeUntil(this.destroy$))
        .subscribe(specimens => {
          if (specimens && specimens.length > 0) {
            this.Specimens = specimens;
            this.Old_Specimens = [...this.Specimens];
            this.filteredSpecimensSubject.next(this.Specimens);
            this.extractFilterOptions();
            
            console.log('Real specimens loaded for prediction:', specimens.length);
          }
        });
    }
  }

  // Mock dataset generation method removed - now using real API calls

  private extractFilterOptions(): void {
    this.familyOptions = [];
    this.genreOptions = [];

    this.Specimens.forEach((specimen: { famille: string; genre: string; }) => {
      if (specimen.famille && !this.familyOptions.includes(specimen.famille)) {
        this.familyOptions.push(specimen.famille);
      }
      if (specimen.genre && !this.genreOptions.includes(specimen.genre)) {
        this.genreOptions.push(specimen.genre);
      }
    });

    console.log('Family options:', this.familyOptions);
    console.log('Genre options:', this.genreOptions);
  }


  protected readonly Date = Date;
  
  doPrediction(plante: any): void {
    console.log('Starting prediction for specimen:', plante.id, 'with model:', this.modelId);
    
    // Update navigation state
    // Note: setCurrentSpecimenId action doesn't exist yet, using setCurrentDatasetId as fallback
    this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: this.IdDataset }));
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: this.modelId }));
    
    this.router.navigate(['/admin/AnnotationDetail'], { 
      state: { 
        plante: plante, 
        modeleId: this.modelId 
      } 
    });
  }

  isGridView = false;
  setView(view: string): void {
    this.isGridView = view === 'grid';
    console.log('View changed to:', view);
  }

  iconState: 'default' | 'down' | 'up' = 'default';
  OrderBy(): void {
    if (this.iconState === 'default') {
      this.iconState = 'down';
    } else if (this.iconState === 'down') {
      this.iconState = 'up';
    } else if (this.iconState === 'up') {
      this.iconState = 'down';
    }
    console.log('Sort order changed to:', this.iconState);
  }

  // UI Helper methods
  trackBySpecimenId(index: number, specimen: any): number {
    return specimen.id;
  }

  getValidationBadgeClass(validation: string): string {
    switch (validation) {
      case 'VALIDATED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getAccuracyClass(accuracy: number): string {
    if (accuracy >= 0.9) return 'text-success';
    if (accuracy >= 0.7) return 'text-warning';
    return 'text-danger';
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.Specimens = [...this.Old_Specimens];
    this.filteredSpecimensSubject.next(this.Specimens);
    console.log('Filters reset');
  }
  
}
