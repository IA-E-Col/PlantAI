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
  'Biology',
  'Botany',
  'Ecology',
  'Zoology',
  'Chemistry',
  'Geology',
  'Microbiology'
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
     this.selectedFile = event.target.files[0];
  }

  /**
   * Enregistre un nouvel utilisateur (avec ou sans MFA).
   */
  registerUser(): void {
    this.message = '';
    this.isError = false;
  
    // Vérifie la correspondance des mots de passe
    if (this.signupRequest.password !== this.confirmPassword) {
      this.message = 'The passwords do not match.';
      this.isError = true;
      return;
    }
    
    this.isLoading = true;
    const formData : FormData = new FormData();
    if (this.selectedFile)
      formData.append('file',this.selectedFile);
    Object.entries(this.signupRequest).forEach(([key, value]) => {
      formData.append(key,value);
    });
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isError = false;
        if (response) {
          this.authResponse = response;
          console.log('authResponse:', this.authResponse);
        } else {
          this.message = "Account created, please check your email to activate your account. You will be redirected to the login page in 5 seconds";
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 5000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error in sign up :', err);
        this.isError = true;
        if (err.error) {
          this.message = typeof err.error === 'string'
            ? err.error
            : err.error.message || JSON.stringify(err.error);
        } else {
          this.message = 'An account with this email already exists';
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
        this.message = 'Account successfully created. You will be redirected to the home page in 3 seconds.';
        setTimeout(() => {
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error during verification:', err);
        this.isError = true;
        this.message = 'Verification failed';
      }
    });
  }
}
