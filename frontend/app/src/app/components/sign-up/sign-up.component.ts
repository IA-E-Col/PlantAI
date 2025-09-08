import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AppState } from '../../store/app.state';
import { AuthActions } from '../../store';
import { 
  selectIsLoading, 
  selectAuthError,
  selectAuthResponse,
  selectMfaEnabled 
} from '../../store/auth/auth.selectors';
import { AuthenticationResponse } from '../../model/authentication-response';
import { VerificationRequest } from '../../model/verification-request';
import { SignupRequest } from '../../model/signup-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AsyncPipe],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  // Department options
  public departments: string[] = [
    'Biology',
    'Botany',
    'Ecology',
    'Zoology',
    'Chemistry',
    'Geology',
    'Microbiology'
  ];

  // Form data
  signupRequest: SignupRequest = {} as SignupRequest;
  otpCode = '';
  selectedFile: File | null = null;
  previewImage: string | null = null;
  confirmPassword: string = '';
  
  // UI state
  message = '';
  isError: boolean = false;

  // NgRx Observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  authResponse$: Observable<AuthenticationResponse | null>;
  mfaEnabled$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    // Initialize observables from NgRx store
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
    this.authResponse$ = this.store.select(selectAuthResponse);
    this.mfaEnabled$ = this.store.select(selectMfaEnabled);
  }

  ngOnInit(): void {
    // Subscribe to error state and display messages
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.message = error;
          this.isError = true;
        }
      });
    
    // Subscribe to auth response for registration success
    this.authResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response && !response.mfaEnabled) {
          this.message = "Account created, please check your email to activate your account. You will be redirected to the login page in 5 seconds";
          this.isError = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 5000);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles file selection and preview
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  /**
   * Registers a new user using NgRx
   */
  registerUser(): void {
    this.message = '';
    this.isError = false;
  
    // Validate password confirmation
    if (this.signupRequest.password !== this.confirmPassword) {
      this.message = 'The passwords do not match.';
      this.isError = true;
      return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    
    // Append all signup request fields
    Object.entries(this.signupRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    console.log('Registering user with NgRx:', this.signupRequest);
    
    // Dispatch register action through NgRx
    this.store.dispatch(AuthActions.register({ formData }));
  }
  
  /**
   * Verifies MFA code using NgRx
   */
  verifyTfa(): void {
    this.message = '';
    this.isError = false;
    
    const verifyRequest: VerificationRequest = {
      email: this.signupRequest.email,
      code: this.otpCode
    };
    
    console.log('Verifying MFA with NgRx:', verifyRequest);
    
    // Validate required fields
    if (!verifyRequest.email || !verifyRequest.code) {
      this.message = 'Email and verification code are required.';
      this.isError = true;
      return;
    }
    
    // Dispatch verify MFA action through NgRx
    this.store.dispatch(AuthActions.verifyMfa({ 
      email: verifyRequest.email, 
      code: verifyRequest.code 
    }));
    
    // Handle successful verification
    this.authResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response && response.accessToken && !this.isError) {
          this.message = 'Account successfully created. You will be redirected to the login page in 3 seconds.';
          this.isError = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        }
      });
  }
}
