import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { AuthActions } from '../../store';
import { 
  selectUser, 
  selectIsLoading, 
  selectAuthError,
  selectIsAuthenticated 
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  profileFormGroup!: FormGroup;
  
  // NgRx Observables
  user$: Observable<any>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    // Initialize observables from NgRx store
    this.user$ = this.store.select(selectUser);
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Check authentication status first
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
          return;
        }
      });

    // Subscribe to user data from NgRx store
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          console.log('User data from NgRx store:', user);
          this.initializeForm(user);
        }
      });

    // Subscribe to errors and show notifications
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire({ 
            icon: 'error', 
            title: 'Error', 
            text: `Profile error: ${error}` 
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(user: any): void {
    // Initialize form with user data from NgRx store
    this.profileFormGroup = this.fb.group({
      nom: [user.nom || '', Validators.required],
      prenom: [user.prenom || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      departement: [user.departement || '', Validators.required],
      role: [{ value: user.role || '', disabled: true }], // Make role read-only
      passwordAncien: [''],
      passwordNouveau: [''],
      passwordNouveauConfirm: ['']
    });
  }

  onSubmitProfile(): void {
    if (this.profileFormGroup.valid) {
      const formValues = this.profileFormGroup.value;
      
      // Validate password fields if user wants to change password
      if (formValues.passwordAncien || formValues.passwordNouveau || formValues.passwordNouveauConfirm) {
        if (formValues.passwordNouveau !== formValues.passwordNouveauConfirm) {
          Swal.fire({ 
            icon: 'error', 
            title: 'Error', 
            text: 'The new password and confirmation password do not match.' 
          });
          return;
        }
      }
      
      // Get current user from store to merge with form data
      this.user$
        .pipe(takeUntil(this.destroy$))
        .subscribe(currentUser => {
          if (currentUser) {
            const updatedProfile = {
              ...currentUser,
              nom: formValues.nom,
              prenom: formValues.prenom,
              email: formValues.email,
              departement: formValues.departement,
              passwordAncien: formValues.passwordAncien,
              passwordNouveau: formValues.passwordNouveau
              // Note: role is not included as it's read-only and fetched from backend
            };

            console.log('Updating profile with NgRx:', updatedProfile);
            
            // Dispatch update user action through NgRx
            this.store.dispatch(AuthActions.updateProfile({ profile: updatedProfile }));

            // Subscribe to success/error states
            this.isLoading$
              .pipe(takeUntil(this.destroy$))
              .subscribe(isLoading => {
                if (!isLoading) {
                  // Check if update was successful
                  this.error$
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(error => {
                      if (!error) {
                        Swal.fire({ 
                          icon: 'success', 
                          title: 'Success', 
                          text: 'Profile updated successfully. Please log in again.' 
                        }).then(() => {
                          this.store.dispatch(AuthActions.logout());
                          this.router.navigate(['/login']);
                        });
                      }
                    });
                }
              });
          }
        });
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: 'The form is invalid. Please check all required fields.' 
      });
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileFormGroup.controls).forEach(key => {
      const control = this.profileFormGroup.get(key);
      control?.markAsTouched();
    });
  }
}
