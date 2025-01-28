import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import { ProjetService } from "../../services/projet.service";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-cree-collection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './cree-collection.component.html',
  styleUrl: './cree-collection.component.css'
})
export class CreeCollectionComponent {

  is_active: boolean = true;
  collectionFormGroup!: FormGroup
  file!: File ;

  constructor(private dialogRef: MatDialogRef<CreeCollectionComponent>,private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projetServ: ProjetService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data) {
        this.is_active = data.is_active;
      }
  }

  ngOnInit() {
    this.collectionFormGroup = this.fb.group({
      nomCollection: ['', Validators.required],
      collectionFile: ['', Validators.required],
      description: ['', Validators.required],
    }
    );
  }

  ajout_col() {
    if (this.collectionFormGroup.valid) {
      const formData = new FormData();
      formData.append('nom', this.collectionFormGroup.get('nomCollection')!.value);
      //formData.append('collectionFile', (this.collectionFormGroup.get('collectionFile')!.value as File));
      formData.append('Description', (this.collectionFormGroup.get('description')!.value));
      formData.append('DateCreation', '');

      this.projetServ.func_add_collection(formData).subscribe({
        next: (data) => {
          console.log('appel ajouut_col')
          console.log(data)

          this.projetServ.importCsv(this.file,data.id).subscribe({
               next:(data)=>{
               if (data=="1")  {this.dialogRef.close();}
               else {alert("erreur d'importation de csv")}
                 },
            error:err=>{
                 alert("erreur d'importation de csv")
               }
            })
        },
        error: err => {
          alert("erreur ajout collection");
        }
      })

    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }
}
