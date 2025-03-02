package ird.sup.projectmanagementservice.configuration;

import ird.sup.projectmanagementservice.DAO.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    // Injection du TokenRepository pour accéder aux tokens stockés en base
    private final TokenRepository tokenRepository;

    /**
     * Méthode de déconnexion qui invalide le token JWT.
     *
     * @param request        La requête HTTP entrante.
     * @param response       La réponse HTTP à renvoyer.
     * @param authentication L'objet d'authentification actuel (non utilisé ici).
     */
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // Récupère l'en-tête "Authorization" de la requête
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        
        // Vérifie si l'en-tête est présent et commence par "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Si l'en-tête est absent ou mal formé, on ne fait rien et on quitte la méthode
            return;
        }
        
        // Extraction du token JWT en retirant le préfixe "Bearer "
        jwt = authHeader.substring(7);
        
        // Recherche du token stocké dans la base de données via le repository
        var storedToken = tokenRepository.findByToken(jwt).orElse(null);
        
        // Si le token existe, on le marque comme expiré et révoqué
        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            // Enregistre les modifications dans la base de données
            tokenRepository.save(storedToken);
            // Optionnel : on peut également effacer le contexte de sécurité
            // SecurityContextHolder.clearContext();
        }
    }
}
