export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'EXPERT' | 'AVANCE' | 'INTERMEDIAIRE' | 'DEBUTANT' | 'AMATEUR';
  niveauExpertise: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'MASTER';
  enabled: boolean;
  avatar?: string;
  bio?: string;
  institution?: string;
  specialite?: string;
  dateInscription: string;
  derniereConnexion?: string;
  preferences?: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
  };
  statistiques?: {
    annotationsValidees: number;
    projetsCrees: number;
    contributions: number;
    score: number;
  };
}

export interface Collaborator {
  id: number;
  userId: number;
  projectId: number;
  role: 'OWNER' | 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER';
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canManageModels: boolean;
    canManageCollections: boolean;
    canValidateAnnotations: boolean;
  };
  dateInvitation: string;
  dateAcceptation?: string;
  statut: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVOKED';
  invitePar: number;
  user?: User;
}

export interface UserInvitation {
  id: number;
  email: string;
  projectId: number;
  role: 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER';
  message?: string;
  dateInvitation: string;
  dateExpiration: string;
  statut: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  invitePar: number;
  token: string;
}

export interface UserFilters {
  role?: string[];
  niveauExpertise?: string[];
  enabled?: boolean;
  searchTerm?: string;
  institution?: string;
  specialite?: string;
  dateInscription?: {
    start: string;
    end: string;
  };
  derniereConnexion?: {
    start: string;
    end: string;
  };
}

export interface CollaboratorFilters {
  projectId?: number;
  role?: string[];
  statut?: string[];
  searchTerm?: string;
  dateInvitation?: {
    start: string;
    end: string;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  usersByRole: { [key: string]: number };
  usersByExpertise: { [key: string]: number };
  topContributors: User[];
  averageScore: number;
  lastUpdated: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  collaborators: Collaborator[];
  invitations: UserInvitation[];
  userStats: UserStats | null;
  userFilters: UserFilters;
  collaboratorFilters: CollaboratorFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  sortBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export const initialUserState: UserState = {
  users: [],
  currentUser: null,
  collaborators: [],
  invitations: [],
  userStats: null,
  userFilters: {},
  collaboratorFilters: {},
  loading: false,
  error: null,
  lastUpdated: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },
  sortBy: {
    field: 'dateInscription',
    direction: 'desc'
  }
};
