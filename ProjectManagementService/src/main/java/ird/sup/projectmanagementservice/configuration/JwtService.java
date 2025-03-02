package ird.sup.projectmanagementservice.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service dédié à la gestion des tokens JWT.
 * 
 * Ce service fournit des méthodes pour générer, valider et extraire des informations (claims)
 * d'un token JWT. La clé de signature, la durée d'expiration du token d'accès et celle du token
 * de rafraîchissement sont configurées via les propriétés de l'application.
 */
@Service
public class JwtService {

    // Clé secrète utilisée pour signer et valider le token, injectée depuis application.properties
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    // Durée d'expiration du token d'accès en millisecondes
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    // Durée d'expiration du token de rafraîchissement en millisecondes
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    /**
     * Extrait le nom d'utilisateur (habituellement l'email) contenu dans le token JWT.
     *
     * @param token le token JWT
     * @return le sujet (nom d'utilisateur) extrait du token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrait une claim spécifique du token JWT.
     *
     * @param token           le token JWT
     * @param claimsResolver  une fonction pour extraire la claim désirée
     * @param <T>             le type de la claim
     * @return la claim extraite
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Génère un token JWT sans claims supplémentaires pour l'utilisateur donné.
     *
     * @param userDetails les détails de l'utilisateur
     * @return le token JWT généré
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Génère un token JWT avec des claims supplémentaires pour l'utilisateur donné.
     *
     * @param extraClaims des claims supplémentaires à inclure dans le token
     * @param userDetails les détails de l'utilisateur
     * @return le token JWT généré
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Génère un token de rafraîchissement pour l'utilisateur donné.
     *
     * @param userDetails les détails de l'utilisateur
     * @return le token de rafraîchissement généré
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }

    /**
     * Construit le token JWT en définissant :
     * - Les claims supplémentaires (informations additionnelles)
     * - Le sujet (généralement le nom d'utilisateur ou l'email)
     * - La date d'émission
     * - La date d'expiration
     * - La signature du token avec l'algorithme HS256
     *
     * @param extraClaims des claims supplémentaires à ajouter
     * @param userDetails les détails de l'utilisateur
     * @param expiration  la durée d'expiration du token en millisecondes
     * @return le token JWT généré
     */
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts
                .builder()
                // Ajoute les claims supplémentaires
                .setClaims(extraClaims)
                // Définit le sujet (par exemple, l'email de l'utilisateur)
                .setSubject(userDetails.getUsername())
                // Définit la date d'émission du token
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // Définit la date d'expiration du token
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                // Signe le token avec l'algorithme HS256 et la clé de signature
                .signWith(SignatureAlgorithm.HS256, getSignInKey())
                .compact();
    }

    /**
     * Vérifie si le token JWT est valide pour l'utilisateur donné.
     * 
     * La validation consiste à vérifier que le sujet du token correspond au nom d'utilisateur
     * et que le token n'est pas expiré.
     *
     * @param token       le token JWT
     * @param userDetails les détails de l'utilisateur
     * @return true si le token est valide, false sinon
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Vérifie si le token JWT est expiré.
     *
     * @param token le token JWT
     * @return true si le token est expiré, false sinon
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrait la date d'expiration du token JWT.
     *
     * @param token le token JWT
     * @return la date d'expiration du token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrait toutes les claims du token JWT.
     *
     * @param token le token JWT
     * @return un objet Claims contenant toutes les claims du token
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                // Configure la clé de signature pour la validation du token
                .setSigningKey(getSignInKey())
                // Parse le token JWT et retourne ses claims
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Récupère la clé de signature utilisée pour signer le token.
     * 
     * La clé est décodée à partir de la clé secrète encodée en Base64.
     *
     * @return la clé de signature pour JWT
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
