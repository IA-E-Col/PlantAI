import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserId = createSelector(
  selectUser,
  (user) => user?.id || null
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user ? `${user.prenom} ${user.nom}` : null
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || null
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'ADMIN'
);

export const selectIsExpert = createSelector(
  selectUserRole,
  (role) => role === 'EXPERT'
);

export const selectCanManageProjects = createSelector(
  selectUserRole,
  (role) => role === 'ADMIN' || role === 'EXPERT' || role === 'AVANCE'
);

export const selectUserSkillLevel = createSelector(
  selectUserRole,
  (role) => {
    if (!role) return 0;
    const levels = {
      'AMATEUR': 1,
      'DEBUTANT': 2,
      'INTERMEDIAIRE': 3,
      'AVANCE': 4,
      'EXPERT': 5,
      'ADMIN': 6
    };
    return levels[role] || 0;
  }
);

export const selectAuthResponse = createSelector(
  selectAuthState,
  (state: AuthState) => state.authResponse
);

export const selectMfaEnabled = createSelector(
  selectAuthState,
  (state: AuthState) => state.authResponse?.mfaEnabled || false
);
