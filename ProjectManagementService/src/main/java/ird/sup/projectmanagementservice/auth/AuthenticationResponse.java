package ird.sup.projectmanagementservice.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AuthenticationResponse {

	 private Long userId;            // Identifiant de l'utilisateur
	    private String accessToken;
	    private String refreshToken;
	    private boolean mfaEnabled;
	    private String secretImageUri;
	    private String profileImageUrl; // URL de l'image de profil
	    private String nom;             // Nom de l'utilisateur
	    private String prenom;          // Prénom de l'utilisateur
}
