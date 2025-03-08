import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjetService } from '../../services/projet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileFormGroup!: FormGroup;
  profile: any;

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'objet utilisateur stocké dans le localStorage sous "authUser"
    const userString = localStorage.getItem('authUser');
    if (userString) {
      this.profile = JSON.parse(userString);
    } else {
      // Rediriger vers la page de connexion si aucune donnée n'est trouvée
      this.router.navigate(['login']);
      return;
    }

    // Initialiser le formulaire avec les données du profil (les champs de mot de passe restent vides)
    this.profileFormGroup = this.fb.group({
      nom: [this.profile.nom || '', Validators.required],
      prenom: [this.profile.prenom || '', Validators.required],
      email: [this.profile.email || '', [Validators.required, Validators.email]],
      departement: [this.profile.departement || '', Validators.required],
      passwordAncien: [''],
      passwordNouveau: [''],
      passwordNouveauConfirm: ['']
    });
  }

  onSubmitProfile(): void {
    if (this.profileFormGroup.valid) {
      const formValues = this.profileFormGroup.value;
      
      // Si l'utilisateur souhaite modifier son mot de passe, vérifier la cohérence
      if (formValues.passwordAncien || formValues.passwordNouveau || formValues.passwordNouveauConfirm) {
        if (formValues.passwordNouveau !== formValues.passwordNouveauConfirm) {
          Swal.fire({ icon: 'error', title: 'Erreur', text: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' });
          return;
        }
      }
      
      // Construire l'objet profil mis à jour
      const updatedProfile = {
        ...this.profile,
        nom: formValues.nom,
        prenom: formValues.prenom,
        email: formValues.email,
        departement: formValues.departement,
        passwordAncien: formValues.passwordAncien,
        passwordNouveau: formValues.passwordNouveau
      };

      this.projetService.func_modifer_profile(updatedProfile).subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire({ icon: 'success', title: 'Succès', text: 'Profil modifié avec succès. Veuillez vous reconnecter.' })
            .then(() => {
              this.router.navigate(['login']);
            });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Erreur', text: 'Échec de la modification du profil.' });
        }
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Le formulaire n\'est pas valide !' });
    }
  }
}
