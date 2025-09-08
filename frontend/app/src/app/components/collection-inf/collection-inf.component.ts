import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, ModelsActions, NavigationActions } from '../../store';
import { 
  selectAllCollections,
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectAllModels,
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';
import { 
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';



@Component({
  selector: 'app-collection-inf',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    FilterPipe,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './collection-inf.component.html',
  styleUrl: './collection-inf.component.scss'
})
export class CollectionInfComponent implements OnInit, OnDestroy {
  // NgRx Observables
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  collectionId$: Observable<string | null>;
  
  // Component state
  collection: any = null;
  IdCollection: any;
  searchtext: any;
  modeles: Array<any> = [];
  m: number = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.collections$ = this.store.select(selectAllCollections);
    this.collectionsLoading$ = this.store.select(selectCollectionsLoading);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    this.models$ = this.store.select(selectAllModels);
    this.modelsLoading$ = this.store.select(selectModelsLoading);
    this.modelsError$ = this.store.select(selectModelsError);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
  }

  ngOnInit(): void {
    // Subscribe to errors
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          console.error('Collection loading error:', error);
        }
      });

    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          console.error('Models loading error:', error);
        }
      });

    // Get collection ID from route
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.IdCollection = params['id'];
        if (this.IdCollection) {
          this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: this.IdCollection }));
          this.loadCollectionData(this.IdCollection);
        }
      });
    
    console.log('Collection-inf component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCollectionData(collectionId: string): void {
    console.log('Loading collection data:', collectionId);
    
    // Generate mock collection data
    this.collection = this.generateMockCollection(parseInt(collectionId));
    
    // Generate mock models data
    this.modeles = this.generateMockModels();
    
    console.log('Collection data loaded:', this.collection);
    console.log('Models loaded:', this.modeles);
    
    // TODO: Replace with proper NgRx actions
    // this.store.dispatch(CollectionsActions.loadCollection({ collectionId }));
    // this.store.dispatch(ModelsActions.loadModels());
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

  private generateMockModels(): Array<any> {
    return [
      {
        id: 'ML001',
        nom: 'ResNet-50',
        dateCreation: '23/05/2015',
        version: 'V1',
        description: "ResNet-50 est un modèle de réseau de neurones convolutionnel qui a révolutionné la vision par ordinateur grâce à sa profondeur exceptionnelle.",
        nombre_c: '135',
        accuracy: '95%',
        loss: '0.1'
      },
      {
        id: 'ML002',
        nom: 'LSTM',
        dateCreation: '23/05/2023',
        version: 'V5',
        description: "LSTM (Long Short-Term Memory) est un type de réseau de neurones récurrents capable de retenir des informations sur de longues périodes.",
        nombre_c: '135',
        accuracy: '92%',
        loss: '0.15'
      },
      {
        id: 'ML003',
        nom: 'Transformer',
        dateCreation: '23/05/2022',
        version: 'V3',
        description: "Le Transformer est un modèle de réseau de neurones principalement utilisé pour les tâches de traitement du langage naturel. Il est basé sur le mécanisme d'attention.",
        nombre_c: '135',
        accuracy: '93%',
        loss: '0.12'
      },
      {
        id: 'ML004',
        nom: 'YOLOv7',
        dateCreation: '20/05/2010',
        version: 'V7',
        description: "YOLOv7 est une méthode avancée de détection d'objets en temps réel utilisant un réseau de neurones convolutionnel. Elle est reconnue pour sa précision et sa rapidité dans la localisation et l'identification d'objets dans des images ou des vidéos.",
        nombre_c: '10',
        accuracy: '98%',
        loss: '0.08'
      }
    ];
  }

  // UI Helper methods
  onModelClick(model: any): void {
    console.log('Model clicked:', model);
    this.router.navigate(['/admin/models', model.id]);
  }

  onSearchChange(searchText: string): void {
    this.searchtext = searchText;
    console.log('Search text changed:', searchText);
  }

  onBackToList(): void {
    this.router.navigate(['/admin/collections']);
  }

  onEditCollection(): void {
    this.router.navigate(['/admin/collections/edit', this.IdCollection]);
  }

  onViewSpecimens(): void {
    this.router.navigate(['/admin/collections', this.IdCollection, 'specimens']);
  }

  trackByModelId(index: number, model: any): any {
    return model.id;
  }
}
