import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {ProjetService} from "../../services/projet.service";

@Component({
  selector: 'app-create-collection-modal',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './create-collection-modal.component.html',
  styleUrl: './create-collection-modal.component.css'
})
export class CreateCollectionModalComponent {

  // Variables pour stocker les informations de la collection
  nom: string = '';
  description: string = '';
  id: string = '';

  constructor(private route: ActivatedRoute , private router : Router ,private projetService : ProjetService) { }

  retour(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Méthode pour soumettre les informations de la collection
  soumettreCollection() {
    console.log('Nom de la collection:', this.nom);
    console.log('Description de la collection:', this.description);
    this.projetService.dataset.name = this.nom
    this.projetService.dataset.description = this.description

    console.log(this.projetService.specimens)

    /*const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      let userName = user.user.username;
      console.log(userName)
      this.projetService.collection.createur = userName;
    }*/
    console.log(this.projetService.dataset)
    // Réinitialisez les champs après la soumission
    this.nom = '';
    this.description = '';
    this.id = this.projetService.projet.id;
    // Redirection vers l'URL spécifiée
    console.log(this.projetService.projet.id)
    this.projetService.func_add_Dataset(this.id).subscribe({
      next:(data)=>{
        console.log('rani hna ',data)
        this.projetService.func_add_Specimens_To_Dataset(data.id).subscribe({
          next:(data)=>{
            this.router.navigate([`/admin/projects/${this.projetService.projet.id}/datasets`]);
          }, error:(err)=>{
            console.log(err)
            alert('DATASET non cree')
          }
        })

      },
      error:(err)=>{
        console.log(err)
        alert('collection non cree')
      }
    })

  }

}
