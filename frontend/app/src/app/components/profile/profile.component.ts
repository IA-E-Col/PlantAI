import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {ProjetService} from "../../services/projet.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  inscrFormGroup!: FormGroup
  profile!: any
  constructor(private fb: FormBuilder, private loginServ: LoginService, private router: Router, private projetService : ProjetService) {
  }

  ngOnInit(): void {
    const userString = localStorage.getItem("authUser");
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.profile = user.user;
    }
    this.inscrFormGroup = this.fb.group({
        username: this.fb.control(this.profile?.username || "", [Validators.required]),
        nom: this.fb.control(this.profile?.nom || "", [Validators.required]),
        prenom: this.fb.control(this.profile?.prenom || "", [Validators.required]),
        email: this.fb.control(this.profile?.email || "", [Validators.required]),
        tel: this.fb.control(this.profile?.tel || "", [Validators.required]),
        departement: this.fb.control(this.profile?.departement || "", [Validators.required]),
        passwordAncien: this.fb.control(null, [Validators.required]),
        passwordNouveauConfirm: this.fb.control(null, [Validators.required]),
        passwordNouveau: this.fb.control(null, [Validators.required]),
      }
    );

  }

  onSubmit() {
    if (this.inscrFormGroup.valid) {
      let user = this.inscrFormGroup.value;
      if((user.passwordNouveau == user.passwordNouveauConfirm) && (user.passwordAncien== this.profile.password) && (user.passwordAncien != user.passwordNouveau)){
          console.log(this.profile);
          this.profile.password = user.passwordNouveau;
          //console.log(this.profile);
          this.projetService.func_modifer_profile(this.profile).subscribe({
            next:(data)=>{
              console.log(data)
              this.router.navigate(['login']);
            },
            error:(err)=>{ alert("Opération non aboutie")       }
          })
      }
      else {
         alert("Les informations fournies sont incorrect")
      }}
    else {
       console.log("Opération non aboutie")
      alert("Le formulaire n'est pas valide !");
    }
  }
}
