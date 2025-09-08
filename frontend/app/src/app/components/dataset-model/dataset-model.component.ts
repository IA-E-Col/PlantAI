import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FilterPipe } from "../../filter.pipe";
import { CommonModule, AsyncPipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from "sweetalert2";
import { FormsModule } from '@angular/forms';
import { faInfoCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { ModelsActions, NavigationActions } from '../../store';
import { 
  selectAllModels,
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';


@Component({
  selector: 'app-dataset-model',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    FilterPipe,
    CommonModule,
    NgxPaginationModule,
    FontAwesomeModule,
    AsyncPipe
  ],
  templateUrl: './dataset-model.component.html',
  styleUrl: './dataset-model.component.css'
})
export class DatasetModelComponent implements OnInit, OnDestroy {
  searchtext: any;
  m: number = 1;
  faPlay = faPlay;
  faInfoCircle = faInfoCircle;

  // NgRx Observables
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  datasetId$: Observable<string | null>;
  
  // Reactive state management
  private filteredModelsSubject = new BehaviorSubject<any[]>([]);
  filteredModels$: Observable<any[]> = this.filteredModelsSubject.asObservable();
  
  modeles: Array<any> = [];
  private Dataset: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.models$ = this.store.select(selectAllModels);
    this.modelsLoading$ = this.store.select(selectModelsLoading);
    this.modelsError$ = this.store.select(selectModelsError);
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
  }

  ngOnInit() {
    // Load models via NgRx
    this.store.dispatch(ModelsActions.loadModels());
    
    // Subscribe to models data
    this.models$
      .pipe(takeUntil(this.destroy$))
      .subscribe(models => {
        this.modeles = models || [];
        this.filteredModelsSubject.next(this.modeles);
        console.log('Models loaded via NgRx:', this.modeles.length, 'items');
      });
    
    // Subscribe to errors
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });

    // Handle route parameters
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.Dataset = params['id'];
        if (this.Dataset) {
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: this.Dataset }));
        }
      });
    
    console.log('Dataset model component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  doPrediction(modeleId: any): void {
    console.log('Starting prediction with dataset:', this.Dataset, 'model:', modeleId);
    
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: modeleId.toString() }));
    
    this.router.navigate([`/admin/datasets/${this.Dataset}/datasetPrediction/${modeleId}`]);
  }

  info_model(id: any): void {
    console.log('Viewing model info:', id);
    
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: id.toString() }));
    
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
  }

  // UI Helper methods
  trackByModelId(index: number, model: any): number {
    return model.id;
  }

  getModelStatusClass(status: string): string {
    switch (status) {
      case 'TRAINING': return 'badge-warning';
      case 'READY': return 'badge-success';
      case 'ERROR': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getModelTypeClass(type: string): string {
    switch (type) {
      case 'CLASSIFICATION': return 'badge-primary';
      case 'DETECTION': return 'badge-info';
      case 'SEGMENTATION': return 'badge-success';
      default: return 'badge-secondary';
    }
  }
}
