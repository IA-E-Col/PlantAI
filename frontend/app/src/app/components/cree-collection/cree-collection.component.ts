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
  selectCollectionsError 
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
    
    if (data) {
      this.is_active = data.is_active;
      console.log('Create collection dialog opened with data:', data);
    }
  }

  ngOnInit() {
    this.collectionFormGroup = this.fb.group({
      nomCollection: ['', Validators.required],
      collectionFile: ['', Validators.required],
      description: ['', Validators.required, Validators.minLength(10)],
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
    
    console.log('Creating collection:', collectionData);
    
    // Show loading
    Swal.fire({
      title: 'Creating Collection',
      text: 'Please wait while we create your collection and import the data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Simulate collection creation and CSV import
    setTimeout(() => {
      const mockCollection = this.generateMockCollection(collectionData);
      
      Swal.fire({
        title: 'Collection Created!',
        text: `Collection "${collectionData.nom}" has been created successfully with ${mockCollection.specimenCount} specimens imported.`,
        icon: 'success',
        timer: 3000
      }).then(() => {
        this.dialogRef.close(mockCollection);
      });
      
      console.log('Mock collection creation completed:', mockCollection);
      
      // TODO: Replace with proper NgRx actions
      // this.store.dispatch(CollectionsActions.createCollection({ 
      //   collectionData: {
      //     nom: collectionData.nom,
      //     description: collectionData.description
      //   }
      // }));
      // 
      // this.store.dispatch(CollectionsActions.importCsv({ 
      //   collectionId: mockCollection.id,
      //   file: collectionData.file
      // }));
    }, 3000);
  }

  private generateMockCollection(collectionData: any): any {
    return {
      id: Date.now(),
      nom: collectionData.nom,
      description: collectionData.description,
      dateCreation: new Date().toISOString(),
      specimenCount: Math.floor(Math.random() * 1000) + 100,
      imageCount: Math.floor(Math.random() * 2000) + 200,
      statut: 'active',
      importStatus: 'completed'
    };
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
