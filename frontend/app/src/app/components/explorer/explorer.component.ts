import { Component } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service"; // Import ProjetService
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
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http'; // Add this import

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
  
  constructor(
    private dialogRef: MatDialog,
    private projetService: ProjetService, // Use ProjetService
    private router: Router,
    private sharedServiceService: SharedServiceService
  ) { }

  ngOnInit(): void {
    this.projetService.func_get_All_collection()
      .pipe(
        catchError(error => {
          this.errorMessage = 'An error occurred while fetching collections';
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
  }

  func_ajout_Col() {
    const dialogRefa = this.dialogRef.open(CreeCollectionComponent, {
      width: '700px',
      height: '500px',
      data: { is_active : false }
    });
    dialogRefa.afterClosed().subscribe(result => {
      this.projetService.func_get_All_collection()
        .pipe(
          catchError(error => {
            this.errorMessage = 'An error occurred while fetching collections';
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

  supprimerCol(id: any) { 
    console.log("hello delete collection");
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this collection. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete collection',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Use ProjetService to delete the collection
        this.projetService.func_delete_collection(id).subscribe({
          next: () => {
            Swal.fire('Success', 'Collection deleted successfully', 'success').then(() => {
            });
            this.ngOnInit(); // Refresh the list after deletion
          },
          error: (err: HttpErrorResponse) => { // Add explicit type for `err`
            Swal.fire('Error', 'Failed to delete collection', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  ouvrirCol(id: any) {
    this.sharedServiceService.setCorpusId(id);
    this.router.navigateByUrl(`/admin/corpus/${id}/edit`);
  }

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