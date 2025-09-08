import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authResponse: null
};

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, () => initialAuthState),

  // Load from storage
  on(AuthActions.loadUserFromStorage, (state, { user, token }: any) => ({
    ...state,
    user,
    token,
    isAuthenticated: !!user && !!token,
    error: null
  })),

  // Clear error
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  // Account Activation
  on(AuthActions.activateAccount, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.activateAccountSuccess, (state, { message }) => ({
    ...state,
    isLoading: false,
    error: null
  })),

  on(AuthActions.activateAccountFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Profile
  on(AuthActions.updateProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.registerSuccess, (state, { authResponse }) => ({
    ...state,
    authResponse,
    isLoading: false,
    error: null
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // MFA
  on(AuthActions.verifyMfa, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.verifyMfaSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.verifyMfaFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
