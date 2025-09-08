import { createAction, props } from '@ngrx/store';
import { User, Collaborator, UserInvitation, UserStats, UserFilters, CollaboratorFilters } from './users.state';

// Load Users Actions
export const loadUsers = createAction(
  '[Users] Load Users',
  props<{ 
    filters?: UserFilters;
    page?: number;
    pageSize?: number;
  }>()
);

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ 
    users: User[]; 
    total: number;
    page: number;
    pageSize: number;
  }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

// Load Single User Actions
export const loadUser = createAction(
  '[Users] Load User',
  props<{ userId: number }>()
);

export const loadUserSuccess = createAction(
  '[Users] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[Users] Load User Failure',
  props<{ error: string }>()
);

// Create User Actions
export const createUser = createAction(
  '[Users] Create User',
  props<{ 
    user: Omit<User, 'id' | 'dateInscription' | 'statistiques'>;
  }>()
);

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>()
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>()
);

// Update User Actions
export const updateUser = createAction(
  '[Users] Update User',
  props<{ 
    userId: number; 
    updates: Partial<User> 
  }>()
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: string }>()
);

// Delete User Actions
export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ userId: number }>()
);

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ userId: number }>()
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>()
);

// Enable/Disable User Actions
export const toggleUserStatus = createAction(
  '[Users] Toggle User Status',
  props<{ userId: number; enabled: boolean }>()
);

export const toggleUserStatusSuccess = createAction(
  '[Users] Toggle User Status Success',
  props<{ user: User }>()
);

export const toggleUserStatusFailure = createAction(
  '[Users] Toggle User Status Failure',
  props<{ error: string }>()
);

// Load Collaborators Actions
export const loadCollaborators = createAction(
  '[Users] Load Collaborators',
  props<{ 
    projectId?: number;
    filters?: CollaboratorFilters;
  }>()
);

export const loadCollaboratorsSuccess = createAction(
  '[Users] Load Collaborators Success',
  props<{ collaborators: Collaborator[] }>()
);

export const loadCollaboratorsFailure = createAction(
  '[Users] Load Collaborators Failure',
  props<{ error: string }>()
);

// Add Collaborator Actions
export const addCollaborator = createAction(
  '[Users] Add Collaborator',
  props<{ 
    projectId: number;
    userId: number;
    role: 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER';
    permissions?: Partial<Collaborator['permissions']>;
  }>()
);

export const addCollaboratorSuccess = createAction(
  '[Users] Add Collaborator Success',
  props<{ collaborator: Collaborator }>()
);

export const addCollaboratorFailure = createAction(
  '[Users] Add Collaborator Failure',
  props<{ error: string }>()
);

// Update Collaborator Actions
export const updateCollaborator = createAction(
  '[Users] Update Collaborator',
  props<{ 
    collaboratorId: number; 
    updates: Partial<Collaborator> 
  }>()
);

export const updateCollaboratorSuccess = createAction(
  '[Users] Update Collaborator Success',
  props<{ collaborator: Collaborator }>()
);

export const updateCollaboratorFailure = createAction(
  '[Users] Update Collaborator Failure',
  props<{ error: string }>()
);

// Remove Collaborator Actions
export const removeCollaborator = createAction(
  '[Users] Remove Collaborator',
  props<{ collaboratorId: number }>()
);

export const removeCollaboratorSuccess = createAction(
  '[Users] Remove Collaborator Success',
  props<{ collaboratorId: number }>()
);

export const removeCollaboratorFailure = createAction(
  '[Users] Remove Collaborator Failure',
  props<{ error: string }>()
);

// Invite User Actions
export const inviteUser = createAction(
  '[Users] Invite User',
  props<{ 
    email: string;
    projectId: number;
    role: 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER';
    message?: string;
  }>()
);

export const inviteUserSuccess = createAction(
  '[Users] Invite User Success',
  props<{ invitation: UserInvitation }>()
);

export const inviteUserFailure = createAction(
  '[Users] Invite User Failure',
  props<{ error: string }>()
);

