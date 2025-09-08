import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState, User, Collaborator, UserInvitation, UserStats } from './users.state';
import { AppState } from '../app.state';

// Feature selector
export const selectUserState = createFeatureSelector<AppState, UserState>('users');

// Basic selectors
export const selectAllUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectCurrentUser = createSelector(
  selectUserState,
  (state: UserState) => state.currentUser
);

export const selectUsersLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUsersError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectUsersLastUpdated = createSelector(
  selectUserState,
  (state: UserState) => state.lastUpdated
);

export const selectUserFilters = createSelector(
  selectUserState,
  (state: UserState) => state.userFilters
);

export const selectCollaboratorFilters = createSelector(
  selectUserState,
  (state: UserState) => state.collaboratorFilters
);

export const selectUserSort = createSelector(
  selectUserState,
  (state: UserState) => state.sortBy
);

export const selectUserPagination = createSelector(
  selectUserState,
  (state: UserState) => state.pagination
);

// Collaborators and Invitations selectors
export const selectAllCollaborators = createSelector(
  selectUserState,
  (state: UserState) => state.collaborators
);

export const selectAllInvitations = createSelector(
  selectUserState,
  (state: UserState) => state.invitations
);

export const selectUserStats = createSelector(
  selectUserState,
  (state: UserState) => state.userStats
);

// Filtered users selector
export const selectFilteredUsers = createSelector(
  selectAllUsers,
  selectUserFilters,
  (users: User[], filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return users;
    }

    return users.filter(user => {
      // Role filter
      if (filters.role && filters.role.length > 0) {
        if (!filters.role.includes(user.role)) {
          return false;
        }
      }

      // Expertise level filter
      if (filters.niveauExpertise && filters.niveauExpertise.length > 0) {
        if (!filters.niveauExpertise.includes(user.niveauExpertise)) {
          return false;
        }
      }

      // Enabled filter
      if (filters.enabled !== undefined && user.enabled !== filters.enabled) {
        return false;
      }

      // Institution filter
      if (filters.institution && user.institution !== filters.institution) {
        return false;
      }

      // Speciality filter
      if (filters.specialite && user.specialite !== filters.specialite) {
        return false;
      }

      // Date inscription filter
      if (filters.dateInscription) {
        const userDate = new Date(user.dateInscription);
        const startDate = new Date(filters.dateInscription.start);
        const endDate = new Date(filters.dateInscription.end);
        
        if (userDate < startDate || userDate > endDate) {
          return false;
        }
      }

      // Last connection filter
      if (filters.derniereConnexion && user.derniereConnexion) {
        const userDate = new Date(user.derniereConnexion);
        const startDate = new Date(filters.derniereConnexion.start);
        const endDate = new Date(filters.derniereConnexion.end);
        
        if (userDate < startDate || userDate > endDate) {
          return false;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const searchableText = [
          user.email,
          user.nom,
          user.prenom,
          user.institution,
          user.specialite
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }
);

// Sorted users selector
export const selectSortedUsers = createSelector(
  selectFilteredUsers,
  selectUserSort,
  (users: User[], sortBy) => {
    if (!sortBy || !sortBy.field) {
      return users;
    }

    return [...users].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy.field) {
        case 'dateInscription':
          aValue = new Date(a.dateInscription);
          bValue = new Date(b.dateInscription);
          break;
        case 'derniereConnexion':
          aValue = a.derniereConnexion ? new Date(a.derniereConnexion) : new Date(0);
          bValue = b.derniereConnexion ? new Date(b.derniereConnexion) : new Date(0);
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'nom':
          aValue = a.nom;
          bValue = b.nom;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'niveauExpertise':
          aValue = a.niveauExpertise;
          bValue = b.niveauExpertise;
          break;
        case 'enabled':
          aValue = a.enabled;
          bValue = b.enabled;
          break;
        case 'statistiques.score':
          aValue = a.statistiques?.score || 0;
          bValue = b.statistiques?.score || 0;
          break;
        case 'statistiques.annotationsValidees':
          aValue = a.statistiques?.annotationsValidees || 0;
          bValue = b.statistiques?.annotationsValidees || 0;
          break;
        default:
          aValue = a[sortBy.field as keyof User];
          bValue = b[sortBy.field as keyof User];
      }

      if (aValue < bValue) {
        return sortBy.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortBy.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
);

// Paginated users selector
export const selectPaginatedUsers = createSelector(
  selectSortedUsers,
  selectUserPagination,
  (users: User[], pagination) => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return users.slice(startIndex, endIndex);
  }
);

// Status-based selectors
export const selectActiveUsers = createSelector(
  selectAllUsers,
  (users: User[]) => users.filter(u => u.enabled)
);

export const selectInactiveUsers = createSelector(
  selectAllUsers,
  (users: User[]) => users.filter(u => !u.enabled)
);

export const selectUsersByRole = (role: string) => createSelector(
  selectAllUsers,
  (users: User[]) => users.filter(u => u.role === role)
);

export const selectUsersByExpertise = (expertise: string) => createSelector(
  selectAllUsers,
  (users: User[]) => users.filter(u => u.niveauExpertise === expertise)
);

// Collaborators selectors
export const selectCollaboratorsByProject = (projectId: number) => createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => collaborators.filter(c => c.projectId === projectId)
);

export const selectCollaboratorsByRole = (role: string) => createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => collaborators.filter(c => c.role === role)
);

export const selectCollaboratorsByStatus = (status: string) => createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => collaborators.filter(c => c.statut === status)
);

export const selectAcceptedCollaborators = createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => collaborators.filter(c => c.statut === 'ACCEPTED')
);

