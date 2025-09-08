import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, AsyncPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AppState } from '../../store/app.state';
import { AuthActions } from '../../store';
import { 
  selectIsLoading, 
  selectAuthError 
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe
  ],
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit, OnDestroy {

  // UI state
  message = '';
  isOkay = true;
  submitted = false;
  otpCode = '';

  // NgRx Observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    // Subscribe to authentication success/error states
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.message = error;
          this.submitted = true;
          this.isOkay = false;
        }
      });

    // Listen for successful activation (when loading stops and no error)
    this.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        if (!isLoading && this.submitted && !this.message.includes('expired')) {
          // Only if we were previously submitting and no error occurred
          this.error$
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
              if (!error && this.submitted) {
                this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
                this.isOkay = true;
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Verifies the activation code using NgRx
   */
  verifyCode(): void {
    if (!this.otpCode || this.otpCode.length < 6) {
      this.message = 'Please enter a valid 6-digit activation code.';
      this.isOkay = false;
      return;
    }

    this.submitted = true;
    this.message = '';
    
    console.log('Activating account with NgRx:', this.otpCode);
    
    // Dispatch activate account action through NgRx
    this.store.dispatch(AuthActions.activateAccount({ token: this.otpCode }));
  }

  /**
   * Redirects user to login page
   */
  redirectToLogin(): void {
    this.router.navigate(['login']);
  }

  /**
   * Called when activation code is completed (for URL-based activation)
   */
  onCodeCompleted(emailtoken: string): void {
    if (emailtoken) {
      this.otpCode = emailtoken;
      this.verifyCode();
    }
  }

  /**
   * Resets the form to try activation again
   */
  tryAgain(): void {
    this.submitted = false;
    this.message = '';
    this.isOkay = true;
    this.otpCode = '';
    
    // Clear any previous errors
    this.store.dispatch(AuthActions.clearError());
  }
}
