export enum Role {
  ADMIN = 'ADMIN',
  EXPERT = 'EXPERT', 
  AVANCE = 'AVANCE',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  DEBUTANT = 'DEBUTANT',
  AMATEUR = 'AMATEUR'
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  departement: string;
  role: Role | null;
  profileImageUrl?: string;
  mfaEnabled: boolean;
  enabled: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authResponse: any | null; // For registration/MFA flow
}
