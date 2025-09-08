import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  
  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.loginService.login({ email, password }).pipe(
          switchMap((response) => {
            if (!response.mfaEnabled) {
              // Store token and get user ID
              localStorage.setItem('token', response.accessToken as string);
              
              return this.userService.getUserID(email).pipe(
                map((id: number) => {
                  const user = {
                    id,
                    nom: response.nom || '',
                    prenom: response.prenom || '',
                    email: response.email || '',
                    departement: response.departement || '',
                    role: response.role as any || null,
                    profileImageUrl: response.profileImageUrl,
                    mfaEnabled: response.mfaEnabled || false,
                    enabled: response.enabled || true
                  };
                  
                  // Store user data
                  localStorage.setItem('authUser', JSON.stringify(user));
                  
                  return AuthActions.loginSuccess({ 
                    user, 
                    token: response.accessToken as string 
                  });
                }),
                catchError((error) => of(AuthActions.loginFailure({ 
                  error: 'Failed to get user information' 
                })))
              );
            } else {
              // MFA required - don't complete login yet
              return of(AuthActions.loginFailure({ 
                error: 'MFA_REQUIRED' 
              }));
            }
          }),
          catchError((error) => of(AuthActions.loginFailure({ 
            error: 'Incorrect email or password' 
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        this.router.navigate(['/admin']);
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        localStorage.removeItem('mfaEnabled');
        this.router.navigate(['/login']);
      })
    ), { dispatch: false }
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      switchMap(action => 
        // For now, we'll create a simple HTTP call directly
        // Later we can create a dedicated UserService method
        this.http.put<any>('http://localhost:8080/api/users/profile', action.profile).pipe(
          map(updatedUser => {
            // Update localStorage with new user data
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            return AuthActions.updateProfileSuccess({ user: updatedUser });
          }),
          catchError(error => of(AuthActions.updateProfileFailure({ 
            error: error.message || 'Failed to update profile' 
          })))
        )
      )
    )
  );

  activateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.activateAccount),
      switchMap(action => 
        this.loginService.confirm(action.token).pipe(
          map(() => AuthActions.activateAccountSuccess({ 
            message: 'Your account has been successfully activated. Now you can proceed to login' 
          })),
          catchError(error => of(AuthActions.activateAccountFailure({ 
            error: 'Token has been expired or invalid' 
          })))
        )
      )
    )
  );

  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      map(() => {
        const userString = localStorage.getItem('authUser');
        const token = localStorage.getItem('token');
        
        if (userString && token) {
          const user = JSON.parse(userString);
          return AuthActions.loginSuccess({ user, token });
        }
        
        return AuthActions.logout();
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ formData }) =>
        this.loginService.register(formData).pipe(
          map(() => AuthActions.registerSuccess({ 
            message: 'Account created successfully' 
          })),
          catchError((error) => of(AuthActions.registerFailure({ 
            error: error.message || 'Registration failed' 
          })))
        )
      )
    )
  );

  verifyMfa$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyMfa),
      switchMap(({ email, code }) =>
        this.loginService.verifyCode({ email, code }).pipe(
          switchMap((response) => {
            localStorage.setItem('token', response.accessToken as string);
            
            return this.userService.getUserID(email).pipe(
              map((id: number) => {
                const user = {
                  id,
                  nom: response.nom || '',
                  prenom: response.prenom || '',
                  email: response.email || '',
                  departement: response.departement || '',
                  role: response.role as any || null,
                  profileImageUrl: response.profileImageUrl,
                  mfaEnabled: response.mfaEnabled || false,
                  enabled: response.enabled || true
                };
                
                localStorage.setItem('authUser', JSON.stringify(user));
                
                return AuthActions.verifyMfaSuccess({ 
                  user, 
                  token: response.accessToken as string 
                });
              })
            );
          }),
          catchError((error) => of(AuthActions.verifyMfaFailure({ 
            error: 'Invalid verification code' 
          })))
        )
      )
    )
  );
}
