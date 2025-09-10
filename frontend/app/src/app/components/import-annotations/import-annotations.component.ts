import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { FilterPipe } from '../../filter.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { NavigationActions, CollectionsActions } from '../../store';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';
import { 
  selectCollectionsLoading,
  selectCollectionsError
} from '../../store/collections/collections.selectors';
@Component({
  selector: 'app-import-annotations',
  standalone: true,
  imports: [    
    CommonModule,
    FilterPipe,
    NgForOf,
    NgIf,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    FontAwesomeModule,
    AsyncPipe
  ],
  templateUrl: './import-annotations.component.html',
  styleUrl: './import-annotations.component.css'
})
export class ImportAnnotationsComponent implements OnInit, OnDestroy {

    annotationFormGroup!: FormGroup;
    file!: File;
    
    // NgRx Observables
    datasetId$: Observable<string | null>;
    collectionsError$: Observable<string | null>;
    
    private destroy$ = new Subject<void>();
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      @Inject(MAT_DIALOG_DATA) public data: { datasetId: string },
      private dialogRef: MatDialogRef<ImportAnnotationsComponent>,
      private store: Store<AppState>
    ) {
      // Initialize NgRx observables
      this.datasetId$ = this.store.select(selectNavigationDatasetId);
      this.collectionsError$ = this.store.select(selectCollectionsError);
    }
  
    ngOnInit() {
      console.log('Import annotations dialog opened for dataset:', this.data.datasetId);
      
      // Update navigation state with dataset ID
      if (this.data.datasetId) {
        this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: this.data.datasetId }));
      }
      
      this.annotationFormGroup = this.fb.group({
        selectedFormatName: ['JSON', Validators.required], // Default to JSON
        annotationFile: ['', Validators.required],
      });
      
      console.log('Import annotations component initialized with NgRx');
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
    onFileSelect(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.file = input.files[0];
      }
    }

    closeDialog(){
      this.dialogRef.close();
    }

    import_annotations(): void {
      if (!this.annotationFormGroup.valid || !this.file) {
        Swal.fire('Error', 'Please select a file and format', 'error');
        return;
      }
      
      const format = this.annotationFormGroup.get('selectedFormatName')?.value;
      
      console.log('Starting real annotation import process:', {
        format,
        fileName: this.file.name,
        fileSize: this.file.size,
        datasetId: this.data.datasetId
      });
      
      // Show loading
      Swal.fire({
        title: 'Importing Annotations',
        text: 'Please wait while we import your annotation data...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Use real NgRx annotation import action
      this.store.dispatch(CollectionsActions.importAnnotations({ 
        file: this.file,
        format: format,
        datasetId: parseInt(this.data.datasetId)
      }));
      
      // Subscribe to import success
      this.store.select(selectCollectionsLoading)
        .pipe(takeUntil(this.destroy$))
        .subscribe(isLoading => {
          if (!isLoading) {
            this.collectionsError$
              .pipe(takeUntil(this.destroy$))
              .subscribe((error: string | null) => {
                if (!error) {
                  Swal.fire({
                    title: 'Annotations Imported!',
                    text: 'Your annotation data has been imported successfully.',
                    icon: 'success',
                    timer: 3000
                  }).then(() => {
                    this.dialogRef.close();
                  });
                } else {
                  Swal.fire('Error', 'Failed to import annotations: ' + error, 'error');
                }
              });
          }
        });
    }
    
  formats = [
    {
      name: "JSON",
      description: "JavaScript Object Notation - Structured format"
    },
    {
      name: "CSV",
      description: "Comma Separated Values - Tabular format"
    },
    {
      name: "XML",
      description: "Extensible Markup Language - Hierarchical format"
    }
  ];
  
  // Form validation helpers
  get selectedFormatControl() { 
    return this.annotationFormGroup.get('selectedFormatName'); 
  }
  
  get annotationFileControl() { 
    return this.annotationFormGroup.get('annotationFile'); 
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.annotationFormGroup.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
  
  markFormGroupTouched(): void {
    Object.keys(this.annotationFormGroup.controls).forEach(key => {
      this.annotationFormGroup.get(key)?.markAsTouched();
    });
  }
}
