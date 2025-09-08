import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

// Authentication Actions
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const loadUserFromStorage = createAction('[Auth] Load User From Storage');

export const clearError = createAction('[Auth] Clear Error');

// Account Activation Actions
export const activateAccount = createAction(
  '[Auth] Activate Account',
  props<{ token: string }>()
);

export const activateAccountSuccess = createAction(
  '[Auth] Activate Account Success',
  props<{ message: string }>()
);

export const activateAccountFailure = createAction(
  '[Auth] Activate Account Failure',
  props<{ error: string }>()
);

// Update Profile Actions
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ profile: any }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: any }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

// Registration Actions
export const register = createAction(
  '[Auth] Register',
  props<{ formData: FormData }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ authResponse?: any; message?: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// MFA Actions
export const verifyMfa = createAction(
  '[Auth] Verify MFA',
  props<{ email: string; code: string }>()
);

export const verifyMfaSuccess = createAction(
  '[Auth] Verify MFA Success',
  props<{ user: User; token: string }>()
);

export const verifyMfaFailure = createAction(
  '[Auth] Verify MFA Failure',
  props<{ error: string }>()
);
