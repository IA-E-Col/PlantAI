import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { ProjetService } from "../../services/projet.service";
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent implements OnInit {
  sortMenuActive: boolean = false;

  p: number = 1;
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext: any;
  projets!: Array<any>
  collection!: Array<any>;
  nbr_c = 0;
  nbr_m = '0'; /*'999.2M'*/
  nbr_s = 0;
  nbr_e = '999.2M';
  formatted_nbr_s: string = '';
  formatted_nbr_c: string = '';
  projectId!: any;
  cheminPlus = "assets/plus.png";
  cheminTot = "assets/tous.png";
  cheminMod = "assets/mod.png";
  cheminSpe = "assets/spe.png";
  cheminEsp = "assets/esp.png";
  collections: any;
  message_err: any;
  bol: boolean = true;
  width: boolean = true;

  /*data = {
    collect1: [
      {
        id: 'I22T455',
        nom: 'Rosiers hybrides',
        descrption: 'Variétés hybrides de rosiers',
        date: '29-01-2001',
        createur: 'Mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T456',
        nom: 'Légumes biologiques',
        descrption: 'Variétés de légumes biologiques',
        date: '30-01-2001',
        createur: 'Fatima',
        modele: 'Machine learning'
      },
      {
        id: 'I22T457',
        nom: 'Plantes succulentes',
        descrption: 'Variétés de plantes succulentes pour la décoration',
        date: '31-01-2001',
        createur: 'Sara',
        modele: 'Support vector machines'
      },
      {
        id: 'I22T458',
        nom: 'Fleurs exotiques',
        descrption: 'Variétés rares de fleurs exotiques',
        date: '28-01-2001',
        createur: 'Karim',
        modele: 'Neural networks'
      },
      {
        id: 'I22T459',
        nom: 'Herbes aromatiques',
        descrption: 'Variétés d\'herbes aromatiques pour la cuisine',
        date: '27-01-2001',
        createur: 'Amina',
        modele: 'Random forest'
      },
      {
        id: 'I22T460',
        nom: 'Plantes médicinales',
        descrption: 'Variétés de plantes médicinales pour la phytothérapie',
        date: '26-01-2001',
        createur: 'Ahmed',
        modele: 'Decision trees'
      },
    ],

    collect2: [
      {
        id: 'I22T458',
        nom: 'Fleurs exotiques',
        descrption: 'Variétés rares de fleurs exotiques',
        date: '28-01-2001',
        createur: 'Karim',
        modele: 'Neural networks'
      },
      {
        id: 'I22T459',
        nom: 'Herbes aromatiques',
        descrption: 'Variétés d\'herbes aromatiques pour la cuisine',
        date: '27-01-2001',
        createur: 'Amina',
        modele: 'Random forest'
      },
      {
        id: 'I22T460',
        nom: 'Plantes médicinales',
        descrption: 'Variétés de plantes médicinales pour la phytothérapie',
        date: '26-01-2001',
        createur: 'Ahmed',
        modele: 'Decision trees'
      },
    ]
  };*/
  constructor(private route: ActivatedRoute, private router: Router, private projetservice: ProjetService) {
  }

  formatNumber(number: number): string {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + ' M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + ' K';
    } else {
      return number.toString();
    }
  }

  ngAfterViewInit() {
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(segment => segment.path).join('/');
      if (path === 'collection/total') {
        this.width = true;
      } else {
        this.width = false;
      }
    });
  }

  ngOnInit() {
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(segment => segment.path).join('/');
      if (path === 'collection/total') {
        console.log('Traitement spécial pour collection/total');

        this.width = true;
        this.bol = false;
        this.projetservice.func_get_AllPrj_User().subscribe({
          next: (data) => {
            this.projetservice.projets = data;
            this.projets = data;
            console.log('projets', data);

            // Réinitialise les collections à vide
            this.collections = [];

            // Pour chaque projet, récupère les collections
            for (const projet of data) {
              this.projetservice.func_get_DatasetsById(projet.id).subscribe({
                next: (projData) => {
                  console.log('projet', projData)

                  // Ajoute les collections du projet actuel à collections
                  this.collections.push(...projData);


                  //this.nbr_s = projData.numberOfSpecimen;
                  //this.nbr_c =projData.numberOfDataset;
                  this.nbr_c = this.collections.length;



                  this.collections.forEach((collection: { numberOfSpecimen: number; }) => {
                    this.nbr_s += collection.numberOfSpecimen
                  });

                  this.formatted_nbr_s = this.formatNumber(this.nbr_s);
                  this.formatted_nbr_c = this.formatNumber(this.nbr_c);


                },
                error: (err) => {
                  console.log(err);
                }
              });
            }

          },
          error: (err) => {
            this.message_err = err;
          }
        });
      } else {
        this.route.params.subscribe(params => {
          this.projectId = params['Id'];
          console.log('Id:', this.projectId)
          /*this.collection = this.data["collect1"];
          console.log(this.collection)*/

          this.collections = [];
          this.width = false;
          this.projetservice.func_get_DatasetsById(this.projectId).subscribe({
            next: (data) => {
              this.collections = data;
              console.log('this.collections',this.collections)
              this.collections.forEach((collection: { numberOfSpecimen: number; }) => {
                this.nbr_s += collection.numberOfSpecimen
              });
              this.nbr_c = data.length;
              this.formatted_nbr_s = this.formatNumber(this.nbr_s);
              this.formatted_nbr_c = this.formatNumber(this.nbr_c);
            },
            error: (err) => {
              console.log(err)
            }
          })
        });
      }
    });
  }

  func_inf_C(c: any) {
    // Affichage de l'alerte de confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this collection. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete collection',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procédez à la suppression de la collection
        this.projetservice.func_delete_collection(c.id).subscribe({
          next: (data) => {
            Swal.fire('Success', 'Collection deleted successfully', 'success').then(() => {
              // Recharger les données après la suppression
              this.nbr_s = 0;
              this.ngOnInit();
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to delete collection', 'error');
            console.error(err);
          }
        });
      }
    });
  }


  func_ajout_col() {
    this.router.navigateByUrl("/admin/formulaire")
  }

  sortBy(field: string) {
    console.log('teeeest')
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.collections[0].datasets.sort((a: any, b: any) => {
      let aValue = this.getFieldValue(a, field);
      let bValue = this.getFieldValue(b, field);

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue - bValue;
      }
      return this.isAscending ? comparison : -comparison;
    });
  }

  getFieldValue(object: any, field: string) {
    return field.split('.').reduce((o, i) => o[i], object);
  }


  onFinishClicked(collection: any) {
    this.projetservice.collection_actuelle = collection
    this.router.navigateByUrl(`/admin/collection-inf/datasetInf/${collection.id}`);
  }

  toggleSortMenu() {
    this.sortMenuActive = !this.sortMenuActive;
  }


}
