import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { CommonModule, NgIf } from '@angular/common';
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationProjectId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-create-collection-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './create-collection-modal.component.html',
  styleUrl: './create-collection-modal.component.css'
})
export class CreateCollectionModalComponent implements OnInit, OnDestroy {

  // Form management
  collectionFormGroup!: FormGroup;
  
  // NgRx Observables
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Component state
  projectId: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
  }

  ngOnInit(): void {
    // Initialize form
    this.collectionFormGroup = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    // Get project ID from route
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.projectId = params.get('id') || '';
        if (this.projectId) {
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: this.projectId }));
        }
      });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to create dataset: ${error}`, 'error');
        }
      });
    
    console.log('Create collection modal component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  retour(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Méthode pour soumettre les informations de la collection
  soumettreCollection(): void {
    if (!this.collectionFormGroup.valid) {
      Swal.fire('Error', 'Please fill in all required fields correctly', 'error');
      return;
    }
    
    const formData = this.collectionFormGroup.value;
    
    console.log('=== STARTING DATASET CREATION FLOW ===');
    console.log('Nom de la collection:', formData.nom);
    console.log('Description de la collection:', formData.description);
    console.log('Project ID:', this.projectId);
    
    // Show loading
    Swal.fire({
      title: 'Creating Dataset',
      text: 'Please wait while we create your dataset and import specimens...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Simulate the complete dataset creation flow
    this.simulateDatasetCreationFlow(formData);
  }
  
  private simulateDatasetCreationFlow(formData: any): void {
    console.log('Creating dataset with real API:', formData);
    
    // Create dataset using real API
    const datasetData = {
      nom: formData.nom,
      description: formData.description,
      dateCreation: Date.now(),
      specimens: []
    };
    
    // Dispatch create dataset action
    this.store.dispatch(CollectionsActions.createDataset({ 
      projectId: parseInt(this.projectId), 
      dataset: datasetData 
    }));
    
    // Subscribe to dataset creation success
    this.store.select(selectCollectionsLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        if (!isLoading) {
          // Check if there's no error, which means success
          this.store.select(selectCollectionsError)
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
              if (!error) {
                Swal.fire({
                  title: 'Dataset Created!',
                  text: `Dataset "${formData.nom}" has been created successfully.`,
                  icon: 'success',
                  timer: 3000
                }).then(() => {
                  this.router.navigate([`/admin/projects/${this.projectId}/datasets`]);
                });
                
                // Reset form
                this.collectionFormGroup.reset();
              } else {
                Swal.fire({
                  title: 'Error',
                  text: `Failed to create dataset: ${error}`,
                  icon: 'error'
                });
              }
            });
        }
      });
  }
  
  // Mock data generation methods removed - now using real API calls
  
  // UI Helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.collectionFormGroup.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.collectionFormGroup.get(fieldName);
    if (field?.errors?.['required']) {
      return `${fieldName} is required`;
    }
    if (field?.errors?.['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  isFormValid(): boolean {
    return this.collectionFormGroup.valid;
  }

}
