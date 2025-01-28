import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router, ActivatedRoute} from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

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

export class CollectionImgComponent {

  collectionId: any;
  collectionSpecimens: any[] = [];
  errorMessage!: string;
  private routeSub!: Subscription;
  p: number = 1;
  isGridView = false;

  constructor(private projetService: ProjetService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.routeSub = this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('Id') || params.get('id');
      console.log('Collection ID:', this.collectionId);
    });

    this.projetService.func_get_SpecimenByCollection(this.collectionId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'An error occurred while fetching collection';
          // Optionally, you can log the error or handle it as needed
          console.error('Error fetching collection', error);
          return of([]);
        })
      )
      .subscribe(
        (specimens) => {
          console.log(specimens)
          this.collectionSpecimens = specimens;
          this.sortPlantsByScientificName();
        }
      );
  }

  sortPlantsByScientificName(): void {
    this.collectionSpecimens.sort((a: { nomScientifique: number; }, b: { nomScientifique: number; }) => {
      if (a.nomScientifique < b.nomScientifique) {
        return -1;
      } else if (a.nomScientifique > b.nomScientifique) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  navigateToImageInf(plante: any) {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: this.collectionSpecimens }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => {
      // Check if the word contains a period or ends with a period, or is '&'
      if (word.includes('.') || word.endsWith('.') || word === '&') {
        return word; // Return word as is
      } else {
        return `<i>${word}</i>`; // Italicize other words
      }
    }).join(' '); // Join words back into a string
  }  

}
