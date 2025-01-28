import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {ProjetService} from "../../services/projet.service";
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {NewprojetComponent} from "../newprojet/newprojet.component";
import {catchError, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-projets',
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
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css'
})
export class ProjetsComponent implements OnInit {
  filterMenuActive: boolean = false;
  sortMenuActive: boolean = false;
  selectedOption: string = "all";

  p: number = 1;
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext:any;
  projets! : Array<any>
  message_err! : string
  nonPrj! : string
  cheminPlus = "assets/plus.png";
  username = this.projetService.func_get_username();

  errorMessage!: string;

  constructor(private dialogRef: MatDialog,private projetService : ProjetService, private router : Router) {}
  ngOnInit() {
    this.projetService.func_get_AllPrj_User().subscribe({
      next : (data )=>{
        this.projetService.projets = data;
        this.projets = data;
        console.log(data);
      },
      error :(err)=>{
        this.message_err = err
      }
    });
//////////////////////////
/*
    this.projetService.func_get_Specimen_Filtred() .subscribe({
      next : (data )=>{
          console.log(data)
        this.projetService.specimens = data;
          this.projetService.func_add_Specimen_to_Collection(IDProjet) .subscribe({
            next : (data )=>{
              console.log(data);
            },
            error :(err)=>{
              console.log(err)
            }
          });

      },
      error :(err)=>{
        console.log(err)
      }
    });

 */




  }



 // func_ajout_Prj() {
  //  this.router.navigateByUrl("/admin/newprojet")
 // }
  func_ajout_Prj() {
    const dialogRef = this.dialogRef.open(NewprojetComponent, {
      width: '700px',
      height: '500px',
      data: { is_active : false }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Réagir à la fermeture du dialogue si nécessaire
      // Par exemple, rafraîchir la liste des classes
      this.projetService.func_get_AllPrj_User()
        .pipe(
          catchError(error => {
            this.errorMessage = 'An error occurred while fetching projects';
            // Optionally, you can log the error or handle it as needed
            console.error('Error fetching projects', error);
            return of([]);
          })
        )
        .subscribe(
          (projets) => {
            this.projets = projets;
          }
        );
    });
  }
  ouvrirProjet(id: any) {
    this.projetService.func_get_Id(id).subscribe({
      next: (projet) => {
        // Naviguez vers la page du projet ou gérez les données du projet selon les besoins
        this.projetService.projet=projet
        this.router.navigateByUrl(`/admin/projbar/${id}`);
      },
      error: (err) => {
        // Gérez l'erreur
        console.error(err);
      }
    });
  }

  supprimerProjet(id: any) {
    console.log("hello delete projet")
    // Affichage de l'alerte de confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this project. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete project',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procédez à la suppression du projet
        this.projetService.func_supp_prj(id).subscribe({
          next: (data) => {
            Swal.fire('Success', 'Project deleted successfully', 'success').then(() => {
            });
            this.ngOnInit();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to delete project', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  funcGet_createur_prj(IdP:any) {
    this.projetService.func_get_createur(IdP).subscribe({
      next: (data) => {
        console.log(data);
        this.nonPrj = data.username
      },
      error: (err) => {
        console.log(err)
      }
    })
    return this.nonPrj
  }


  sortBy(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.projets.sort((a, b) => {
      let comparison = 0;
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        comparison = a[field].localeCompare(b[field]);
      } else {
        comparison = a[field] - b[field];
      }
      return this.isAscending ? comparison : -comparison;
    });
  }

  toggleFilterMenu() {
    this.filterMenuActive = !this.filterMenuActive;
  }

  toggleSortMenu() {
    this.sortMenuActive = !this.sortMenuActive;
  }

  // Méthode appelée lorsque le bouton "Apply" est cliqué
  applyFilter() {
    switch(this.selectedOption) {
      case 'all':
        this.projetService.func_get_AllPrj_User().subscribe(
          {
            next: (data) => {
              console.log(data);
              this.projets = data
            },
            error: (err) => {
              console.log(err)
            }
          }
        )
        break;
      case 'my':
        // Effectuez les traitements pour "My projects"
        console.log('Apply filter for my projects');
        this.projetService.func_get_Prj_Cree().subscribe(
          {
            next: (data) => {
              console.log(data);
              this.projets = data
            },
            error: (err) => {
              console.log(err)
            }
          }
        )
        break;
      case 'collaborator':
        // Effectuez les traitements pour "Collaborator projects"
        console.log('Apply filter for collaborator projects');
        this.projetService.func_get_Prj_Collab().subscribe(
          {
            next: (data) => {
              console.log(data);
              this.projets = data
            },
            error: (err) => {
              console.log(err)
            }
          }
        )
        break;
      default:
        console.log('Invalid filter option');
    }
  }

  // Méthode appelée lorsque le bouton "Reset" est cliqué
  resetFilter() {
    // Effectuez les traitements de réinitialisation nécessaires
    console.log('Reset filter');
  }

}
