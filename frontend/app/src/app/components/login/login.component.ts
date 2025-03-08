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
   * Enregistre dans le localStorage toutes les infos de l'utilisateur, sauf le mot de passe.
   */
  authenticate(): void {
    this.authRequest = this.loginFormGroup.value;
    this.authService.login(this.authRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        this.authResponse = response;

        // Créer un objet profil sans le mot de passe
        const userProfile = {
          nom: response.nom,
          prenom: response.prenom,
          email: response.email,
          departement: response.departement,
          profileImageUrl: response.profileImageUrl,
          mfaEnabled: response.mfaEnabled
        };

        // Stocker l'objet profil dans le localStorage sous "authUser"
        localStorage.setItem('authUser', JSON.stringify(userProfile));
        localStorage.setItem('mfaEnabled', JSON.stringify(response.mfaEnabled));

        // Si MFA n'est pas activé, stocker le token et récupérer l'ID utilisateur
        if (!response.mfaEnabled) {
          localStorage.setItem('token', response.accessToken as string);
          this.userService.getUserID(this.authRequest.email!).subscribe({
            next: (id: number) => {
              // Mettre à jour l'objet authUser avec l'ID utilisateur
              const storedUser = JSON.parse(localStorage.getItem('authUser') || '{}');
              storedUser.id = id;
              localStorage.setItem('authUser', JSON.stringify(storedUser));
              this.fetchUserDetailsAndNavigate();
            },
            error: (error: any) => {
              console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
            }
          });
        }
        // En cas de MFA activé, l'utilisateur devra passer par verifyCode()
      },
      error: (err: any) => {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        console.error(err);
        Swal.fire('Erreur', 'L\'utilisateur n\'existe pas', 'error');
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
        // Mettre à jour le token
        localStorage.setItem('token', response.accessToken as string);

        // Mettre à jour l'objet authUser avec les informations de la réponse
        const userProfile = {
          nom: response.nom,
          prenom: response.prenom,
          email: response.email,
          departement: response.departement,
          profileImageUrl: response.profileImageUrl,
          mfaEnabled: response.mfaEnabled
        };
        localStorage.setItem('authUser', JSON.stringify(userProfile));

        // Récupérer l'ID utilisateur et l'ajouter à l'objet authUser
        this.userService.getUserID(this.authRequest.email!).subscribe({
          next: (id: number) => {
            const storedUser = JSON.parse(localStorage.getItem('authUser') || '{}');
            storedUser.id = id;
            localStorage.setItem('authUser', JSON.stringify(storedUser));
            this.fetchUserDetailsAndNavigate();
          },
          error: (error: any) => {
            console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
          }
        });
      },
      error: (err: any) => {
        console.error('Code de vérification invalide', err);
        Swal.fire('Erreur', 'Code de vérification invalide', 'error');
      }
    });
  }

  /**
   * Redirige l'utilisateur après une authentification réussie.
   */
  fetchUserDetailsAndNavigate(): void {
    this.router.navigateByUrl('/admin/corpus');
  }
}
