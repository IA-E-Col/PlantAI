import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-collaborator',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './add-collaborator.component.html',
  styleUrl: './add-collaborator.component.css'
})
export class AddCollaboratorComponent {
 is_active: boolean = true;
  collectionFormGroup!: FormGroup
  selectedExpertiseId!: number | null;
  file!: File ;
  collaborators : any;
  expertises: any;
  projectId!: number;
  selectedCollaboratorId!: number | null;
  constructor(private dialogRef: MatDialogRef<AddCollaboratorComponent>,private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projetServ: ProjetService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data) {
        this.is_active = data.is_active;
        this.projectId = data.id;
        this.projetServ.func_get_possible_collaborators(this.projectId).subscribe({
          next: (collaborators) => {
            this.collaborators = collaborators;
            console.log("coll",collaborators);
            
          },
          error: (err) => {
            console.error(err);
          }
        });
        this.projetServ.getExpertises().subscribe({
          next: (expertises) => {
            this.expertises = expertises;
            console.log("coll",expertises);
            
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
  }


  addCollaborator(){
    this.projetServ.func_ajout_collab(this.projectId, this.selectedCollaboratorId,this.selectedExpertiseId).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Collaborator added successfully', 'success').then(() => {
          this.dialogRef.close();
        });   
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  goBack(){
    this.selectedCollaboratorId = null;
    this.selectedExpertiseId = null;
    this.dialogRef.close();
  }

}
