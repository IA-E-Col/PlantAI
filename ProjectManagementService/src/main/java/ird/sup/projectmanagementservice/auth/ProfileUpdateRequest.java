package ird.sup.projectmanagementservice.auth;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String tel;
    private String departement;
    // Pour la modification du mot de passe, ces champs sont optionnels.
    private String passwordAncien;
    private String passwordNouveau;
}
