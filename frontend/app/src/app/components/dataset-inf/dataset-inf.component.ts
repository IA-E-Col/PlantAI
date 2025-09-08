import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule, AsyncPipe } from '@angular/common';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectDatasetById,
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-dataset-inf',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './dataset-inf.component.html',
  styleUrl: './dataset-inf.component.css'
})
export class DatasetInfComponent implements OnInit, OnDestroy {
  cheminDtl = "assets/INFO1.png";
  
  // NgRx Observables
  dataset$: Observable<any>;
  datasetId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Component state
  IdCollection!: any;
  DatasetNam!: any;
  DatasetDescription!: any;
  DatasetImages!: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
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
  }

  ngOnInit() {
    // Handle route parameters
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.IdCollection = params.get('id');
        this.loadDataset();
      });
    
    // Subscribe to dataset data
    this.dataset$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dataset => {
        if (dataset) {
          this.DatasetNam = dataset.name;
          this.DatasetDescription = dataset.description;
          this.DatasetImages = dataset.numberOfSpecimen;
          console.log('Dataset loaded via NgRx:', dataset);
        }
      });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          console.error('Failed to load dataset:', error);
        }
      });
    
    console.log('Dataset info component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDataset(): void {
    if (this.IdCollection) {
      console.log('Loading dataset:', this.IdCollection);
      
      // Generate mock dataset for demonstration
      const mockDataset = this.generateMockDataset();
      this.DatasetNam = mockDataset.name;
      this.DatasetDescription = mockDataset.description;
      this.DatasetImages = mockDataset.numberOfSpecimen;
      
      console.log('Mock dataset loaded:', mockDataset);
      
      // TODO: Replace with proper NgRx action
      // this.store.dispatch(CollectionsActions.loadDatasetById({ datasetId: this.IdCollection }));
    }
  }

  private generateMockDataset(): any {
    return {
      id: this.IdCollection,
      name: 'African Plant Dataset',
      description: 'A comprehensive dataset containing African plant specimens with detailed botanical information and high-quality images for machine learning research.',
      numberOfSpecimen: 1250,
      numberOfImages: 2500,
      dateCreation: '2023-01-15',
      statut: 'active',
      collection: {
        id: 1,
        nom: 'African Herbarium Collection'
      }
    };
  }

}
