import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import { ProjetService } from "../../services/projet.service";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MatDialogRef} from "@angular/material/dialog";
interface Projet {
  nomProjet: any;
  description: any;
}

@Component({
  selector: 'app-newprojet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './newprojet.component.html',
  styleUrl: './newprojet.component.css'
})
export class NewprojetComponent implements OnInit {

  projetFormGroup!: FormGroup
  collections: any[] = [];
  errorMessage!: string;
  collection : any
  constructor(private dialogRef: MatDialogRef<NewprojetComponent>,private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private projetServ: ProjetService) { }
  ngOnInit() {
    this.projetServ.func_get_All_collection()
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

    this.projetFormGroup = this.fb.group({
      nomProjet: this.fb.control(null, [Validators.required]),
      description: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
      collection: this.fb.control(null, [Validators.required]),
    }
    );

  }

  ajout_prt() {
    if (this.projetFormGroup.valid) {
      const projet: Projet = {
        nomProjet: this.projetFormGroup.get('nomProjet')?.value,
        description: this.projetFormGroup.get('description')?.value
      };
      this.collection =this.projetFormGroup.get('collection')?.value
      console.log('Projet:', projet);
      console.log("i m here 1F")
      console.log(projet)
      this.projetServ.func_ajout_proj(projet,this.collection).subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire('Success', 'Project added successfully', 'success').then(() => {
            this.projetFormGroup.reset();
            this.dialogRef.close();
          });
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to add project', 'error');
        }
      });

    } else {
      console.log('Form is not valid');
    }

  }

}
