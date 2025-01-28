import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjetService } from "../../services/projet.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ajouter-collab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ajouter-collab.component.html',
  styleUrls: ['./ajouter-collab.component.css']
})
export class AjouterCollabComponent implements OnInit {

  projetFormGroup!: FormGroup;
  projectId!: string;
  users: any[] = []; // Liste des utilisateurs

  constructor(private fb: FormBuilder, private projetServ: ProjetService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.projetServ.func_get_users().subscribe({
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
  }

  ajouter_collab() {
    let collab = this.projetFormGroup.value;
    console.log("test", collab);
    
    this.projetServ.func_ajout_collab(this.projectId, collab.collaborateur).subscribe({
      next: (data) => {
        console.log(data)
        Swal.fire('Success', 'Collaborator added successfully', 'success').then(() => {
          this.router.navigateByUrl(`/admin/projbar/${this.projectId}/projetInf/${this.projectId}`);
        });
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to add collaborator', 'error');
        console.error(err);
      }
    });
  }

  modifer_infomation() {
    this.router.navigateByUrl(`/admin/projbar/${this.projectId}/gererprojet/${this.projectId}`);
  }
}
