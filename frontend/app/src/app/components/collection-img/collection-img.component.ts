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
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('Id') || params.get('id');
      console.log('Collection ID:', this.collectionId);
      if (this.collectionId) {
        this.fetchSpecimens();
      }
    });
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
        console.log(specimens);
        this.collectionSpecimens = specimens;
        this.sortPlantsByScientificName();
      });
  }

  sortPlantsByScientificName(): void {
    this.collectionSpecimens.sort((a, b) => a.nomScientifique.localeCompare(b.nomScientifique));
  }

  navigateToImageInf(plante: any): void {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
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