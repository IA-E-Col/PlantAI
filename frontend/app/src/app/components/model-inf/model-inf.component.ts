import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { ModelsActions, NavigationActions } from '../../store';
import { 
  selectAllModels,
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';
import { 
  selectNavigationModelId
} from '../../store/navigation/navigation.selectors';

type ModelCategory = 'classification' | 'segmentation' | 'detection';

@Component({
  selector: 'app-model-inf',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './model-inf.component.html',
  styleUrl: './model-inf.component.css'
})
export class ModelInfComponent implements OnInit, OnDestroy {
  // NgRx Observables
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  modelId$: Observable<string | null>;
  
  // Component state
  currentStep: number = 1;
  modelId!: string;
  modele: any = null;
  model: any = null;
  message_err: string = '';

  categoryDescriptions: Record<ModelCategory, string> = {
    classification: "Classification models are designed to categorize input data into predefined classes. They output a label that indicates the class to which the input belongs.",
    segmentation: "Segmentation models are used to partition an image into multiple segments or regions, each representing a different part of the image, often used for tasks such as object detection and image analysis.",
    detection: "Detection models identify and locate objects within an image or video, providing both the class of each object and its location within the frame."
  };

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
    this.modelId$ = this.store.select(selectNavigationModelId);
  }

  ngOnInit(): void {
    // Subscribe to errors
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.message_err = error;
          console.error('Model loading error:', error);
        }
      });
    
    // Get model ID from route
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.modelId = params['id'];
        if (this.modelId) {
          this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: this.modelId }));
          this.loadModel(this.modelId);
        }
      });
    
    console.log('Model-inf component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadModel(modelId: string): void {
    console.log('Loading model details:', modelId);
    
    // Generate mock model data
    const mockModel = this.generateMockModel(parseInt(modelId));
    this.modele = mockModel;
    
    // Create enhanced model object
    this.model = {
      name: this.modele.name,
      description: this.modele.description,
      categorie: this.modele.categorie as ModelCategory,
      accuracy: '95%',
      loss: '0.92',
      example1: 'assets/Smooth_toothed.png',
      example2: 'Exemple de sortie 2',
      architectureImage: 'chemin/vers/image.png',
      numLayers: 5,
      numParams: 1000000,
      modelUsage: 'Le modèle YOLO pour classification de plantes prend en entrée des images représentant des plantes. Il retourne des prédictions indiquant si la plante est de type lisse ou dentée. Pour utiliser le modèle vous pouvez alimenter vos données d\'entrée dans le modèle pour effectuer des prédictions. Les sorties incluent des étiquettes indiquant la classification de chaque plante détectée, facilitant ainsi l\'automatisation de la classification des types de feuillage dans des images.'
    };
    
    console.log('Model loaded:', this.modele);
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(ModelsActions.loadModel({ modelId }));
  }

  private generateMockModel(modelId: number): any {
    const categories: ModelCategory[] = ['classification', 'segmentation', 'detection'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      id: modelId,
      name: `Model ${modelId}`,
      description: `Advanced ${category} model for plant identification`,
      categorie: category,
      urlModele: `/models/model_${modelId}.pt`,
      dateCreation: new Date().toISOString(),
      statut: 'active',
      accuracy: 0.95,
      loss: 0.05,
      numLayers: 5,
      numParams: 1000000
    };
  }

  getCategoryDescription(): string {
    if (this.model?.categorie in this.categoryDescriptions) {
      return this.categoryDescriptions[this.model.categorie as ModelCategory];
    } else {
      return "No description available for this category.";
    }
  }

  // UI Helper methods
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 3) {
      this.currentStep = step;
    }
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: number): boolean {
    return this.currentStep > step;
  }

  onEditModel(): void {
    this.router.navigate(['/admin/models/update', this.modelId]);
  }

  onDeleteModel(): void {
    // TODO: Implement delete functionality with NgRx
    console.log('Delete model:', this.modelId);
  }

  onBackToList(): void {
    this.router.navigate(['/admin/models']);
  }
}
