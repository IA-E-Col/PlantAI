import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']  // Remarquez le "s" ici
})
export class ProfileComponent implements OnInit {

  inscrFormGroup!: FormGroup;
  profile: any;

  constructor(
    private fb: FormBuilder,
    private loginServ: LoginService,
    private router: Router,
    private projetService: ProjetService
  ) {}

  ngOnInit(): void {
    // Récupérer l'objet utilisateur depuis localStorage.
    // Vérifiez que la clé "authUser" correspond à votre implémentation.
    const userString = localStorage.getItem("authUser");
    if (userString) {
      const user = JSON.parse(userString);
      // Selon la structure, l'objet utilisateur peut être stocké directement ou dans "user.user"
      this.profile = user.user ? user.user : user;
    }

    // Initialisation du formulaire avec les valeurs du profil (si disponibles)
    this.inscrFormGroup = this.fb.group({
      username: this.fb.control(this.profile?.username || "", [Validators.required]),
      nom: this.fb.control(this.profile?.nom || "", [Validators.required]),
      prenom: this.fb.control(this.profile?.prenom || "", [Validators.required]),
      email: this.fb.control(this.profile?.email || "", [Validators.required, Validators.email]),
      tel: this.fb.control(this.profile?.tel || "", [Validators.required]),
      departement: this.fb.control(this.profile?.departement || "", [Validators.required]),
      passwordAncien: this.fb.control(null, [Validators.required]),
      passwordNouveauConfirm: this.fb.control(null, [Validators.required]),
      passwordNouveau: this.fb.control(null, [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.inscrFormGroup.valid) {
      const user = this.inscrFormGroup.value;
      // Vérifier que l'ancien mot de passe est correct, que le nouveau est confirmé et différent de l'ancien
      if (
        user.passwordNouveau === user.passwordNouveauConfirm &&
        user.passwordAncien === this.profile.password &&
        user.passwordAncien !== user.passwordNouveau
      ) {
        // Mise à jour du mot de passe dans l'objet profile
        this.profile.password = user.passwordNouveau;
        // Appeler le service de modification du profil
        this.projetService.func_modifer_profile(this.profile).subscribe({
          next: (data) => {
            console.log(data);
            // Après modification, rediriger vers la page login (ou une autre page de votre choix)
            this.router.navigate(['login']);
          },
          error: (err) => {
            alert("Opération non aboutie");
          }
        });
      } else {
        alert("Les informations fournies sont incorrectes");
      }
    } else {
      console.log("Opération non aboutie");
      alert("Le formulaire n'est pas valide !");
    }
  }
}
