import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Ajoutez FormsModule ici
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

  authenticate() {
    this.authRequest = this.loginFormGroup.value;
    this.authService.login(this.authRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        this.authResponse = response;
        if (!this.authResponse.mfaEnabled) {
          localStorage.setItem('token', response.accessToken as string);
          // Utilisation de l'opérateur "!" pour affirmer que l'email n'est pas undefined
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
      },
      error: (err: any) => {
        this.errorMessage = 'Email or password incorrect.';
        console.error(err);
        Swal.fire('Error', 'User does not exist', 'error');
      }
    });
  }
  
  verifyCode() {
    const verifyRequest: VerificationRequest = {
      email: this.authRequest.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest).subscribe({
      next: (response: AuthenticationResponse) => {
        localStorage.setItem('token', response.accessToken as string);
        this.fetchUserDetailsAndNavigate();
      },
      error: (err: any) => {
        console.error('Invalid verification code', err);
        Swal.fire('Error', 'Invalid verification code', 'error');
      }
    });
  }

  fetchUserDetailsAndNavigate() {
    this.router.navigateByUrl('/admin/corpus');
  }
}
