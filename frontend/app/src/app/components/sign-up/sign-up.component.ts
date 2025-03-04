<<<<<<< HEAD
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router, RouterLink} from "@angular/router";
=======
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginService } from "../../services/login.service";
import { Router, RouterLink } from "@angular/router";
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  inscrFormGroup!: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private loginServ: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.inscrFormGroup = this.fb.group({
      username: this.fb.control("test", [Validators.required]),
      nom: this.fb.control(null, [Validators.required]),
      prenom: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required]),
      tel: null,
      departement: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      password1: this.fb.control(null, [Validators.required])
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }

  inscr() {
    let user = this.inscrFormGroup.value;
    
    if (user.password !== user.password1) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    delete user.password1;

    this.loginServ.inscr(user).subscribe({
      next: (data) => {
        console.log("✅ User Created Response:", data);

        if (data && data.id && this.selectedFile) {
          // On envoie l'image mais on ignore les erreurs
          this.loginServ.uploadImage(data.id, this.selectedFile).subscribe({
            next: () => console.log("✅ Image uploaded successfully"),
            error: () => console.warn("⚠️ Image upload failed, but user is created") // Plus d'affichage d'erreur
          });
        }

        // Message de succès UNIQUEMENT pour la création du user
        Swal.fire('Success', 'User created successfully!', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to create user', 'error');
      }
    });
  }
}
