package ird.sup.projectmanagementservice.auth;

import ird.sup.projectmanagementservice.Entities.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

	private String prenom;
    private String nom;
    private String email;
    private String password;
    private String departement;
    private Role role;
    private boolean mfaEnabled;
    private String image; // URL de l'image de profil
}
