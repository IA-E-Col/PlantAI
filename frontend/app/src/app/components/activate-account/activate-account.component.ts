import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service'; // Corrigé "serives" en "services"
import { skipUntil } from 'rxjs';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VerificationRequest } from '../../model/verification-request';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {

  // Message à afficher à l'utilisateur
  message = '';
  // Indique si l'opération s'est déroulée correctement
  isOkay = true;
  // Indique si l'opération a été soumise (pour afficher un feedback)
  submitted = false;
  // Stocke le code OTP saisi par l'utilisateur
  otpCode = '';

  constructor(
    private router: Router,
    private authService: LoginService
  ) {}

  /**
   * Vérifie le code OTP saisi par l'utilisateur.
   */
  verifyCode() {
    // Appelle la méthode confirm du service d'authentification avec le code OTP
    this.authService.confirm(this.otpCode).subscribe({
      next: () => {
        // Si la confirmation est réussie, affiche un message de succès
        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted = true;
        this.isOkay = true;
      },
      error: () => {
        // En cas d'erreur (token expiré ou invalide), affiche un message d'erreur
        this.message = 'Token has been expired or invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  /**
   * Méthode privée pour confirmer le compte en utilisant un token.
   * @param token Le token d'activation à vérifier.
   */
  private confirmAccount(token: string) {
    this.authService.confirm(token).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted = true;
      },
      error: () => {
        this.message = 'Token has been expired or invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  /**
   * Redirige l'utilisateur vers la page de connexion.
   */
  redirectToLogin() {
    this.router.navigate(['login']);
  }

  /**
   * Méthode appelée lorsque le code d'activation est complété.
   * @param emailtoken Le token d'activation reçu (par exemple depuis l'URL ou un input).
   */
  onCodeCompleted(emailtoken: string) {
    this.confirmAccount(emailtoken);
  }

  // Expose la fonction skipUntil (utilisée éventuellement dans le template)
  protected readonly skipUntil = skipUntil;
}
