import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf, NgForOf, AsyncPipe} from "@angular/common";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import Swal from 'sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from "../../filter.pipe";
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

@Component({
  selector: 'app-update-modele',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    FilterPipe,
    NgxPaginationModule,
    AsyncPipe
  ],
  templateUrl: './update-modele.component.html',
  styleUrl: './update-modele.component.css'
})
export class UpdateModeleComponent implements OnInit, OnDestroy {
  // NgRx Observables
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  modelId$: Observable<string | null>;
  
  // Component state
  modelFormGroup!: FormGroup;
  currentModel: any = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.models$ = this.store.select(selectAllModels);
    this.modelsLoading$ = this.store.select(selectModelsLoading);
    this.modelsError$ = this.store.select(selectModelsError);
    this.modelId$ = this.store.select(selectNavigationModelId);
    
    // Initialize form
    this.initializeForm();
  }

  ngOnInit(): void {
    // Subscribe to errors
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });
    
    // Get model ID from route
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const modelId = params['id'];
        if (modelId) {
          this.store.dispatch(NavigationActions.setCurrentModelId({ modelId }));
          this.loadModel(modelId);
        }
      });
    
    console.log('Update-modele component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.modelFormGroup = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categorie: ['', [Validators.required]],
      urlModele: ['', [Validators.required]]
    });
  }

  private loadModel(modelId: string): void {
    console.log('Loading model for update:', modelId);
    
    // Generate mock model data
    const mockModel = this.generateMockModel(parseInt(modelId));
    this.currentModel = mockModel;
    
    // Populate form with model data
    this.modelFormGroup.patchValue({
      nom: mockModel.nom,
      description: mockModel.description,
      categorie: mockModel.categorie,
      urlModele: mockModel.urlModele
    });
    
    console.log('Model loaded for update:', mockModel);
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(ModelsActions.loadModel({ modelId }));
  }

  private generateMockModel(modelId: number): any {
    return {
      id: modelId,
      nom: `Model ${modelId}`,
      description: `Description for model ${modelId}`,
      categorie: 'classification',
      urlModele: `/models/model_${modelId}.pt`,
      dateCreation: new Date().toISOString(),
      statut: 'active'
    };
  }

  modifier_mdl(): void {
    if (this.modelFormGroup.valid && this.currentModel) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to modify this model. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#86A786',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, modify model',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedModel = {
            ...this.currentModel,
            ...this.modelFormGroup.value,
            dateModification: new Date().toISOString()
          };
          
          console.log('Updating model:', updatedModel);
          
          // Dispatch update action
          this.store.dispatch(ModelsActions.updateModel({ 
            modelId: this.currentModel.id, 
            changes: this.modelFormGroup.value 
          }));
          
          Swal.fire('Success', 'Model updated successfully', 'success').then(() => {
            this.router.navigate(['/admin/models']);
          });
        }
      });
    } else {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
    }
  }

  // UI Helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.modelFormGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.modelFormGroup.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/admin/models']);
  }
}
