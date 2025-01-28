import { Component, OnInit } from '@angular/core';
import { NgForOf } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import Swal from "sweetalert2";
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NewclasseComponent } from '../newclasse/newclasse.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CreeCollectionComponent } from '../cree-collection/cree-collection.component';
import { CreeModeleComponent } from '../cree-modele/cree-modele.component';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    RouterLink,
    RouterOutlet,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  p: number = 1;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  searchtext: any;
  searchtext1: any;
  searchtext2: any;
  searchtext3: any;
  Classes: Array<{ name: string, identifier: string }> = [];
  isAscending: boolean = true;
  currentSortField: string = '';
  collections: any[] = [];
  modele: any[] = [];
  users: any[] = [];
  errorMessage!: string
  currentStep: number = 2;

  constructor(private dialogRef: MatDialog,private projetService: ProjetService, private router: Router) { }

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
        }
      );

      this.projetService.func_get_All_models().subscribe({
        next: (data) => {
          this.modele=data;
          console.log("settings",data)
          },

        error: (err) => {
          Swal.fire('Error', 'Failed to load models', 'error');
          console.error(err);
        }
      });
    this.projetService.func_get_All_classe().subscribe({
      next: (data) => {
        console.log(data)
        this.Classes=data;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.users = [
      { name: 'User1', prenom: 'Prenom1', email: 'user1@example.com', id: 'ID1' },
      { name: 'User2', prenom: 'Prenom2', email: 'user2@example.com', id: 'ID2' },
      { name: 'User3', prenom: 'Prenom3', email: 'user3@example.com', id: 'ID3' },
      { name: 'User4', prenom: 'Prenom4', email: 'user4@example.com', id: 'ID4' },
      { name: 'User5', prenom: 'Prenom5', email: 'user5@example.com', id: 'ID5' },
      { name: 'User6', prenom: 'Prenom6', email: 'user6@example.com', id: 'ID6' },
      { name: 'User7', prenom: 'Prenom7', email: 'user7@example.com', id: 'ID7' },
      { name: 'User8', prenom: 'Prenom8', email: 'user8@example.com', id: 'ID8' },
      { name: 'User9', prenom: 'Prenom9', email: 'user9@example.com', id: 'ID9' },
      { name: 'User1', prenom: 'Prenom1', email: 'user1@example.com', id: 'ID1' },
      { name: 'User2', prenom: 'Prenom2', email: 'user2@example.com', id: 'ID2' },
      { name: 'User3', prenom: 'Prenom3', email: 'user3@example.com', id: 'ID3' },
      { name: 'User4', prenom: 'Prenom4', email: 'user4@example.com', id: 'ID4' },
      { name: 'User5', prenom: 'Prenom5', email: 'user5@example.com', id: 'ID5' },
      { name: 'User6', prenom: 'Prenom6', email: 'user6@example.com', id: 'ID6' },
      { name: 'User7', prenom: 'Prenom7', email: 'user7@example.com', id: 'ID7' },
      { name: 'User8', prenom: 'Prenom8', email: 'user8@example.com', id: 'ID8' },
      { name: 'User9', prenom: 'Prenom9', email: 'user9@example.com', id: 'ID9' }
    ];
  }

  func_ajout_Classe() {
    const dialogRefa = this.dialogRef.open(NewclasseComponent);

    dialogRefa.afterClosed().subscribe(result => {
      // Réagir à la fermeture du dialogue si nécessaire
      // Par exemple, rafraîchir la liste des classes
      this.projetService.func_get_All_classe().subscribe({
        next: (data) => {
          this.Classes = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  func_update_c(p: any) { }

  func_delete_c(p: any) { }

  func_ajout_Col() {
    const dialogRefa = this.dialogRef.open(CreeCollectionComponent, {
      width: '900px',
      height: '550px',
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
    this.router.navigateByUrl(`/admin/explore-details/${id}`);
  }

  supprimerCol(id: any) { }

  func_inf_m(id: any) {
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
  }

  func_update_m(p: any){
    this.router.navigateByUrl("/admin/UpdateMode")
  }

  func_delete_m(p: any){

  }

  func_ajout_Model(){
    const dialogRef = this.dialogRef.open(CreeModeleComponent, {
      width: '700px',
      height: '480px',
      data: { is_active : false }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Réagir à la fermeture du dialogue si nécessaire
      // Par exemple, rafraîchir la liste des classes
      this.projetService.func_get_All_models()
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
            this.modele = collections;
          }
        );
    });
  }

  func_ajout_User(){

  }

  func_inf_u(id: any) {

  }

  func_update_u(p: any){

  }

  func_delete_u(p: any){

  }

  sortBy(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.Classes.sort((a, b) => {
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

  goToStep(step: number) {
    this.currentStep = step;
  }
}
