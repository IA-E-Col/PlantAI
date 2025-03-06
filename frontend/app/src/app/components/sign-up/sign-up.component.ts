import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationResponse } from '../../model/authentication-response';
import { LoginService } from '../../services/login.service';
import { VerificationRequest } from '../../model/verification-request';
import { UserService } from '../../services/user.service';
import { SignupRequest } from '../../model/signup-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signupRequest: SignupRequest = {} as SignupRequest;
  authResponse: AuthenticationResponse = {} as AuthenticationResponse;
  message = '';
  otpCode = '';
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(
    private authService: LoginService,
    private router: Router,
    @Inject(UserService) private userService: UserService
  ) {}

  /**
   * Gère la sélection d'un fichier et affiche un aperçu + conversion en Base64.
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewImage = reader.result as string; // Aperçu local de l'image
        // Affecter la chaîne Base64 à la propriété image pour l'envoi vers le backend
        this.signupRequest.image = this.previewImage;
      };
    }
  }

  /**
   * Enregistre un nouvel utilisateur (avec ou sans MFA).
   */
  registerUser(): void {
    this.message = '';
    this.authService.register(this.signupRequest).subscribe({
      next: (response) => {
        if (response) {
          this.authResponse = response;
          console.log('authResponse:', this.authResponse);
          // Si MFA est activé, l'utilisateur devra renseigner son code (verifyTfa()).
        } else {
          // Réponse renvoyée avec un body vide (202 Accepted) si MFA n'est pas activé.
          this.message = 'Account created, please check your mail to activate your account. ' +
                         'You will be redirected to the Login page in 5 seconds.';
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 5000);
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.message = 'Failed to create user';
      }
    });
  }

  /**
   * Vérifie le code OTP (MFA).
   */
  verifyTfa(): void {
    this.message = '';
    const verifyRequest: VerificationRequest = {
      email: this.signupRequest.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest).subscribe({
      next: (response) => {
        this.message = 'Account created successfully. Redirecting to login...';
        setTimeout(() => {
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['login']);
        }, 3000);
      },
      error: (err) => {
        console.error('Verification error:', err);
        this.message = 'Invalid verification code';
      }
    });
  }
}
