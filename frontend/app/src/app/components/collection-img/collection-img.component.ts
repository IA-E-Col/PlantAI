import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import { catchError, Subscription, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgForOf, NgIf, DatePipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from "../../filter.pipe";

@Component({
  selector: 'app-collection-img',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './collection-img.component.html',
  styleUrl: './collection-img.component.css'
})

export class CollectionImgComponent  implements OnInit, OnDestroy {

  collectionId: string | null = null;
  collectionSpecimens: any[] = [];
  errorMessage: string = '';
  private routeSub!: Subscription;
  p: number = 1;
  isGridView: boolean = false;

  constructor(private projetService: ProjetService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if we're in a formulaire context (no collection ID in URL)
    if (this.router.url.includes('/formulaire')) {
      console.log('In formulaire context - fetching project collection');
      this.fetchProjectCollection();
    } else if (this.route.parent) {
      // Normal corpus context - get collection ID from URL
      this.routeSub = this.route.parent.paramMap.subscribe(params => {
        this.collectionId = params.get('Id') || params.get('id');
        console.log('Collection ID from URL:', this.collectionId);
        if (this.collectionId) {
          this.fetchSpecimens();
        }
      });
    }
  }

  fetchProjectCollection(): void {
    // Get the collection from the current project
    if (this.projetService.projet && this.projetService.projet.collection) {
      this.collectionId = this.projetService.projet.collection.id.toString();
      console.log('Using project collection ID:', this.collectionId);
      this.fetchSpecimens();
    } else {
      console.log('No project or collection found in service');
      
      // Try to get the most recent project from localStorage or user's projects
      const userString = localStorage.getItem("authUser");
      if (userString) {
        const user = JSON.parse(userString);
        console.log('Fetching recent projects for user:', user.id);
        
        this.projetService.funcS_get_All().subscribe({
          next: (projects) => {
            if (projects && projects.length > 0) {
              // Get the most recent project (first one)
              const recentProject = projects[0];
              console.log('Loading recent project:', recentProject);
              
              // Load this project into the service
              this.projetService.func_get_Id(recentProject.id).subscribe({
                next: (projectData) => {
                  console.log('Loaded project data:', projectData);
                  if (projectData.collection) {
                    this.collectionId = projectData.collection.id.toString();
                    this.fetchSpecimens();
                  } else {
                    this.errorMessage = 'Le projet n\'a pas de collection associée.';
                  }
                },
                error: (err) => {
                  console.error('Error loading project:', err);
                  this.errorMessage = 'Erreur lors du chargement du projet.';
                }
              });
            } else {
              this.errorMessage = 'Aucun projet trouvé. Veuillez d\'abord créer un projet.';
            }
          },
          error: (err) => {
            console.error('Error fetching projects:', err);
            this.errorMessage = 'Erreur lors de la récupération des projets.';
          }
        });
      } else {
        this.errorMessage = 'Utilisateur non connecté.';
      }
    }
  }

  fetchSpecimens(): void {
    this.projetService.func_get_SpecimenByCollection(this.collectionId!)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Une erreur est survenue lors du chargement de la collection.';
          console.error('Erreur lors du chargement', error);
          return of([]);
        })
      )
      .subscribe((specimens) => {
        console.log('Loaded specimens:', specimens);
        this.collectionSpecimens = specimens;
        this.sortPlantsByScientificName();
      });
  }

  sortPlantsByScientificName(): void {
    this.collectionSpecimens.sort((a, b) => a.nomScientifique.localeCompare(b.nomScientifique));
  }

  navigateToImageInf(plante: any): void {
    this.router.navigate([`/admin/corpus/${this.collectionId}/images`, plante.id], {
      state: { plante, plantes: this.collectionSpecimens }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
    console.log('isGridView:', this.isGridView); // Vérifie si la valeur change bien
  }
  
  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => 
      (word.includes('.') || word.endsWith('.') || word === '&') ? word : `<i>${word}</i>`
    ).join(' ');
  }
}