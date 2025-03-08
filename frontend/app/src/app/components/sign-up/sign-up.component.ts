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

  // Pour alimenter la liste déroulante des départements
  public departments: string[] = [
    'Biologie',
    'Botanique',
    'Ecologie',
    'Zoologie',
    'Chimie',
    'Géologie',
    'Microbiologie'
  ];

  signupRequest: SignupRequest = {} as SignupRequest;
  authResponse: AuthenticationResponse = {} as AuthenticationResponse;
  message = '';
  isError: boolean = false; // Indique si le message est une erreur ou un succès
  otpCode = '';
  selectedFile: File | null = null;
  previewImage: string | null = null;
  confirmPassword: string = '';
  isLoading: boolean = false;

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
        this.previewImage = reader.result as string;
        this.signupRequest.image = this.previewImage;
      };
    }
  }

  /**
   * Enregistre un nouvel utilisateur (avec ou sans MFA).
   */
  registerUser(): void {
    this.message = '';
    this.isError = false;
  
    // Vérifie la correspondance des mots de passe
    if (this.signupRequest.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      this.isError = true;
      return;
    }
    
    this.isLoading = true;
  
    this.authService.register(this.signupRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isError = false;
        if (response) {
          this.authResponse = response;
          console.log('authResponse:', this.authResponse);
        } else {
          this.message = 'Compte créé, veuillez vérifier votre e-mail pour activer votre compte. ' +
                         'Vous serez redirigé vers la page de connexion dans 5 secondes.';
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 5000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'inscription:', err);
        this.isError = true;
        if (err.error) {
          this.message = typeof err.error === 'string'
            ? err.error
            : err.error.message || JSON.stringify(err.error);
        } else {
          this.message = 'Un compte avec le même mail existe déjà.';
        }
      }
    });
  }
  
  /**
   * Vérifie le code OTP (MFA).
   */
  verifyTfa() {
    this.message = '';
    this.isError = false;
    this.isLoading = true;
    
    const verifyRequest: VerificationRequest = {
      email: this.signupRequest.email,
      code: this.otpCode
    };
    
    this.authService.verifyCode(verifyRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isError = false;
        this.message = 'Compte créé avec succès. Vous serez redirigé vers la page d\'accueil dans 3 secondes.';
        setTimeout(() => {
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de la vérification:', err);
        this.isError = true;
        this.message = 'Échec de la vérification';
      }
    });
  }
}