// Load Invitations Actions
export const loadInvitations = createAction(
  '[Users] Load Invitations',
  props<{ projectId?: number }>()
);

export const loadInvitationsSuccess = createAction(
  '[Users] Load Invitations Success',
  props<{ invitations: UserInvitation[] }>()
);

export const loadInvitationsFailure = createAction(
  '[Users] Load Invitations Failure',
  props<{ error: string }>()
);

// Accept Invitation Actions
export const acceptInvitation = createAction(
  '[Users] Accept Invitation',
  props<{ token: string }>()
);

export const acceptInvitationSuccess = createAction(
  '[Users] Accept Invitation Success',
  props<{ collaborator: Collaborator }>()
);

export const acceptInvitationFailure = createAction(
  '[Users] Accept Invitation Failure',
  props<{ error: string }>()
);

// Reject Invitation Actions
export const rejectInvitation = createAction(
  '[Users] Reject Invitation',
  props<{ token: string }>()
);

export const rejectInvitationSuccess = createAction(
  '[Users] Reject Invitation Success',
  props<{ invitationId: number }>()
);

export const rejectInvitationFailure = createAction(
  '[Users] Reject Invitation Failure',
  props<{ error: string }>()
);

// Cancel Invitation Actions
export const cancelInvitation = createAction(
  '[Users] Cancel Invitation',
  props<{ invitationId: number }>()
);

export const cancelInvitationSuccess = createAction(
  '[Users] Cancel Invitation Success',
  props<{ invitationId: number }>()
);

export const cancelInvitationFailure = createAction(
  '[Users] Cancel Invitation Failure',
  props<{ error: string }>()
);

// Load User Stats Actions
export const loadUserStats = createAction(
  '[Users] Load User Stats'
);

export const loadUserStatsSuccess = createAction(
  '[Users] Load User Stats Success',
  props<{ stats: UserStats }>()
);

export const loadUserStatsFailure = createAction(
  '[Users] Load User Stats Failure',
  props<{ error: string }>()
);

// Filter and Sort Actions
export const setUserFilters = createAction(
  '[Users] Set User Filters',
  props<{ filters: UserFilters }>()
);

export const clearUserFilters = createAction(
  '[Users] Clear User Filters'
);

export const setCollaboratorFilters = createAction(
  '[Users] Set Collaborator Filters',
  props<{ filters: CollaboratorFilters }>()
);

export const clearCollaboratorFilters = createAction(
  '[Users] Clear Collaborator Filters'
);

export const setUserSort = createAction(
  '[Users] Set User Sort',
  props<{ field: string; direction: 'asc' | 'desc' }>()
);

export const setUserPagination = createAction(
  '[Users] Set User Pagination',
  props<{ page: number; pageSize: number }>()
);

// Bulk Actions
export const bulkUpdateUsers = createAction(
  '[Users] Bulk Update Users',
  props<{ 
    userIds: number[]; 
    updates: Partial<User>;
  }>()
);

export const bulkUpdateUsersSuccess = createAction(
  '[Users] Bulk Update Users Success',
  props<{ users: User[] }>()
);

export const bulkUpdateUsersFailure = createAction(
  '[Users] Bulk Update Users Failure',
  props<{ error: string }>()
);

export const bulkDeleteUsers = createAction(
  '[Users] Bulk Delete Users',
  props<{ userIds: number[] }>()
);

export const bulkDeleteUsersSuccess = createAction(
  '[Users] Bulk Delete Users Success',
  props<{ userIds: number[] }>()
);

export const bulkDeleteUsersFailure = createAction(
  '[Users] Bulk Delete Users Failure',
  props<{ error: string }>()
);

// Clear Actions
export const clearUsers = createAction(
  '[Users] Clear Users'
);

export const clearCurrentUser = createAction(
  '[Users] Clear Current User'
);

export const clearCollaborators = createAction(
  '[Users] Clear Collaborators'
);

export const clearInvitations = createAction(
  '[Users] Clear Invitations'
);

export const clearUserError = createAction(
  '[Users] Clear Error'
);
