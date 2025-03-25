import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnotationService } from '../../services/annotation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FilterPipe } from '../../filter.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
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
    FontAwesomeModule],
  templateUrl: './import-annotations.component.html',
  styleUrl: './import-annotations.component.css'
})
export class ImportAnnotationsComponent implements OnInit {

    annotationFormGroup!: FormGroup
    file!: File ;
  
    constructor(
      private fb: FormBuilder,
      private annotationService : AnnotationService,
      private route : ActivatedRoute,
      @Inject(MAT_DIALOG_DATA) public data: { datasetId: string },
      private dialogRef: MatDialogRef<ImportAnnotationsComponent>
      ) {}
  
    ngOnInit() {
      console.log(this.data.datasetId);
      this.annotationFormGroup = this.fb.group({
        selectedFormatName: ['', Validators.required],
        annotationFile: ['', Validators.required],
      }
      );
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

    import_annotations(){
      const formData = new FormData();
      formData.append('file',this.file);
      const format = this.annotationFormGroup.get('selectedFormatName');
      if (format){
        formData.append('format',format.value);
        this.annotationService.importAnnotations(formData).subscribe(
          {
            next: (data) => {
              this.dialogRef.close(data);
            },
            error: (err) => {
              Swal.fire('Error', 'Failed to import annotations', 'error');
              console.error(err);
              this.dialogRef.close();
            }
          }
        );
      }
    }
  formats = [
    {
      name: "JSON"
    },
    {
      name: "CSV"
    },
  ]
}
