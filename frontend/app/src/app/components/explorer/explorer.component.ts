import { Component } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
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

@Component({
  selector: 'app-explorer',
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
  ],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css'
})
export class ExplorerComponent {
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext: any;
  collections: any[] = [];
  errorMessage!: string;
  p: number = 1;
  message_err!: string
  faSearch = faSearch;
  faTrash = faTrash;
  faEdit = faEdit;
  
  constructor(private dialogRef: MatDialog,private projetService: ProjetService, private router: Router,private sharedServiceService: SharedServiceService) { }

  ngOnInit(): void {
    this.projetService.func_get_All_collection()
      .pipe(
        catchError(error => {
          this.errorMessage = 'An error occurred while fetching collections';
          // Optionally, you can log the error or handle it as needed
          console.error('Error fetching collections', error);
          return of([]);
        })
      )
      .subscribe(
        (collections) => {
          this.collections = collections;
          console.log(this.collections)
        }
      );
    /*this.collections = [
      {
        id: 'ML001',
        nom: 'Collection des herbiers',
        dateCreation: '23/05/2024',
        description: "Cette collection regroupe une variété de spécimens de plantes séchées et préservées, représentant une large gamme de la biodiversité végétale. Chaque échantillon est soigneusement identifié et catalogué, offrant une ressource précieuse pour l'étude de la botanique et la conservation des plantes."
      },
      {
        id: 'ML002',
        nom: 'Collection de minéraux',
        dateCreation: '15/06/2024',
        description: "Cette collection comprend une vaste sélection de minéraux provenant de diverses régions du monde. Chaque minéral est classé selon ses propriétés physiques et chimiques, ce qui en fait une ressource indispensable pour les géologues et les passionnés de minéralogie."
      },
      {
        id: 'ML003',
        nom: 'Collection d’insectes',
        dateCreation: '01/07/2024',
        description: "Cette collection présente une diversité d'insectes épinglés et conservés, incluant des spécimens rares et exotiques. Elle est utilisée à des fins éducatives et de recherche, permettant l'étude de l'entomologie et de la biodiversité des insectes."
      },
      {
        id: 'ML004',
        nom: 'Collection de fossiles',
        dateCreation: '10/08/2024',
        description: "Cette collection contient des fossiles de différentes périodes géologiques, offrant un aperçu fascinant de l'évolution de la vie sur Terre. Elle est particulièrement utile pour les paléontologues et les chercheurs en sciences de la Terre."
      },
      {
        id: 'ML005',
        nom: 'Collection de coquillages',
        dateCreation: '20/09/2024',
        description: "Cette collection rassemble une variété de coquillages marins et d'eau douce, illustrant la diversité des mollusques. Chaque coquillage est identifié et étiqueté, fournissant des informations précieuses pour les malacologistes et les collectionneurs."
      }
    ];*/

  }

 // func_ajout_Col() {
 //   this.router.navigateByUrl("/admin/NewCollection")
 // }
  func_ajout_Col() {
    const dialogRefa = this.dialogRef.open(CreeCollectionComponent, {
      width: '700px',
      height: '500px',
      data: { is_active : false }
    });
    dialogRefa.afterClosed().subscribe(result => {
      // Réagir à la fermeture du dialogue si nécessaire
      // Par exemple, rafraîchir la liste des classes
      this.projetService.func_get_All_collection()
        .pipe(
          catchError(error => {
            this.errorMessage = 'An error occurred while fetching collections';
            // Optionally, you can log the error or handle it as needed
            console.error('Error fetching collections', error);
            return of([]);
          })
        )
        .subscribe(
          (collections) => {
            this.collections = collections;
          }
        );
    });
  }
  ouvrirCol(id: any) {
    this.sharedServiceService.setCorpusId(id);
    this.router.navigateByUrl(`/admin/explore-details/${id}/collectionImg/${id}`);
  }

  supprimerCol(id: any) { }

  sortBy(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.collections.sort((a, b) => {
      let comparison = 0;
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        comparison = a[field].localeCompare(b[field]);
      } else {
        comparison = a[field] - b[field];
      }
      return this.isAscending ? comparison : -comparison;
    });
  }


}
