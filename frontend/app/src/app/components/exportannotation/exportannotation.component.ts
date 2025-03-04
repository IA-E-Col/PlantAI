import { Component } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service"; // Import ProjetService
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CreeCollectionComponent } from "../cree-collection/cree-collection.component";
import { MatDialog } from "@angular/material/dialog";
import { SharedServiceService } from '../../services/shared-service.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

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
    FontAwesomeModule
  ]
})
export class ExportannotationComponent {
  formats: string[] = ['JSON', 'XML', 'CSV'];
  selectedFormat: string = 'JSON';

  annotations = [
    { imgSrc: 'image1.jpg', description: 'Annotation 1', selected: false },
    { imgSrc: 'image2.jpg', description: 'Annotation 2', selected: false },
    { imgSrc: 'image3.jpg', description: 'Annotation 3', selected: false }
  ];

  // Select/Deselect all annotations
  toggleAllSelection(event: any) {
    const checked = event.target.checked;
    this.annotations.forEach(annotation => annotation.selected = checked);
  }

  // Export selected annotations
  exportSelected() {
    const selectedAnnotations = this.annotations.filter(a => a.selected);

    if (selectedAnnotations.length === 0) {
      alert('Please select at least one annotation to export.');
      return;
    }

    console.log('Exporting:', selectedAnnotations);

    if (this.selectedFormat === 'JSON') {
      const jsonData = JSON.stringify(selectedAnnotations, null, 2);
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
    // Add handling for XML/CSV here if needed
  }

  //  "importAnnotations()"
  importAnnotations() {
    alert('Import functionality is not implemented yet.');
    console.log('Import function triggered');
  }
}
