import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { ProjetService } from "../../services/projet.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-ajouter-collab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxPaginationModule
  ],
  templateUrl: './ajouter-collab.component.html',
  styleUrls: ['./ajouter-collab.component.css']
})
export class AjouterCollabComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  p: number = 1;
  searchtext:any;
  faCircleInfo = faCircleInfo;
  projetFormGroup!: FormGroup;
  projectId!: string;
  errorMessage!: string;
  users: any[] = []; // Liste des utilisateurs

  constructor(private dialogRef: MatDialog, private fb: FormBuilder, private projetServ: ProjetService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.projectId = params['id'];
      this.projetServ.func_get_collab(this.projectId).subscribe({
        next: (users) => {
          this.users = users;
          console.log(users);
          
        },
        error: (err) => {
          console.error(err);
        }
      });
  
      this.projetFormGroup = this.fb.group({
        collaborateur: [null, Validators.required],
        role: ["null", Validators.required],
      });
    });
  }


  modifer_infomation() {
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/edit`);
  }

  delete_collaborator(collaboratorId : number): void{
    Swal.fire({
          title: 'Are you sure?',
          text: 'You are about to remove this collaborator. This action cannot be undone.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#86A786',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete collaborator',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.projetServ.func_suppr_collab(this.projectId,collaboratorId)
            .pipe(
              catchError(error => {
                this.errorMessage = 'An error occurred while deleting the collaborator';
                console.error('Error deleting the collaborator', error);
                return of([]);
              })
            )
            .subscribe(
              (res) => {
                this.users = this.users.filter(user => user.id != collaboratorId);
              }
            );
          }
        });

  }
  add_collaborator(){
    console.log("OPEN")
        const dialogRef = this.dialogRef.open(AddCollaboratorComponent, {
          width: '700px',
          height: '380px',
          data: { is_active : false, id : this.projectId }
        });
         dialogRef.afterClosed().subscribe(result => {
              this.projetServ.func_get_collab(this.projectId)
                .pipe(
                  catchError(error => {
                    this.errorMessage = 'An error occurred while fetching users';
                    console.error('Error fetching users', error);
                    return of([]);
                  })
                )
                .subscribe(
                  (users) => {
                    this.users = users;
                  }
                );
            });
  }
}
