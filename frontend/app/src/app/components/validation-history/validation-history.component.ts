import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AnnotationService } from '../../services/annotation.service';
import { ProjetService } from '../../services/projet.service';
import { ActivatedRoute } from '@angular/router';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
interface Annotation {
  id: number;
<<<<<<< HEAD
  name: string;
  submissionDate: string;
  state: string;
  etat: string;
=======
  libelle: string;
  //state: string;
  etat: string;
  valeurPredite: string;
  modelcat: string;
  modelName: string; 
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
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
  faSearch = faSearch;
  private user!: any;
  userId!: any;
  userString!: any;
  datasetId: number | null = null;  // Déclare une variable pour stocker l'ID du dataset




  constructor(private annotationService: AnnotationService, private projetService:ProjetService, private route: ActivatedRoute, ) {}

  ngOnInit(): void {
    this.userString = localStorage.getItem('authUser');

    if (this.userString) {
      this.user = JSON.parse(this.userString);
      this.userId = this.user.user.id; // Récupération de l'ID utilisateur

      // Récupérer l'ID du dataset depuis l'URL
      this.route.paramMap.subscribe((params) => {
        this.datasetId = +params.get('datasetId')!; // Récupérer et convertir l'ID du dataset

        // Appeler la méthode avec userId et datasetId
        this.projetService.getAnnHistory(this.userId, this.datasetId!).subscribe((data) => {
          this.annotations = data;
          this.filteredAnnotations = data;
        });
      });
    }
  }



  filterAnnotations() {
    this.filteredAnnotations = this.annotations.filter(annotation => 
      annotation.libelle.toLowerCase().includes(this.filterText.toLowerCase()) &&
      annotation.etat.toLowerCase().includes(this.filterState.toLowerCase()) 
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
