import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule, AsyncPipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { ModelsActions } from '../../store';
import { 
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';

@Component({
  selector: 'app-newclasse',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './newclasse.component.html',
  styleUrl: './newclasse.component.css'
})
export class NewclasseComponent implements OnDestroy {
  
  classeForm: FormGroup;
  
  // NgRx Observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor( 
    private dialogRef: MatDialogRef<NewclasseComponent>,
    private route: ActivatedRoute, 
    private router: Router,
    private fb: FormBuilder, 
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.isLoading$ = this.store.select(selectModelsLoading);
    this.error$ = this.store.select(selectModelsError);
    
    // Create reactive form
    this.classeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      identifier: ['', [Validators.required, Validators.pattern(/^[a-z_][a-z0-9_]*$/)]]
    });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to create class: ${error}`, 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      const formValues = this.classeForm.value;
      
      console.log('Creating class with NgRx:', formValues);
      
      // Create model class through the models store
      const classData = {
        nom: formValues.name,
        description: `Class for ${formValues.name}`,
        couleur: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
      };
      
      // Use a mock modelId for demonstration (in real app, this would come from context)
      const mockModelId = 1;
      
      this.store.dispatch(ModelsActions.createModelClass({ 
        modelId: mockModelId, 
        class: classData 
      }));
      
      // Listen for successful creation
      this.isLoading$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isLoading => {
          if (!isLoading) {
            this.error$
              .pipe(takeUntil(this.destroy$))
              .subscribe(error => {
                if (!error) {
                  Swal.fire('Success', 'Class created successfully!', 'success').then(() => {
                    this.dialogRef.close(true); // Return true to indicate success
                  });
                }
              });
          }
        });
    } else {
      Swal.fire('Error', 'Please fill all required fields correctly', 'error');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.classeForm.controls).forEach(key => {
      this.classeForm.get(key)?.markAsTouched();
    });
  }

  // Form validation helpers
  get nameControl() { return this.classeForm.get('name'); }
  get identifierControl() { return this.classeForm.get('identifier'); }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.classeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
