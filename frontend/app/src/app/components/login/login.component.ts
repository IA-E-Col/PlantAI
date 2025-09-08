import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthenticationRequest } from '../../model/authentication-request';
import { AppState } from '../../store/app.state';
import { AuthActions } from '../../store';
import { 
  selectIsLoading, 
  selectAuthError, 
  selectIsAuthenticated 
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginFormGroup!: FormGroup;
  otpCode = '';
  showMfaInput = false;
  
  // NgRx Observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    // Initialize observables
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Clear any previous errors when component loads
    this.store.dispatch(AuthActions.clearError());

    // Listen for authentication success
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/admin');
        }
      });

    // Listen for authentication errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error === 'MFA_REQUIRED') {
          this.showMfaInput = true;
        } else if (error) {
          Swal.fire('Error', error, 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle login form submission - now using NgRx!
   */
  authenticate(): void {
    if (this.loginFormGroup.valid) {
      const { email, password } = this.loginFormGroup.value;
      
      // Dispatch login action - NgRx handles the rest!
      this.store.dispatch(AuthActions.login({ email, password }));
    } else {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
    }
  }

  /**
   * Handle MFA verification - now using NgRx!
   */
  verifyCode(): void {
    if (this.otpCode.trim()) {
      const email = this.loginFormGroup.get('email')?.value;
      
      // Dispatch MFA verification action - NgRx handles the rest!
      this.store.dispatch(AuthActions.verifyMfa({ 
        email, 
        code: this.otpCode 
      }));
    } else {
      Swal.fire('Error', 'Please enter the verification code', 'error');
    }
  }

  /**
   * Clear error messages
   */
  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
