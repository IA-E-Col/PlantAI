import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {ProjetService} from "../../services/projet.service";
import Swal from "sweetalert2";
import {CreeModeleComponent} from "../cree-modele/cree-modele.component";
import {catchError, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-modele',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    RouterLink,
    RouterOutlet,
    FormsModule
  ],
  templateUrl: './modele.component.html',
  styleUrl: './modele.component.css'
})
export class ModeleComponent implements OnInit{
  modele! : Array<any>
  p: number = 1;
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext:any;
  selectedOption: string = "all";
  private errorMessage!: string;

  constructor(private dialogRef: MatDialog,private route: ActivatedRoute , private router : Router ,private projetService : ProjetService ) { }

  ngOnInit() {
  this.projetService.func_get_All_models().subscribe({
    next: (data) => {
      this.modele=data;
      console.log("model",data)
      },

    error: (err) => {
      Swal.fire('Error', 'Failed to load models', 'error');
      console.error(err);
    }
  });
  }

  ngAfterViewInit() {
    document.querySelectorAll(".read-more").forEach(button => {
      button.addEventListener("click", (e: Event) => {
        e.preventDefault(); // Empêche la redirection par défaut
        const card = (button as HTMLElement).closest(".card");
        if (card) {
          card.classList.add("is-flipped");
        }
      });
    });

    document.querySelectorAll(".go-back").forEach(button => {
      button.addEventListener("click", (e: Event) => {
        e.preventDefault(); // Empêche la redirection par défaut
        const card = (button as HTMLElement).closest(".card");
        if (card) {
          card.classList.remove("is-flipped");
        }
      });
    });
  }

  func_inf_m(id: any) {
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
  }

  sortBy(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.modele.sort((a, b) => {
      let comparison = 0;
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        comparison = a[field].localeCompare(b[field]);
      } else {
        comparison = a[field] - b[field];
      }
      return this.isAscending ? comparison : -comparison;
    });
  }

  applyFilter(){

  }

 // func_ajout_Model(){
 //   this.router.navigateByUrl("/admin/NewModel")
 // }
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
  func_update_m(p: any){
    this.router.navigateByUrl("/admin/UpdateMode")
  }

  func_delete_m(p: any){

  }
}
