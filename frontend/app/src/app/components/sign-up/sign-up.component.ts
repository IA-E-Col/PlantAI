import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importation nécessaire pour ngModel
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
  imports: [CommonModule, FormsModule, RouterLink], // Ajoutez FormsModule ici
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signupRequest: SignupRequest = {} as SignupRequest;
  authResponse: AuthenticationResponse = {} as AuthenticationResponse;
  message = '';
  otpCode = '';

  constructor(
    private authService: LoginService,
    private router: Router,
    @Inject(UserService) private userService: UserService
  ) {}

  /**
   * Lance le processus d'inscription.
   * Si la réponse est vide, cela signifie qu'un email d'activation a été envoyé.
   * Un message est affiché et l'utilisateur est redirigé vers la page de login après 5 secondes.
   */
  registerUser(): void {
    this.message = '';
    this.authService.register(this.signupRequest).subscribe({
      next: (response) => {
        if (response) {
          this.authResponse = response;
          // Si MFA est activé, l'utilisateur devra vérifier son code OTP via verifyTfa()
        } else {
          console.log(this.signupRequest);
          this.message = 'Account created, please check your mail to activate your account.\nYou will be redirected to the Login page in 5 seconds';
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
   * Vérifie le code OTP (pour la vérification MFA).
   * Si le code est valide, le token d'accès est stocké et l'utilisateur est redirigé vers la page de login après 3 secondes.
   */
  verifyTfa(): void {
    this.message = '';
    const verifyRequest: VerificationRequest = {
      email: this.signupRequest.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest).subscribe({
      next: (response) => {
        this.message = 'Account created successfully.\nYou will be redirected to the Login page in 3 seconds';
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
