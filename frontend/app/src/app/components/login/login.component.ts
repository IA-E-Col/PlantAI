import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthenticationRequest } from '../../model/authentication-request';
import { AuthenticationResponse } from '../../model/authentication-response';
import { VerificationRequest } from '../../model/verification-request';

import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;
  authRequest: AuthenticationRequest = {} as AuthenticationRequest;
  authResponse: AuthenticationResponse = {} as AuthenticationResponse;
  otpCode = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Authentification "classique" (sans MFA ou alors MFA activé mais encore inconnu).
   */
  authenticate(): void {
    this.authRequest = this.loginFormGroup.value;
    this.authService.login(this.authRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        this.authResponse = response;
  
        // Si le MFA n'est pas activé, l'utilisateur est déjà logué.
        if (!this.authResponse.mfaEnabled) {
          // Stockage du token
          localStorage.setItem('token', this.authResponse.accessToken as string);
  
          // Stockage de l'URL de l'image de profil (si renvoyée)
          if (this.authResponse.profileImageUrl) {
            localStorage.setItem('profileImageUrl', this.authResponse.profileImageUrl);
            console.log("zebi"+ this.authResponse.profileImageUrl);
          }
  
          // Stockage du nom et du prénom
          if (this.authResponse.nom) {
            localStorage.setItem('nom', this.authResponse.nom);
            console.log("zebi"+ this.authResponse.nom);
          }
          if (this.authResponse.prenom) {
            localStorage.setItem('prenom', this.authResponse.prenom);
          }
  
          // Facultatif : stockage de l'ID utilisateur
          this.userService.getUserID(this.authRequest.email!).subscribe({
            next: (id: number) => {
              localStorage.setItem('userID', id.toString());
              this.fetchUserDetailsAndNavigate();
            },
            error: (error: any) => {
              console.error('Error getting user ID:', error);
            }
          });
        }
        // Sinon, si le MFA est activé, la suite se fera dans verifyCode()
      },
      error: (err: any) => {
        this.errorMessage = 'Email or password incorrect.';
        console.error(err);
        Swal.fire('Error', 'User does not exist', 'error');
      }
    });
  }
  
  
  /**
   * Vérification du code MFA (OTP).
   */
  verifyCode(): void {
    const verifyRequest: VerificationRequest = {
      email: this.authRequest.email,
      code: this.otpCode
    };

    this.authService.verifyCode(verifyRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        // 1) Stocker le nouveau token
        localStorage.setItem('token', response.accessToken as string);

        // 2) Stocker l'URL de l'image de profil (si renvoyée après vérification)
        if (response.profileImageUrl) {
          localStorage.setItem('profileImageUrl', response.profileImageUrl);
        }

        // 3) Redirection
        this.fetchUserDetailsAndNavigate();
      },
      error: (err: any) => {
        console.error('Invalid verification code', err);
        Swal.fire('Error', 'Invalid verification code', 'error');
      }
    });
  }

  /**
   * Exemple de méthode pour la redirection finale
   * après récupération d'infos utilisateur.
   */
  fetchUserDetailsAndNavigate(): void {
    // Naviguer vers la page d'accueil ou dashboard ...
    this.router.navigateByUrl('/admin/corpus');
  }
}
