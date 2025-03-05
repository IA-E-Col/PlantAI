import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs';
import { AnnotationService } from '../../services/annotation.service';
import { ImportAnnotationsComponent } from '../import-annotations/import-annotations.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exportannotation',
  templateUrl: './exportannotation.component.html',
  styleUrls: ['./exportannotation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    FontAwesomeModule,
  ]
})

export class ExportannotationComponent implements OnInit{
  formats: string[] = ['JSON', 'XML', 'CSV'];
  selectedFormat: string = 'JSON';
  faSearch = faSearch;
  errorMessage = "";
  datasetId : string | null = null;
  userId : string | null = null;
  annotations : any[] = [];
  annotationsToExport : any[] = [];
  constructor(private dialogRef: MatDialog, private annotationService : AnnotationService, private route : ActivatedRoute){}
  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
       this.datasetId = params.get('id');
       const authUser : string | null = localStorage.getItem('authUser');
       if (authUser){
        const user = JSON.parse(authUser).user;
        if (user)
          this.userId = user.id;
        if (this.datasetId && this.userId){
          this.annotationService.getAnnotationsByDataset(this.datasetId, this.userId).subscribe(
            annotations => {
              this.annotations = [...annotations];
            }
        )
      }
       }

    })

  }


  // Select/Deselect all annotations
  toggleAllSelection(event: any) {
    const checked = event.target.checked;
    this.annotations.forEach(annotation => annotation.selected = checked);
  }
  exportSelected() {
    const selectedAnnotations = this.annotations.filter(a => a.selected);

    if (selectedAnnotations.length === 0) {
      alert('Please select at least one annotation to export.');
      return;
    }

    console.log('Exporting:', selectedAnnotations);

    if (this.selectedFormat === 'JSON') {
      const exportedData = selectedAnnotations.map(selectedAnnotation => 
      { return {
          annSpecification: "classi",
          libelle: selectedAnnotation.libelle,
          valeurPrecision: selectedAnnotation.valeurPrecision,
          valeurPredite: selectedAnnotation.valeurPredite,
          mediaId: selectedAnnotation.media.id,
          modelInferenceId: selectedAnnotation.model.id,
          datasetId: selectedAnnotation.dataset.id
      }})
      const jsonData = JSON.stringify(exportedData, null, 2);

      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'annotations.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  importAnnotations() {
    const dialogRefa = this.dialogRef.open(ImportAnnotationsComponent, {
      width: '700px',
      height: '500px',
      data: {datasetId : this.datasetId}
    });
    dialogRefa.afterClosed().subscribe(importedAnnotations => {
      if (importedAnnotations){
        this.annotations = [...this.annotations, ...importedAnnotations];

      }
    });
  }
}