export const selectPendingCollaborators = createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => collaborators.filter(c => c.statut === 'PENDING')
);

// Invitations selectors
export const selectInvitationsByProject = (projectId: number) => createSelector(
  selectAllInvitations,
  (invitations: UserInvitation[]) => invitations.filter(i => i.projectId === projectId)
);

export const selectInvitationsByStatus = (status: string) => createSelector(
  selectAllInvitations,
  (invitations: UserInvitation[]) => invitations.filter(i => i.statut === status)
);

export const selectPendingInvitations = createSelector(
  selectAllInvitations,
  (invitations: UserInvitation[]) => invitations.filter(i => i.statut === 'PENDING')
);

export const selectExpiredInvitations = createSelector(
  selectAllInvitations,
  (invitations: UserInvitation[]) => invitations.filter(i => i.statut === 'EXPIRED')
);

// User by ID selector
export const selectUserById = (userId: number) => createSelector(
  selectAllUsers,
  (users: User[]) => users.find(u => u.id === userId)
);

// Collaborator by ID selector
export const selectCollaboratorById = (collaboratorId: number) => createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => collaborators.find(c => c.id === collaboratorId)
);

// Invitation by ID selector
export const selectInvitationById = (invitationId: number) => createSelector(
  selectAllInvitations,
  (invitations: UserInvitation[]) => invitations.find(i => i.id === invitationId)
);

// High score users selector
export const selectHighScoreUsers = createSelector(
  selectAllUsers,
  (users: User[]) => users.filter(u => (u.statistiques?.score || 0) >= 500)
);

// Recent users selector
export const selectRecentUsers = createSelector(
  selectAllUsers,
  (users: User[]) => {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return users.filter(u => new Date(u.dateInscription) > oneMonthAgo);
  }
);

// Top contributors selector
export const selectTopContributors = createSelector(
  selectAllUsers,
  (users: User[]) => {
    return [...users]
      .sort((a, b) => (b.statistiques?.contributions || 0) - (a.statistiques?.contributions || 0))
      .slice(0, 10);
  }
);

// User statistics selectors
export const selectTotalUsers = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.totalUsers || 0
);

export const selectActiveUsersCount = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.activeUsers || 0
);

export const selectInactiveUsersCount = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.inactiveUsers || 0
);

export const selectNewUsersThisMonth = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.newUsersThisMonth || 0
);

export const selectUsersByRoleStats = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.usersByRole || {}
);

export const selectUsersByExpertiseStats = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.usersByExpertise || {}
);

export const selectAverageScore = createSelector(
  selectUserStats,
  (stats: UserStats | null) => stats?.averageScore || 0
);

// Permission selectors
export const selectUserPermissions = (userId: number, projectId: number) => createSelector(
  selectAllCollaborators,
  (collaborators: Collaborator[]) => {
    const collaborator = collaborators.find(c => c.userId === userId && c.projectId === projectId);
    return collaborator?.permissions || {
      canEdit: false,
      canDelete: false,
      canInvite: false,
      canManageModels: false,
      canManageCollections: false,
      canValidateAnnotations: false
    };
  }
);

export const selectCanUserEdit = (userId: number, projectId: number) => createSelector(
  selectUserPermissions(userId, projectId),
  (permissions) => permissions.canEdit
);

export const selectCanUserDelete = (userId: number, projectId: number) => createSelector(
  selectUserPermissions(userId, projectId),
  (permissions) => permissions.canDelete
);

export const selectCanUserInvite = (userId: number, projectId: number) => createSelector(
  selectUserPermissions(userId, projectId),
  (permissions) => permissions.canInvite
);
