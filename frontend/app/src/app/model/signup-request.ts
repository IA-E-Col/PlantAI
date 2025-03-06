export interface SignupRequest {
  prenom?: string;
  nom?: string;
  email?: string;
  password?: string;
  role?: string;
  departement?: string;
  image?: string;      // L'image en base64 ou l'URL générée
  mfaEnabled?: boolean; // Boolean (true/false)
}
