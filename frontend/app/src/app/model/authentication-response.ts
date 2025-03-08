export interface AuthenticationResponse {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  mfaEnabled?: boolean;
  secretImageUri?: string;
  profileImageUrl?: string; // URL de l'image de profil
  nom?: string;            // Nom de l'utilisateur
  prenom?: string;         // Prénom de l'utilisateur
  email?: string; 
  departement?: string; 
}
