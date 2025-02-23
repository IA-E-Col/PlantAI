import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProjetService } from "../../services/projet.service";
import { NgIf, NgForOf } from "@angular/common";
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from "../../filter.pipe";



@Component({
  selector: 'app-gererprojet',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    FilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './gererprojet.component.html',
  styleUrl: './gererprojet.component.css'
})
export class GererprojetComponent implements OnInit {

  p: number = 1;
  cheminPlus = "assets/plus.png";
  cheminDel = "assets/delet.png";
  cheminUser = "assets/user.png";
  projetFormGroup!: FormGroup
  projectId!: string
  projet!: any
  message_err!: string
  afficherLeFormulaire: boolean = true;
  collaborateurs!: any

  afficherFormulaire(afficher: boolean): void {
    this.afficherLeFormulaire = afficher;
  }
  
  constructor(private fb: FormBuilder, private projetService: ProjetService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.projectId = params['id'];
      this.projetService.func_get_Id(this.projectId).subscribe({
        next: (data) => {
          this.projet = data;
          this.projetFormGroup = this.fb.group({
            nomProjet: this.fb.control(this.projet?.nomProjet || '', [Validators.required]),
            description: this.fb.control(this.projet?.description || '', [Validators.required, Validators.minLength(3)]),
            etat: this.fb.control(this.projet?.etat || ''),
            collaborateurs: this.projetService.func_get_collab(this.projectId).subscribe({
              next: (data) => { this.collaborateurs = data },
              error: (err) => { console.log(err) }
            })
          });
        },
        error: (err) => {
          this.message_err = err
        }
      })
    });
  }

  modifier_prt() {
    let projet = this.projetFormGroup.value;

    // Affichage de l'alerte de confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to modify this project. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, modify project',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("test this.projet", this.projet)
        console.log("test projet", projet)
        // Si l'utilisateur confirme, procédez à la modification du projet
        this.projetService.func_modif_proj(this.projet, projet, this.projectId).subscribe({
          next: (data) => {
            console.log("test this.projet 1", this.projet)
            console.log("test projet 1", projet)
            Swal.fire('Success', 'Project modified successfully', 'success').then(() => {
              console.log(data);
              this.router.navigateByUrl(`/admin/projects/${this.projectId}/details`);
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to modify project', 'error');
            console.error(err);
          }
        });
      }
    });
  }


  ajouterCollaborateur() {
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/collaborators`);
  }

  supprimerCollaborateur() {
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/supprcollab/${this.projectId}`);
  }

  func_suppr_collab(username: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to remove this collaborator. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove collaborator',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmed, proceed with deletion
        this.projetService.func_suppr_collab(this.projectId, username).subscribe({
          next: (data) => {
            Swal.fire('Success', 'Collaborator removed successfully', 'success').then(() => {
              this.router.navigateByUrl(`/admin/projects/${this.projectId}/details`);
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to remove collaborator', 'error');
            console.error(err);
          }
        });
      }
    });
  }

}

