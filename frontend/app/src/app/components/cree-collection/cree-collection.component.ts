import { Component, Inject, OnInit, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectCollectionsLoading,
  selectCollectionsError,
  selectAllCollections
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationProjectId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-cree-collection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './cree-collection.component.html',
  styleUrl: './cree-collection.component.css'
})
export class CreeCollectionComponent implements OnInit, OnDestroy {

  is_active: boolean = true;
  collectionFormGroup!: FormGroup;
  file!: File;
  
  // NgRx Observables
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  collectionsError$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CreeCollectionComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    
    if (data) {
      this.is_active = data.is_active;
      console.log('Create collection dialog opened with data:', data);
    }
  }

  ngOnInit() {
    this.collectionFormGroup = this.fb.group({
      nomCollection: ['', Validators.required],
      collectionFile: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to create collection: ${error}`, 'error');
        }
      });
    
    console.log('Create collection component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ajout_col(): void {
    if (!this.collectionFormGroup.valid) {
      Swal.fire('Error', 'Please fill in all required fields correctly', 'error');
      return;
    }
    
    if (!this.file) {
      Swal.fire('Error', 'Please select a CSV file to import', 'error');
      return;
    }
    
    const collectionData = {
      nom: this.collectionFormGroup.get('nomCollection')!.value,
      description: this.collectionFormGroup.get('description')!.value,
      file: this.file
    };
    
    console.log('Creating collection with real API:', collectionData);
    
    // Show loading
    Swal.fire({
      title: 'Creating Collection',
      text: 'Please wait while we create your collection and import the data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Step 1: Create collection using real API
    this.store.dispatch(CollectionsActions.addCollection({ 
      collection: {
        nom: collectionData.nom,
        description: collectionData.description,
        dateCreation: Date.now()
      }
    }));
    
    // Subscribe to collection creation success
    this.store.select(selectCollectionsLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        if (!isLoading) {
          // Check if there's no error, which means success
          this.collectionsError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((error: string | null) => {
              if (!error) {
                // Get the created collection ID from the store
                this.store.select(selectAllCollections)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(collections => {
                    const createdCollection = collections.find((c: any) => c.nom === collectionData.nom);
                    if (createdCollection) {
                      console.log('Collection created successfully:', createdCollection);
                      
                      // Step 2: Import CSV using real API
                      this.store.dispatch(CollectionsActions.importCsv({ 
                        collectionId: createdCollection.id,
                        file: collectionData.file
                      }));
                      
                      // Subscribe to CSV import success
                      this.store.select(selectCollectionsLoading)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(csvLoading => {
                          if (!csvLoading) {
                            this.collectionsError$
                              .pipe(takeUntil(this.destroy$))
                              .subscribe((csvError: string | null) => {
                                if (!csvError) {
                                  Swal.fire({
                                    title: 'Collection Created!',
                                    text: `Collection "${collectionData.nom}" has been created successfully and CSV data imported.`,
                                    icon: 'success',
                                    timer: 3000
                                  }).then(() => {
                                    this.dialogRef.close(createdCollection);
                                  });
                                } else {
                                  Swal.fire('Error', 'Collection created but CSV import failed: ' + csvError, 'error');
                                }
                              });
                          }
                        });
                    }
                  });
              } else {
                Swal.fire('Error', 'Failed to create collection: ' + error, 'error');
              }
            });
        }
      });
  }


  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      
      // Validate file type
      if (!this.file.name.toLowerCase().endsWith('.csv')) {
        Swal.fire('Error', 'Please select a CSV file', 'error');
        this.file = null as any;
        input.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      if (this.file.size > 10 * 1024 * 1024) {
        Swal.fire('Error', 'File size must be less than 10MB', 'error');
        this.file = null as any;
        input.value = '';
        return;
      }
      
      console.log('File selected:', {
        name: this.file.name,
        size: this.file.size,
        type: this.file.type
      });
    }
  }

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
    return this.collectionFormGroup.valid && !!this.file;
  }

  goBack(): void {
    this.dialogRef.close(false);
  }
}
