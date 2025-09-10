import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { AppState } from '../app.state';
import * as UserActions from './users.actions';
import { User, Collaborator, UserInvitation, UserStats } from './users.state';

@Injectable()
export class UserEffects {
  private baseUrl = 'http://localhost:8080/api';

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient
  ) {}

  // Load Users Effect
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({ filters, page = 1, pageSize = 20 }) => {
        console.log('Loading users with filters:', { filters, page, pageSize });
        
        return this.http.get<User[]>(`${this.baseUrl}/users/`).pipe(
          map((users) => {
            // Apply client-side filtering if needed
            let filteredUsers = users;
            if (filters && filters.searchTerm) {
              const searchTerm = filters.searchTerm.toLowerCase();
              filteredUsers = users.filter(user => 
                user.nom?.toLowerCase().includes(searchTerm) ||
                user.prenom?.toLowerCase().includes(searchTerm) ||
                user.email?.toLowerCase().includes(searchTerm)
              );
            }
            
            // Apply pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
            
            return UserActions.loadUsersSuccess({
              users: paginatedUsers,
              total: filteredUsers.length,
              page,
              pageSize
            });
          }),
          catchError(error => of(UserActions.loadUsersFailure({ error: error.message })))
        );
      })
    )
  );

  // Load Single User Effect
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ userId }) => {
        console.log('Loading user:', userId);
        
        return this.http.get<User>(`${this.baseUrl}/users/get/${userId}`).pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError(error => of(UserActions.loadUserFailure({ error: error.message })))
        );
      })
    )
  );

  // Create User Effect
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ user }) => {
        console.log('Creating user:', user);
        
        return this.http.post<User>(`${this.baseUrl}/users/`, user).pipe(
          map((createdUser) => UserActions.createUserSuccess({ user: createdUser })),
          catchError(error => of(UserActions.createUserFailure({ error: error.message })))
        );
      })
    )
  );

  // Update User Effect
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ userId, updates }) => {
        console.log('Updating user:', { userId, updates });
        
        return this.http.put<User>(`${this.baseUrl}/users/update/${userId}`, updates).pipe(
          map((updatedUser) => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UserActions.updateUserFailure({ error: error.message })))
        );
      })
    )
  );

  // Delete User Effect
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(({ userId }) => {
        console.log('Deleting user:', userId);
        
        return this.http.delete(`${this.baseUrl}/users/${userId}`).pipe(
          map(() => UserActions.deleteUserSuccess({ userId })),
          catchError(error => of(UserActions.deleteUserFailure({ error: error.message })))
        );
      })
    )
  );

  // Toggle User Status Effect
  toggleUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.toggleUserStatus),
      switchMap(({ userId, enabled }) => {
        console.log('Toggling user status:', { userId, enabled });
        
        return this.http.put<User>(`${this.baseUrl}/users/update/${userId}`, { enabled }).pipe(
          map((updatedUser) => UserActions.toggleUserStatusSuccess({ user: updatedUser })),
          catchError(error => of(UserActions.toggleUserStatusFailure({ error: error.message })))
        );
      })
    )
  );

  // Load Collaborators Effect - TODO: Implement when backend endpoint is available
  loadCollaborators$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadCollaborators),
      switchMap(({ projectId, filters }) => {
        console.log('Loading collaborators:', { projectId, filters });
        
        // TODO: Replace with real API call when backend endpoint is available
        // return this.http.get<Collaborator[]>(`${this.baseUrl}/projects/${projectId}/collaborators`).pipe(
        //   map((collaborators) => UserActions.loadCollaboratorsSuccess({ collaborators })),
        //   catchError(error => of(UserActions.loadCollaboratorsFailure({ error: error.message })))
        // );
        
        return of(UserActions.loadCollaboratorsFailure({ error: 'Collaborators API not implemented yet' }));
      })
    )
  );

  // Add Collaborator Effect - TODO: Implement when backend endpoint is available
  addCollaborator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addCollaborator),
      switchMap(({ projectId, userId, role, permissions }) => {
        console.log('Adding collaborator:', { projectId, userId, role, permissions });
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.addCollaboratorFailure({ error: 'Add collaborator API not implemented yet' }));
      })
    )
  );

  // Update Collaborator Effect
  updateCollaborator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateCollaborator),
      switchMap(({ collaboratorId, updates }) => {
        console.log('Updating collaborator:', { collaboratorId, updates });
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.updateCollaboratorFailure({ error: 'Update collaborator API not implemented yet' }));
      }),
      catchError(error => of(UserActions.updateCollaboratorFailure({ error: error.message })))
    )
  );

  // Remove Collaborator Effect
  removeCollaborator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.removeCollaborator),
      switchMap(({ collaboratorId }) => {
        console.log('Removing collaborator:', collaboratorId);
        
        // Simulate successful removal
        return of(UserActions.removeCollaboratorSuccess({ collaboratorId }));
      }),
      catchError(error => of(UserActions.removeCollaboratorFailure({ error: error.message })))
    )
  );

  // Invite User Effect
  inviteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.inviteUser),
      switchMap(({ email, projectId, role, message }) => {
        console.log('Inviting user:', { email, projectId, role, message });
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.inviteUserFailure({ error: 'Invite user API not implemented yet' }));
      }),
      catchError(error => of(UserActions.inviteUserFailure({ error: error.message })))
    )
  );

  // Load Invitations Effect
  loadInvitations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadInvitations),
      switchMap(({ projectId }) => {
        console.log('Loading invitations:', projectId);
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.loadInvitationsFailure({ error: 'Load invitations API not implemented yet' }));
      }),
      catchError(error => of(UserActions.loadInvitationsFailure({ error: error.message })))
    )
  );

  // Accept Invitation Effect
  acceptInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.acceptInvitation),
      switchMap(({ token }) => {
        console.log('Accepting invitation:', token);
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.acceptInvitationFailure({ error: 'Accept invitation API not implemented yet' }));
      }),
      catchError(error => of(UserActions.acceptInvitationFailure({ error: error.message })))
    )
  );

  // Reject Invitation Effect
  rejectInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.rejectInvitation),
      switchMap(({ token }) => {
        console.log('Rejecting invitation:', token);
        
        // Simulate successful rejection
        return of(UserActions.rejectInvitationSuccess({ invitationId: parseInt(token) }));
      }),
      catchError(error => of(UserActions.rejectInvitationFailure({ error: error.message })))
    )
  );

  // Cancel Invitation Effect
  cancelInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.cancelInvitation),
      switchMap(({ invitationId }) => {
        console.log('Canceling invitation:', invitationId);
        
        // Simulate successful cancellation
        return of(UserActions.cancelInvitationSuccess({ invitationId }));
      }),
      catchError(error => of(UserActions.cancelInvitationFailure({ error: error.message })))
    )
  );

  // Load User Stats Effect
  loadUserStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserStats),
      switchMap(() => {
        console.log('Loading user stats');
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.loadUserStatsFailure({ error: 'User stats API not implemented yet' }));
      }),
      catchError(error => of(UserActions.loadUserStatsFailure({ error: error.message })))
    )
  );

  // Bulk Update Users Effect
  bulkUpdateUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.bulkUpdateUsers),
      switchMap(({ userIds, updates }) => {
        console.log('Bulk updating users:', { userIds, updates });
        
        // TODO: Replace with real API call when backend endpoint is available
        return of(UserActions.bulkUpdateUsersFailure({ error: 'Bulk update users API not implemented yet' }));
      }),
      catchError(error => of(UserActions.bulkUpdateUsersFailure({ error: error.message })))
    )
  );

  // Bulk Delete Users Effect
  bulkDeleteUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.bulkDeleteUsers),
      switchMap(({ userIds }) => {
        console.log('Bulk deleting users:', userIds);
        
        // Simulate successful bulk deletion
        return of(UserActions.bulkDeleteUsersSuccess({ userIds }));
      }),
      catchError(error => of(UserActions.bulkDeleteUsersFailure({ error: error.message })))
    )
  );

  // Note: Mock data generation methods removed - using real API calls
}
