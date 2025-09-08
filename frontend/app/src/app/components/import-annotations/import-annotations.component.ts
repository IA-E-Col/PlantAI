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
import { NavigationActions } from '../../store';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';
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
      
      console.log('Starting import process:', {
        format,
        fileName: this.file.name,
        fileSize: this.file.size,
        datasetId: this.data.datasetId
      });
      
      // For now, simulate import process with mock data
      this.simulateImportProcess(format);
      
      // TODO: Replace with proper NgRx annotation import action
      // const formData = new FormData();
      // formData.append('file', this.file);
      // formData.append('format', format);
      // formData.append('datasetId', this.data.datasetId);
      // this.store.dispatch(AnnotationsActions.importAnnotations({ 
      //   formData, 
      //   datasetId: this.data.datasetId 
      // }));
    }
    
    private simulateImportProcess(format: string): void {
      // Show loading
      Swal.fire({
        title: 'Importing Annotations',
        text: `Processing ${format} file...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Simulate processing time
      setTimeout(() => {
        const mockImportedAnnotations = this.generateMockImportedAnnotations(format);
        
        Swal.fire({
          title: 'Import Successful!',
          text: `Successfully imported ${mockImportedAnnotations.length} annotations`,
          icon: 'success',
          timer: 2000
        });
        
        console.log('Mock import completed:', mockImportedAnnotations);
        this.dialogRef.close(mockImportedAnnotations);
      }, 2000);
    }
    
    private generateMockImportedAnnotations(format: string): any[] {
      const baseAnnotations = [
        {
          id: Date.now() + 1,
          libelle: 'Imported Leaf Classification',
          valeurPrecision: 0.95,
          valeurPredite: 'Oval',
          media: { id: 1, url: 'assets/uploads/leaf1.jpg' },
          model: { id: 1, name: 'LeafNet Imported' },
          dataset: { id: this.data.datasetId },
          importedAt: new Date().toISOString(),
          format: format
        },
        {
          id: Date.now() + 2,
          libelle: 'Imported Flower Color',
          valeurPrecision: 0.89,
          valeurPredite: 'Red',
          media: { id: 2, url: 'assets/uploads/flower1.jpg' },
          model: { id: 2, name: 'FlowerNet Imported' },
          dataset: { id: this.data.datasetId },
          importedAt: new Date().toISOString(),
          format: format
        }
      ];
      
      return baseAnnotations;
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
