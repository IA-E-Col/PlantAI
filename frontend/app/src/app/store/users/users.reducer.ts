import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './users.state';
import * as UserActions from './users.actions';

export const usersReducer = createReducer(
  initialUserState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUsersSuccess, (state, { users, total, page, pageSize }) => ({
    ...state,
    users,
    pagination: {
      ...state.pagination,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Single User
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null
  })),

  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create User
  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [user, ...state.users],
    pagination: {
      ...state.pagination,
      total: state.pagination.total + 1,
      totalPages: Math.ceil((state.pagination.total + 1) / state.pagination.pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => 
      u.id === user.id ? user : u
    ),
    currentUser: state.currentUser?.id === user.id ? user : state.currentUser,
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId),
    currentUser: state.currentUser?.id === userId ? null : state.currentUser,
    pagination: {
      ...state.pagination,
      total: state.pagination.total - 1,
      totalPages: Math.ceil((state.pagination.total - 1) / state.pagination.pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Toggle User Status
  on(UserActions.toggleUserStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.toggleUserStatusSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => 
      u.id === user.id ? user : u
    ),
    currentUser: state.currentUser?.id === user.id ? user : state.currentUser,
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.toggleUserStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Collaborators
  on(UserActions.loadCollaborators, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadCollaboratorsSuccess, (state, { collaborators }) => ({
    ...state,
    collaborators,
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.loadCollaboratorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add Collaborator
  on(UserActions.addCollaborator, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.addCollaboratorSuccess, (state, { collaborator }) => ({
    ...state,
    collaborators: [collaborator, ...state.collaborators],
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.addCollaboratorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Collaborator
  on(UserActions.updateCollaborator, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateCollaboratorSuccess, (state, { collaborator }) => ({
    ...state,
    collaborators: state.collaborators.map(c => 
      c.id === collaborator.id ? collaborator : c
    ),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.updateCollaboratorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Remove Collaborator
  on(UserActions.removeCollaborator, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.removeCollaboratorSuccess, (state, { collaboratorId }) => ({
    ...state,
    collaborators: state.collaborators.filter(c => c.id !== collaboratorId),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.removeCollaboratorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Invite User
  on(UserActions.inviteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.inviteUserSuccess, (state, { invitation }) => ({
    ...state,
    invitations: [invitation, ...state.invitations],
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.inviteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Invitations
  on(UserActions.loadInvitations, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadInvitationsSuccess, (state, { invitations }) => ({
    ...state,
    invitations,
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.loadInvitationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Accept Invitation
  on(UserActions.acceptInvitation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.acceptInvitationSuccess, (state, { collaborator }) => ({
    ...state,
    collaborators: [collaborator, ...state.collaborators],
    invitations: state.invitations.map(inv => 
      inv.token === collaborator.userId.toString() ? { ...inv, statut: 'ACCEPTED' as const } : inv
    ),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.acceptInvitationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Reject Invitation
  on(UserActions.rejectInvitation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.rejectInvitationSuccess, (state, { invitationId }) => ({
    ...state,
    invitations: state.invitations.map(inv => 
      inv.id === invitationId ? { ...inv, statut: 'REJECTED' as const } : inv
    ),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.rejectInvitationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Cancel Invitation
  on(UserActions.cancelInvitation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.cancelInvitationSuccess, (state, { invitationId }) => ({
    ...state,
    invitations: state.invitations.filter(inv => inv.id !== invitationId),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.cancelInvitationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load User Stats
  on(UserActions.loadUserStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUserStatsSuccess, (state, { stats }) => ({
    ...state,
    userStats: stats,
    loading: false,
    error: null
  })),

  on(UserActions.loadUserStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filter and Sort Actions
  on(UserActions.setUserFilters, (state, { filters }) => ({
    ...state,
    userFilters: { ...state.userFilters, ...filters },
    pagination: {
      ...state.pagination,
      page: 1 // Reset to first page when filters change
    }
  })),

  on(UserActions.clearUserFilters, (state) => ({
    ...state,
    userFilters: {},
    pagination: {
      ...state.pagination,
      page: 1
    }
  })),

  on(UserActions.setCollaboratorFilters, (state, { filters }) => ({
    ...state,
    collaboratorFilters: { ...state.collaboratorFilters, ...filters }
  })),

  on(UserActions.clearCollaboratorFilters, (state) => ({
    ...state,
    collaboratorFilters: {}
  })),

  on(UserActions.setUserSort, (state, { field, direction }) => ({
    ...state,
    sortBy: { field, direction },
    pagination: {
      ...state.pagination,
      page: 1 // Reset to first page when sort changes
    }
  })),

  on(UserActions.setUserPagination, (state, { page, pageSize }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      page,
      pageSize,
      totalPages: Math.ceil(state.pagination.total / pageSize)
    }
  })),

  // Bulk Actions
  on(UserActions.bulkUpdateUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.bulkUpdateUsersSuccess, (state, { users }) => ({
    ...state,
    users: state.users.map(user => {
      const updatedUser = users.find(u => u.id === user.id);
      return updatedUser || user;
    }),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.bulkUpdateUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(UserActions.bulkDeleteUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.bulkDeleteUsersSuccess, (state, { userIds }) => ({
    ...state,
    users: state.users.filter(user => !userIds.includes(user.id)),
    pagination: {
      ...state.pagination,
      total: state.pagination.total - userIds.length,
      totalPages: Math.ceil((state.pagination.total - userIds.length) / state.pagination.pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(UserActions.bulkDeleteUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Actions
  on(UserActions.clearUsers, (state) => ({
    ...state,
    users: [],
    pagination: {
      ...state.pagination,
      total: 0,
      totalPages: 0
    }
  })),

  on(UserActions.clearCurrentUser, (state) => ({
    ...state,
    currentUser: null
  })),

  on(UserActions.clearCollaborators, (state) => ({
    ...state,
    collaborators: []
  })),

  on(UserActions.clearInvitations, (state) => ({
    ...state,
    invitations: []
  })),

  on(UserActions.clearUserError, (state) => ({
    ...state,
    error: null
  }))
);
