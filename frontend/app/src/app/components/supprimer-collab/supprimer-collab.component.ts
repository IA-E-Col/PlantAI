import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProjetService} from "../../services/projet.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-supprimer-collab',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './supprimer-collab.component.html',
  styleUrl: './supprimer-collab.component.css'
})
export class SupprimerCollabComponent {



  projetFormGroup! : FormGroup
  projectId! : string
  test! : string
  constructor(private  fb: FormBuilder, private projetServ : ProjetService,private route: ActivatedRoute,private router : Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      this.test = this.projetServ.projets.find(projet => projet.id === this.projectId);
    });
    this.projetFormGroup = this.fb.group({
        collaborateur : this.fb.control( null, [Validators.required]),
      }
    );
  }



  func_suppr_collab(){
    let collab = this.projetFormGroup.value
    this.projetServ.func_suppr_collab(this.projectId,collab.collaborateur).subscribe({
      next:(data)=>{this.router.navigateByUrl(`/admin/projects/${this.projectId}/details`);},
      error:(err)=>{console.log(err)}
    })
  }

  modifer_infomation() {
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/edit`);
  }

  ajouterCollaborateur() {
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/collaborators`);
  }
}
