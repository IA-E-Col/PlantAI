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
  ) {}

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Authentification classique (sans MFA ou avec MFA activé, mais non vérifié).
   */
  authenticate(): void {
    this.authRequest = this.loginFormGroup.value;
    this.authService.login(this.authRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        this.authResponse = response;

        // Stockage commun : image, nom, prénom et état du MFA
        if (this.authResponse.profileImageUrl) {
          localStorage.setItem('profileImageUrl', this.authResponse.profileImageUrl);
          console.log("Profile image URL stored: " + this.authResponse.profileImageUrl);
        }
        if (this.authResponse.nom) {
          localStorage.setItem('nom', this.authResponse.nom);
          console.log("Nom stored: " + this.authResponse.nom);
        }
        if (this.authResponse.prenom) {
          localStorage.setItem('prenom', this.authResponse.prenom);
          console.log("Prenom stored: " + this.authResponse.prenom);
        }
        localStorage.setItem('mfaEnabled', JSON.stringify(this.authResponse.mfaEnabled));

        // Si MFA n'est pas activé, l'utilisateur est connecté immédiatement
        if (!this.authResponse.mfaEnabled) {
          localStorage.setItem('token', this.authResponse.accessToken as string);
          // Stockage de l'ID utilisateur via service
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
        // Sinon, la vérification MFA devra être effectuée par verifyCode()
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
        // Stocker le nouveau token
        localStorage.setItem('token', response.accessToken as string);

        // Stocker l'URL de l'image de profil
        if (response.profileImageUrl) {
          localStorage.setItem('profileImageUrl', response.profileImageUrl);
          console.log("Profile image URL stored: " + response.profileImageUrl);
        }
        // Stocker le nom et le prénom
        if (response.nom) {
          localStorage.setItem('nom', response.nom);
          console.log("Nom stored: " + response.nom);
        }
        if (response.prenom) {
          localStorage.setItem('prenom', response.prenom);
          console.log("Prenom stored: " + response.prenom);
        }

        // Stockage facultatif de l'ID utilisateur
        this.userService.getUserID(this.authRequest.email!).subscribe({
          next: (id: number) => {
            localStorage.setItem('userID', id.toString());
            this.fetchUserDetailsAndNavigate();
          },
          error: (error: any) => {
            console.error('Error getting user ID:', error);
          }
        });
      },
      error: (err: any) => {
        console.error('Invalid verification code', err);
        Swal.fire('Error', 'Invalid verification code', 'error');
      }
    });
  }

  /**
   * Méthode de redirection après authentification réussie.
   */
  fetchUserDetailsAndNavigate(): void {
    this.router.navigateByUrl('/admin/corpus');
  }
}
