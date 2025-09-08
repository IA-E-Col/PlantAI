import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { AppState } from '../app.state';
import * as UserActions from './users.actions';
import { User, Collaborator, UserInvitation, UserStats } from './users.state';

@Injectable()
export class UserEffects {

  // Load Users Effect
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({ filters, page = 1, pageSize = 20 }) => {
        console.log('Loading users with filters:', { filters, page, pageSize });
        
        // Generate mock users based on filters
        const mockUsers = this.generateMockUsers(filters, page, pageSize);
        
        return of(UserActions.loadUsersSuccess({
          users: mockUsers.users,
          total: mockUsers.total,
          page,
          pageSize
        }));
      }),
      catchError(error => of(UserActions.loadUsersFailure({ error: error.message })))
    )
  );

  // Load Single User Effect
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ userId }) => {
        console.log('Loading user:', userId);
        
        // Generate mock user
        const mockUser = this.generateMockUser(userId);
        
        return of(UserActions.loadUserSuccess({ user: mockUser }));
      }),
      catchError(error => of(UserActions.loadUserFailure({ error: error.message })))
    )
  );

  // Create User Effect
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ user }) => {
        console.log('Creating user:', user);
        
        // Generate mock created user
        const mockCreatedUser = this.generateMockCreatedUser(user);
        
        return of(UserActions.createUserSuccess({ user: mockCreatedUser }));
      }),
      catchError(error => of(UserActions.createUserFailure({ error: error.message })))
    )
  );

  // Update User Effect
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ userId, updates }) => {
        console.log('Updating user:', { userId, updates });
        
        // Generate mock updated user
        const mockUpdatedUser = this.generateMockUpdatedUser(userId, updates);
        
        return of(UserActions.updateUserSuccess({ user: mockUpdatedUser }));
      }),
      catchError(error => of(UserActions.updateUserFailure({ error: error.message })))
    )
  );

  // Delete User Effect
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(({ userId }) => {
        console.log('Deleting user:', userId);
        
        // Simulate successful deletion
        return of(UserActions.deleteUserSuccess({ userId }));
      }),
      catchError(error => of(UserActions.deleteUserFailure({ error: error.message })))
    )
  );

  // Toggle User Status Effect
  toggleUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.toggleUserStatus),
      switchMap(({ userId, enabled }) => {
        console.log('Toggling user status:', { userId, enabled });
        
        // Generate mock updated user
        const mockUpdatedUser = this.generateMockUpdatedUser(userId, { enabled });
        
        return of(UserActions.toggleUserStatusSuccess({ user: mockUpdatedUser }));
      }),
      catchError(error => of(UserActions.toggleUserStatusFailure({ error: error.message })))
    )
  );

  // Load Collaborators Effect
  loadCollaborators$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadCollaborators),
      switchMap(({ projectId, filters }) => {
        console.log('Loading collaborators:', { projectId, filters });
        
        // Generate mock collaborators
        const mockCollaborators = this.generateMockCollaborators(projectId, filters);
        
        return of(UserActions.loadCollaboratorsSuccess({ collaborators: mockCollaborators }));
      }),
      catchError(error => of(UserActions.loadCollaboratorsFailure({ error: error.message })))
    )
  );

  // Add Collaborator Effect
  addCollaborator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addCollaborator),
      switchMap(({ projectId, userId, role, permissions }) => {
        console.log('Adding collaborator:', { projectId, userId, role, permissions });
        
        // Generate mock collaborator
        const mockCollaborator = this.generateMockCollaborator(projectId, userId, role, permissions);
        
        return of(UserActions.addCollaboratorSuccess({ collaborator: mockCollaborator }));
      }),
      catchError(error => of(UserActions.addCollaboratorFailure({ error: error.message })))
    )
  );

  // Update Collaborator Effect
  updateCollaborator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateCollaborator),
      switchMap(({ collaboratorId, updates }) => {
        console.log('Updating collaborator:', { collaboratorId, updates });
        
        // Generate mock updated collaborator
        const mockUpdatedCollaborator = this.generateMockUpdatedCollaborator(collaboratorId, updates);
        
        return of(UserActions.updateCollaboratorSuccess({ collaborator: mockUpdatedCollaborator }));
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
        
        // Generate mock invitation
        const mockInvitation = this.generateMockInvitation(email, projectId, role, message);
        
        return of(UserActions.inviteUserSuccess({ invitation: mockInvitation }));
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
        
        // Generate mock invitations
        const mockInvitations = this.generateMockInvitations(projectId);
        
        return of(UserActions.loadInvitationsSuccess({ invitations: mockInvitations }));
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
        
        // Generate mock collaborator from invitation
        const mockCollaborator = this.generateMockCollaboratorFromInvitation(token);
        
        return of(UserActions.acceptInvitationSuccess({ collaborator: mockCollaborator }));
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
        
        // Generate mock user stats
        const mockStats = this.generateMockUserStats();
        
        return of(UserActions.loadUserStatsSuccess({ stats: mockStats }));
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
        
        // Generate mock bulk updated users
        const mockUpdatedUsers = this.generateMockBulkUpdatedUsers(userIds, updates);
        
        return of(UserActions.bulkUpdateUsersSuccess({ users: mockUpdatedUsers }));
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

  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  // Mock Data Generation Methods
  private generateMockUsers(filters?: any, page: number = 1, pageSize: number = 20): { users: User[], total: number } {
    const total = 85; // Mock total
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    
    const users: User[] = [];
    const roles: Array<'ADMIN' | 'EXPERT' | 'AVANCE' | 'INTERMEDIAIRE' | 'DEBUTANT' | 'AMATEUR'> = 
      ['ADMIN', 'EXPERT', 'AVANCE', 'INTERMEDIAIRE', 'DEBUTANT', 'AMATEUR'];
    const expertises: Array<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'MASTER'> = 
      ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'MASTER'];
    const institutions = ['IRD', 'CNRS', 'Université de Dakar', 'Université de Bamako', 'CIRAD'];
    const specialites = ['Botanique', 'Écologie', 'Taxonomie', 'Conservation', 'Génétique'];
    
    for (let i = startIndex; i < endIndex; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const expertise = expertises[Math.floor(Math.random() * expertises.length)];
      const institution = institutions[Math.floor(Math.random() * institutions.length)];
      const specialite = specialites[Math.floor(Math.random() * specialites.length)];
      const enabled = Math.random() > 0.1; // 90% enabled
      
      users.push({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        nom: `User${i + 1}`,
        prenom: `FirstName${i + 1}`,
        role,
        niveauExpertise: expertise,
        enabled,
        avatar: `assets/avatars/user_${i + 1}.jpg`,
        bio: `Bio for user ${i + 1}`,
        institution,
        specialite,
        dateInscription: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        derniereConnexion: enabled ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        preferences: {
          language: 'fr',
          theme: Math.random() > 0.5 ? 'light' : 'dark',
          notifications: true,
          emailNotifications: true
        },
        statistiques: {
          annotationsValidees: Math.floor(Math.random() * 100),
          projetsCrees: Math.floor(Math.random() * 10),
          contributions: Math.floor(Math.random() * 200),
          score: Math.floor(Math.random() * 1000)
        }
      });
    }
    
    return { users, total };
  }

  private generateMockUser(userId: number): User {
    return {
      id: userId,
      email: `user${userId}@example.com`,
      nom: `User${userId}`,
      prenom: `FirstName${userId}`,
      role: 'EXPERT',
      niveauExpertise: 'ADVANCED',
      enabled: true,
      avatar: `assets/avatars/user_${userId}.jpg`,
      bio: `Bio for user ${userId}`,
      institution: 'IRD',
      specialite: 'Botanique',
      dateInscription: new Date().toISOString(),
      derniereConnexion: new Date().toISOString(),
      preferences: {
        language: 'fr',
        theme: 'light',
        notifications: true,
        emailNotifications: true
      },
      statistiques: {
        annotationsValidees: 50,
        projetsCrees: 5,
        contributions: 100,
        score: 750
      }
    };
  }

  private generateMockCreatedUser(user: any): User {
    return {
      ...user,
      id: Date.now(),
      dateInscription: new Date().toISOString(),
      statistiques: {
        annotationsValidees: 0,
        projetsCrees: 0,
        contributions: 0,
        score: 0
      }
    };
  }

  private generateMockUpdatedUser(userId: number, updates: any): User {
    const baseUser = this.generateMockUser(userId);
    return {
      ...baseUser,
      ...updates
    };
  }

  private generateMockCollaborators(projectId?: number, filters?: any): Collaborator[] {
    const collaborators: Collaborator[] = [];
    const roles: Array<'OWNER' | 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER'> = 
      ['OWNER', 'ADMIN', 'CONTRIBUTOR', 'VIEWER'];
    const statuts: Array<'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVOKED'> = 
      ['PENDING', 'ACCEPTED', 'REJECTED', 'REVOKED'];
    
    for (let i = 1; i <= 15; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      
      collaborators.push({
        id: i,
        userId: i,
        projectId: projectId || 1,
        role,
        permissions: {
          canEdit: role === 'OWNER' || role === 'ADMIN',
          canDelete: role === 'OWNER',
          canInvite: role === 'OWNER' || role === 'ADMIN',
          canManageModels: role === 'OWNER' || role === 'ADMIN',
          canManageCollections: role === 'OWNER' || role === 'ADMIN',
          canValidateAnnotations: role !== 'VIEWER'
        },
        dateInvitation: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        dateAcceptation: statut === 'ACCEPTED' ? new Date().toISOString() : undefined,
        statut,
        invitePar: 1,
        user: this.generateMockUser(i)
      });
    }
    
    return collaborators;
  }

  private generateMockCollaborator(projectId: number, userId: number, role: string, permissions?: any): Collaborator {
    return {
      id: Date.now(),
      userId,
      projectId,
      role: role as any,
      permissions: {
        canEdit: role === 'OWNER' || role === 'ADMIN',
        canDelete: role === 'OWNER',
        canInvite: role === 'OWNER' || role === 'ADMIN',
        canManageModels: role === 'OWNER' || role === 'ADMIN',
        canManageCollections: role === 'OWNER' || role === 'ADMIN',
        canValidateAnnotations: role !== 'VIEWER',
        ...permissions
      },
      dateInvitation: new Date().toISOString(),
      dateAcceptation: new Date().toISOString(),
      statut: 'ACCEPTED',
      invitePar: 1,
      user: this.generateMockUser(userId)
    };
  }

  private generateMockUpdatedCollaborator(collaboratorId: number, updates: any): Collaborator {
    const baseCollaborator = this.generateMockCollaborator(1, 1, 'CONTRIBUTOR');
    return {
      ...baseCollaborator,
      id: collaboratorId,
      ...updates
    };
  }

  private generateMockInvitation(email: string, projectId: number, role: string, message?: string): UserInvitation {
    return {
      id: Date.now(),
      email,
      projectId,
      role: role as any,
      message,
      dateInvitation: new Date().toISOString(),
      dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      statut: 'PENDING',
      invitePar: 1,
      token: `token_${Date.now()}`
    };
  }

  private generateMockInvitations(projectId?: number): UserInvitation[] {
    const invitations: UserInvitation[] = [];
    const roles: Array<'ADMIN' | 'CONTRIBUTOR' | 'VIEWER'> = ['ADMIN', 'CONTRIBUTOR', 'VIEWER'];
    const statuts: Array<'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'> = 
      ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'];
    
    for (let i = 1; i <= 8; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      
      invitations.push({
        id: i,
        email: `invited${i}@example.com`,
        projectId: projectId || 1,
        role,
        message: `Invitation message ${i}`,
        dateInvitation: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        dateExpiration: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        statut,
        invitePar: 1,
        token: `token_${i}`
      });
    }
    
    return invitations;
  }

  private generateMockCollaboratorFromInvitation(token: string): Collaborator {
    return this.generateMockCollaborator(1, parseInt(token), 'CONTRIBUTOR');
  }

  private generateMockUserStats(): UserStats {
    return {
      totalUsers: 85,
      activeUsers: 76,
      inactiveUsers: 9,
      newUsersThisMonth: 12,
      usersByRole: {
        'ADMIN': 5,
        'EXPERT': 15,
        'AVANCE': 20,
        'INTERMEDIAIRE': 25,
        'DEBUTANT': 15,
        'AMATEUR': 5
      },
      usersByExpertise: {
        'BEGINNER': 10,
        'INTERMEDIATE': 25,
        'ADVANCED': 30,
        'EXPERT': 15,
        'MASTER': 5
      },
      topContributors: [
        this.generateMockUser(1),
        this.generateMockUser(2),
        this.generateMockUser(3)
      ],
      averageScore: 450,
      lastUpdated: new Date().toISOString()
    };
  }

  private generateMockBulkUpdatedUsers(userIds: number[], updates: any): User[] {
    return userIds.map(id => this.generateMockUpdatedUser(id, updates));
  }
}
