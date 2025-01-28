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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-gerer-collection',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './gerer-collection.component.html',
  styleUrl: './gerer-collection.component.css'
})
export class GererCollectionComponent {

  afficherLeFormulaire: boolean = true;
  collectionId: any;
  collection: any;
  errorMessage!: string;
  private routeSub!: Subscription;
  collectionFormGroup!: FormGroup;

  constructor(private fb: FormBuilder, private projetService: ProjetService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('Id');
      console.log('Collection ID:', this.collectionId);  // Debugging purpose
    });

    this.projetService.func_get_collection_by_id(this.collectionId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'An error occurred while fetching collection';
          // Optionally, you can log the error or handle it as needed
          console.error('Error fetching collection', error);
          return of([]);
        })
      )
      .subscribe(
        (collection) => {
          console.log(collection)
          this.collection = collection;
          this.collectionFormGroup = this.fb.group({
            nomCollection: this.fb.control(this.collection?.nom || '', [Validators.required]),
            description: this.fb.control(this.collection?.description || '', [Validators.required, Validators.minLength(3)]),
          });
        }
      );
  }

  afficherFormulaire(afficher: boolean): void {
    this.afficherLeFormulaire = afficher;
  }

  modifier_prt() {
    let projet = this.collectionFormGroup.value;

    // Affichage de l'alerte de confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to modify this collection. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, modify collection',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procédez à la modification du projet
        /*
        this.projetService.func_modif_collection(this.collection, this.collectionId).subscribe({
          next: (data) => {
            Swal.fire('Success', 'collection modified successfully', 'success').then(() => {
              this.router.navigateByUrl(`/admin/explore-details/${this.collectionId}/collectionInf/${this.collectionId}`);
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to modify collection', 'error');
            console.error(err);
          }
        });
        */
      }
    });
  }


}
