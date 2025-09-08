import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { ImportAnnotationsComponent } from '../import-annotations/import-annotations.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { NavigationActions } from '../../store';
import { 
  selectUser,
  selectUserId 
} from '../../store/auth/auth.selectors';
import { 
  selectNavigationDatasetId
} from '../../store/navigation/navigation.selectors';

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
    AsyncPipe
  ]
})

export class ExportannotationComponent implements OnInit, OnDestroy {
  // UI State
  formats: string[] = ['JSON', 'XML', 'CSV'];
  selectedFormat: string = 'JSON';
  faSearch = faSearch;
  faDownload = faDownload;
  faUpload = faUpload;
  errorMessage = "";
  
  // NgRx Observables
  user$: Observable<any>;
  userId$: Observable<number | null>;
  datasetId$: Observable<string | null>;
  
  // Reactive state management
  private annotationsSubject = new BehaviorSubject<any[]>([]);
  annotations$: Observable<any[]> = this.annotationsSubject.asObservable();
  
  // Component data
  datasetId: string | null = null;
  userId: string | null = null;
  annotations: any[] = [];
  annotationsToExport: any[] = [];
  
  private destroy$ = new Subject<void>();
  constructor(
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.user$ = this.store.select(selectUser);
    this.userId$ = this.store.select(selectUserId);
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
  }
  ngOnInit(): void {
    // Handle route parameters and update navigation state
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const datasetId = params.get('id');
        this.datasetId = datasetId;
        
        if (datasetId) {
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId }));
        }
      });
    
    // Get user ID from NgRx store
    this.userId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        if (userId) {
          this.userId = userId.toString();
          this.loadAnnotations();
        }
      });
    
    console.log('Export annotations component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnnotations(): void {
    if (this.datasetId && this.userId) {
      console.log('Loading annotations for dataset:', this.datasetId, 'user:', this.userId);
      
      // Generate mock annotations for demonstration
      const mockAnnotations = this.generateMockAnnotations();
      this.annotations = mockAnnotations;
      this.annotationsSubject.next(mockAnnotations);
      
      console.log('Mock annotations loaded:', mockAnnotations.length, 'items');
      
      // TODO: Replace with proper NgRx annotation loading
      // this.store.dispatch(AnnotationsActions.loadAnnotationsByDataset({ 
      //   datasetId: this.datasetId, 
      //   userId: this.userId 
      // }));
    }
  }

  private generateMockAnnotations(): any[] {
    return [
      {
        id: 1,
        libelle: 'Leaf Shape Classification',
        valeurPrecision: 0.95,
        valeurPredite: 'Oval',
        media: { id: 1, url: 'assets/uploads/leaf1.jpg' },
        model: { id: 1, name: 'LeafNet v2.0' },
        dataset: { id: this.datasetId },
        createdAt: '2023-01-15T10:30:00Z',
        selected: false
      },
      {
        id: 2,
        libelle: 'Flower Color Detection',
        valeurPrecision: 0.88,
        valeurPredite: 'Red',
        media: { id: 2, url: 'assets/uploads/flower1.jpg' },
        model: { id: 2, name: 'ColorNet v1.5' },
        dataset: { id: this.datasetId },
        createdAt: '2023-01-16T14:20:00Z',
        selected: false
      },
      {
        id: 3,
        libelle: 'Plant Height Estimation',
        valeurPrecision: 0.92,
        valeurPredite: '150cm',
        media: { id: 3, url: 'assets/uploads/plant1.jpg' },
        model: { id: 3, name: 'HeightNet v1.0' },
        dataset: { id: this.datasetId },
        createdAt: '2023-01-17T09:15:00Z',
        selected: false
      }
    ];
  }


  // Select/Deselect all annotations
  toggleAllSelection(event: any): void {
    const checked = event.target.checked;
    this.annotations.forEach(annotation => annotation.selected = checked);
    
    // Update reactive state
    this.annotationsSubject.next([...this.annotations]);
    
    console.log('All annotations', checked ? 'selected' : 'deselected');
  }
  exportSelected(): void {
    const selectedAnnotations = this.annotations.filter(a => a.selected);

    if (selectedAnnotations.length === 0) {
      Swal.fire('Warning', 'Please select at least one annotation to export.', 'warning');
      return;
    }

    console.log('Exporting annotations:', {
      count: selectedAnnotations.length,
      format: this.selectedFormat,
      datasetId: this.datasetId
    });

    // Show loading indicator
    Swal.fire({
      title: 'Preparing Export',
      text: `Exporting ${selectedAnnotations.length} annotations as ${this.selectedFormat}...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simulate export processing
    setTimeout(() => {
      this.performExport(selectedAnnotations);
    }, 1500);
  }

  private performExport(selectedAnnotations: any[]): void {
    try {
      let exportedData: any;
      let mimeType: string;
      let filename: string;

      switch (this.selectedFormat) {
        case 'JSON':
          exportedData = this.formatAsJSON(selectedAnnotations);
          mimeType = 'application/json';
          filename = `annotations_${this.datasetId}_${Date.now()}.json`;
          break;
        case 'CSV':
          exportedData = this.formatAsCSV(selectedAnnotations);
          mimeType = 'text/csv';
          filename = `annotations_${this.datasetId}_${Date.now()}.csv`;
          break;
        case 'XML':
          exportedData = this.formatAsXML(selectedAnnotations);
          mimeType = 'application/xml';
          filename = `annotations_${this.datasetId}_${Date.now()}.xml`;
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Create and download file
      const blob = new Blob([exportedData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Swal.fire({
        title: 'Export Successful!',
        text: `Successfully exported ${selectedAnnotations.length} annotations as ${this.selectedFormat}`,
        icon: 'success',
        timer: 3000
      });

      // Clear selections
      this.annotations.forEach(annotation => annotation.selected = false);
      this.annotationsSubject.next([...this.annotations]);

    } catch (error) {
      console.error('Export error:', error);
      Swal.fire('Error', 'Failed to export annotations', 'error');
    }
  }

  private formatAsJSON(annotations: any[]): string {
    const exportedData = annotations.map(annotation => ({
      annSpecification: "classification",
      libelle: annotation.libelle,
      valeurPrecision: annotation.valeurPrecision,
      valeurPredite: annotation.valeurPredite,
      mediaId: annotation.media.id,
      modelInferenceId: annotation.model.id,
      datasetId: annotation.dataset.id,
      exportedAt: new Date().toISOString()
    }));
    
    return JSON.stringify({
      metadata: {
        exportFormat: 'JSON',
        exportDate: new Date().toISOString(),
        datasetId: this.datasetId,
        annotationCount: annotations.length
      },
      annotations: exportedData
    }, null, 2);
  }

  private formatAsCSV(annotations: any[]): string {
    const headers = ['ID', 'Libelle', 'Valeur Precision', 'Valeur Predite', 'Media ID', 'Model ID', 'Dataset ID'];
    const rows = annotations.map(annotation => [
      annotation.id,
      annotation.libelle,
      annotation.valeurPrecision,
      annotation.valeurPredite,
      annotation.media.id,
      annotation.model.id,
      annotation.dataset.id
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private formatAsXML(annotations: any[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const annotationsXML = annotations.map(annotation => `
  <annotation>
    <id>${annotation.id}</id>
    <libelle>${annotation.libelle}</libelle>
    <valeurPrecision>${annotation.valeurPrecision}</valeurPrecision>
    <valeurPredite>${annotation.valeurPredite}</valeurPredite>
    <mediaId>${annotation.media.id}</mediaId>
    <modelId>${annotation.model.id}</modelId>
    <datasetId>${annotation.dataset.id}</datasetId>
  </annotation>`).join('');
    
    return `${xmlHeader}<annotations>${annotationsXML}\n</annotations>`;
  }

  importAnnotations(): void {
    if (!this.datasetId) {
      Swal.fire('Error', 'No dataset selected for import', 'error');
      return;
    }

    const dialogRefa = this.dialogRef.open(ImportAnnotationsComponent, {
      width: '700px',
      height: '500px',
      data: { datasetId: this.datasetId }
    });
    
    dialogRefa.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(importedAnnotations => {
        if (importedAnnotations && importedAnnotations.length > 0) {
          console.log('Import completed:', importedAnnotations.length, 'annotations');
          
          // Add imported annotations to current list
          this.annotations = [...this.annotations, ...importedAnnotations];
          this.annotationsSubject.next(this.annotations);
          
          Swal.fire({
            title: 'Import Complete!',
            text: `Added ${importedAnnotations.length} new annotations`,
            icon: 'success',
            timer: 2000
          });
        }
      });
  }

  // UI Helper methods
  getSelectedCount(): number {
    return this.annotations.filter(a => a.selected).length;
  }

  hasSelectedAnnotations(): boolean {
    return this.getSelectedCount() > 0;
  }

  trackByAnnotationId(index: number, annotation: any): number {
    return annotation.id;
  }

  onAnnotationSelectionChange(): void {
    // Update reactive state when individual annotations are selected/deselected
    this.annotationsSubject.next([...this.annotations]);
  }
}
