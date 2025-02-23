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
  selector: 'app-gerer-dataset',
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
  templateUrl: './gerer-dataset.component.html',
  styleUrl: './gerer-dataset.component.css'
})
export class GererDatasetComponent {

  afficherLeFormulaire: boolean = true;
  IdDataset!: any;
  DatasetNam!: any;
  DatasetDescription!: any;
  errorMessage!: string;
  private routeSub!: Subscription;
  datasetFormGroup!: FormGroup;

  constructor(private fb: FormBuilder, private projetService: ProjetService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.datasetFormGroup = this.fb.group({
      nomDataset: this.fb.control(this.DatasetNam || '', [Validators.required]),
      description: this.fb.control(this.DatasetDescription || '', [Validators.required, Validators.minLength(3)]),
    });
     this.route.parent?.params.subscribe(params => {
      this.IdDataset = params['id'];
      console.log("ID DATASET",this.IdDataset)
      this.projetService.func_get_dataset(this.IdDataset).subscribe({
        next: dataset => {
          console.log("DATASET RES", dataset)
          this.datasetFormGroup.patchValue({
            nomDataset: dataset.name,
            description: dataset.description
          });
          
        },
        error: (err) => {
          console.error(err);
        }
      })
    });



  }

  afficherFormulaire(afficher: boolean): void {
    this.afficherLeFormulaire = afficher;
  }

  modifier_prt() {
    let projet = this.datasetFormGroup.value;

    // Affichage de l'alerte de confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to modify this dataset. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, modify dataset',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procédez à la modification du Dataset
        /*
        this.projetService.func_modif_collection(this.dataset, this.IdDataset).subscribe({
          next: (data) => {
            Swal.fire('Success', 'dataset modified successfully', 'success').then(() => {
              this.router.navigateByUrl(`/admin/corpus/${this.IdDataset}/;
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to modify dataset', 'error');
            console.error(err);
          }
        });
        */
      }
    });
  }


}
