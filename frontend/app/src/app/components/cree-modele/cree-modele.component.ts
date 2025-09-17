import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgIf, AsyncPipe } from "@angular/common";
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from "@angular/material/dialog";
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { ModelsActions } from '../../store';
import { 
  selectAllModels,
  selectModelsLoading,
  selectModelsError,
  selectAllClasses,
  selectClassesLoading,
  selectClassesError
} from '../../store/models/models.selectors';

@Component({
  selector: 'app-cree-modele',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    RouterOutlet,
    FormsModule,
    CommonModule,
    AsyncPipe
  ],
  templateUrl: './cree-modele.component.html',
  styleUrls: ['./cree-modele.component.css']
})
export class CreeModeleComponent implements OnInit, OnDestroy {
  
  // UI State
  currentStep: number = 1;
  additionalClassSelects: number[] = [];
  
  // Form Data
  modelData = {
    name: '',
    description: '',
    urlModele: '',
    categorie: '',
  };
  classesAnnotation: any[] = [""];
  
  // NgRx Observables
  models$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // NgRx Observables for classes
  classes$: Observable<any[]>;
  classesLoading$: Observable<boolean>;
  classesError$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreeModeleComponent>,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.models$ = this.store.select(selectAllModels);
    this.isLoading$ = this.store.select(selectModelsLoading);
    this.error$ = this.store.select(selectModelsError);
    
    // Initialize classes observables
    this.classes$ = this.store.select(selectAllClasses);
    this.classesLoading$ = this.store.select(selectClassesLoading);
    this.classesError$ = this.store.select(selectClassesError);
  }

  ngOnInit(): void {
    // Load models and classes if not already loaded
    this.store.dispatch(ModelsActions.loadModels());
    this.store.dispatch(ModelsActions.loadAllClasses());
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to process model: ${error}`, 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  nextStep(): void {
    console.log('Moving to step:', this.currentStep + 1);
    if (this.currentStep < 3) {
      this.currentStep = this.currentStep + 1;
    }
  }

  prevStep(): void {
    console.log('Moving to step:', this.currentStep - 1);
    if (this.currentStep > 1) {
      this.currentStep = this.currentStep - 1;
    }
  }

  onSubmit(): void {
    if (this.currentStep === 3) {
      // Final step - create the model
      if (this.isFormValid()) {
        console.log('Creating model with NgRx:', this.modelData);
        console.log('Selected classes:', this.classesAnnotation);

        const modelCreateData = {
          nom: this.modelData.name, // Map 'name' to 'nom' to match interface
          description: this.modelData.description,
          dateCreation: Date.now(),
          status: 'TRAINING' as const,
          // Optional properties
          precision: 0,
          accuracy: 0,
          f1Score: 0,
          recall: 0,
          trainingProgress: 0,
          // Map additional data to classes or annotation
          classes: this.classesAnnotation.filter(c => c && c.trim()).map((className, index) => ({
            id: 0, // Will be assigned by backend
            identifier: index + 1,
            name: className,
            description: `Class for ${className}`,
            couleur: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
          }))
        };

        // Dispatch create model action through NgRx
        this.store.dispatch(ModelsActions.createModel({ model: modelCreateData }));

        // Listen for successful creation
        this.isLoading$
          .pipe(takeUntil(this.destroy$))
          .subscribe(isLoading => {
            if (!isLoading) {
              this.error$
                .pipe(takeUntil(this.destroy$))
                .subscribe(error => {
                  if (!error) {
                    Swal.fire('Success', 'Model created successfully!', 'success').then(() => {
                      this.dialogRef.close(true); // Return true to indicate success
                    });
                  }
                });
            }
          });
      } else {
        Swal.fire('Error', 'Please fill all required fields correctly', 'error');
      }
    } else {
      this.nextStep();
    }
  }

  private isFormValid(): boolean {
    return !!(this.modelData.name?.trim() && 
              this.modelData.description?.trim() && 
              this.modelData.categorie?.trim());
  }

  cancel(): void {
    this.dialogRef.close(false);
    console.log('Model creation cancelled!');
  }

  addClass(): void {
    this.additionalClassSelects.push(this.additionalClassSelects.length);
    this.classesAnnotation.push(''); // Add a new empty class selection
    console.log('Added new class selection. Total classes:', this.classesAnnotation.length);
  }

  removeClass(index: number): void {
    this.additionalClassSelects.splice(index, 1);
    this.classesAnnotation.splice(index + 1, 1); // Remove the class identifier at the same index
    console.log('Removed class at index:', index, 'Remaining classes:', this.classesAnnotation.length);
  }

  trackByIndex(index: number): number {
    return index;
  }

  getProgressPercentage(): number {
    return (this.currentStep / 3) * 100;
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.modelData.name?.trim() && this.modelData.description?.trim());
      case 2:
        return !!this.modelData.categorie?.trim();
      case 3:
        return this.isFormValid();
      default:
        return false;
    }
  }
}
