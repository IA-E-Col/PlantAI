package ird.sup.projectmanagementservice.configuration;

import ird.sup.projectmanagementservice.DAO.TokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Service permettant de manipuler et vérifier les tokens JWT.
    private final JwtService jwtService;
    // Service pour charger les détails de l'utilisateur depuis la base de données.
    private final UserDetailsService userDetailsService;
    // Repository pour accéder aux tokens stockés en base et vérifier leur validité.
    private final TokenRepository tokenRepository;

    /**
     * Méthode qui intercepte chaque requête HTTP et vérifie la validité du token JWT.
     *
     * @param request La requête HTTP entrante.
     * @param response La réponse HTTP à renvoyer.
     * @param filterChain La chaîne de filtres à poursuivre.
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        // Si la requête concerne l'authentification, on passe le filtre sans traitement.
        if (request.getServletPath().contains("/api/v1/auth")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Récupération de l'en-tête "Authorization"
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        // Si l'en-tête est absent ou ne commence pas par "Bearer ", on passe le filtre.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Extraction du token JWT de l'en-tête (on retire "Bearer ").
        jwt = authHeader.substring(7);
        // Extraction de l'email (nom d'utilisateur) contenu dans le token.
        userEmail = jwtService.extractUsername(jwt);
        
        // Si un email est extrait et qu'aucune authentification n'est encore présente dans le contexte de sécurité
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Chargement des détails de l'utilisateur depuis la base de données
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            // Vérification supplémentaire de la validité du token stocké dans la base (non expiré et non révoqué)
            var isTokenValid = tokenRepository.findByToken(jwt)
                    .map(t -> !t.isExpired() && !t.isRevoked())
                    .orElse(false);
            // Vérification que le token JWT est valide par rapport aux détails utilisateur
            if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
                // Création d'un objet d'authentification contenant les détails de l'utilisateur et ses autorisations
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                // Ajout des détails de la requête à l'objet d'authentification
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Mise à jour du contexte de sécurité avec l'objet d'authentification
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Poursuite de la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}
