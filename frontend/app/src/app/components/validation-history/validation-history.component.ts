import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AnnotationService } from '../../services/annotation.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Annotation {
  id: number;
  name: string;
  submissionDate: string;
  state: string;
  etat: string;
}

@Component({
  selector: 'app-validation-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './validation-history.component.html',
  styleUrls: ['./validation-history.component.css']
})
export class ValidationHistoryComponent implements OnInit {
  annotations: Annotation[] = [];
  filteredAnnotations: Annotation[] = [];
  filterText: string = '';
  filterState: string = '';
  filterDate: string = '';
  sortField: keyof Annotation | null = null;
  isAscending: boolean = true;
  faSearch = faSearch

  constructor(private annotationService: AnnotationService) {}

  ngOnInit(): void {
    this.annotationService.getAnnotations().subscribe((data) => {
      this.annotations = data;
      this.filteredAnnotations = data;
    });
  }

  filterAnnotations() {
    this.filteredAnnotations = this.annotations.filter(annotation => 
      annotation.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
      annotation.state.toLowerCase().includes(this.filterState.toLowerCase()) &&
      annotation.submissionDate.includes(this.filterDate)
    );
  }

  sortBy(field: keyof Annotation) {
    if (this.sortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortField = field;
      this.isAscending = true;
    }

    this.filteredAnnotations.sort((a, b) => {
      return this.isAscending
        ? (a[field] > b[field] ? 1 : -1)
        : (a[field] < b[field] ? 1 : -1);
    });
  }
}
