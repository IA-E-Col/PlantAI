package ird.sup.projectmanagementservice.auth;

import ird.sup.projectmanagementservice.DAO.EmailTokenRepository;
import ird.sup.projectmanagementservice.DAO.IUserRepository;
import ird.sup.projectmanagementservice.DAO.TokenRepository;
import ird.sup.projectmanagementservice.configuration.JwtService;
import ird.sup.projectmanagementservice.email.EmailService;
import ird.sup.projectmanagementservice.Entities.EmailToken;
import ird.sup.projectmanagementservice.Entities.Token;
import ird.sup.projectmanagementservice.Entities.TokenType;
import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.tfa.TwoFactorAuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

/**
 * Service centralisant la logique d'authentification et d'inscription, incluant la génération de tokens JWT,
 * la gestion des tokens d'activation par email et l'authentification à double facteur (2FA).
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    // Accès aux utilisateurs en base de données
    private final IUserRepository repository;
    // Gestion des tokens d'accès (JWT) en base
    private final TokenRepository tokenRepository;
    // Gestion des tokens d'activation envoyés par email
    private final EmailTokenRepository emailtokenRepository;
    // Encodeur de mots de passe (ex: BCrypt)
    private final PasswordEncoder passwordEncoder;
    // Service de gestion des tokens JWT (génération, validation, extraction de claims)
    private final JwtService jwtService;
    // Service d'envoi d'emails avec template (utilise JavaMailSender et Thymeleaf)
    private final EmailService emailService;
    // Composant Spring Security pour authentifier un utilisateur
    private final AuthenticationManager authenticationManager;
    // Service pour la génération de secrets et gestion du 2FA
    private final TwoFactorAuthenticationService tfaService;
    // JavaMailSender pour envoyer des emails directement (pour validation, par exemple)
    private final JavaMailSender emailSender;

    // URL d'activation du compte, généralement celle du client (ex: Angular)
    @Value("http://localhost:4200/activate-account")
    private String activationUrl;

    /**
     * Inscription d'un nouvel utilisateur.
     * 
     * Cette méthode effectue les opérations suivantes :
     * - Crée un nouvel utilisateur en encodant son mot de passe.
     * - Si le 2FA est activé, génère et assigne un secret à l'utilisateur.
     * - Enregistre l'utilisateur dans la base de données.
     * - Envoie un email de validation contenant un token d'activation.
     * - Génère et enregistre un token JWT et un token de rafraîchissement.
     * - Retourne une réponse d'authentification contenant ces tokens et, si nécessaire, l'URI d'image QR pour le 2FA.
     *
     * @param request Les informations d'inscription de l'utilisateur.
     * @return Un objet AuthenticationResponse contenant les tokens et l'état 2FA.
     * @throws MessagingException En cas d'erreur lors de l'envoi de l'email.
     * @throws jakarta.mail.MessagingException En cas d'erreur lors de l'envoi de l'email via Jakarta Mail.
     */
    public AuthenticationResponse register(RegisterRequest request) throws MessagingException, jakarta.mail.MessagingException {
        // Création d'un nouvel utilisateur en encodant le mot de passe
        var user = User.builder()
                .prenom(request.getFirstname())
                .nom(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .mfaEnabled(request.isMfaEnabled())
                .build();

        // Si le 2FA est activé, générer et assigner un secret à l'utilisateur
        if (request.isMfaEnabled()) {
            user.setSecret(tfaService.generateNewSecret());
        }

        // Enregistrement de l'utilisateur dans la base
        var savedUser = repository.save(user);
        // Envoi d'un email de validation contenant un token d'activation
        sendValidationEmail(savedUser);

        // Génération d'un token JWT et d'un token de rafraîchissement
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        // Enregistrement du token JWT dans la base
        saveUserToken(savedUser, jwtToken);

        // Construction et retour de la réponse d'authentification
        return AuthenticationResponse.builder()
                .secretImageUri(tfaService.generateQrCodeImageUri(user.getSecret()))
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                // Ici, on retourne mfaEnabled en fonction de l'activation du compte.
                .mfaEnabled(user.isEnabled())
                .build();
    }

    /**
     * Envoie un email de validation pour l'activation du compte de l'utilisateur.
     *
     * @param user L'utilisateur pour lequel envoyer l'email de validation.
     * @throws MessagingException En cas d'erreur lors de l'envoi de l'email.
     * @throws jakarta.mail.MessagingException En cas d'erreur lors de l'envoi de l'email via Jakarta Mail.
     */
    private void sendValidationEmail(User user) throws MessagingException, jakarta.mail.MessagingException {
        // Génération et sauvegarde d'un token d'activation pour l'utilisateur
        var newToken = generateAndSaveActivationToken(user);
        // Envoi de l'email de validation avec le token d'activation et l'URL d'activation
        sendEmail2(user.getEmail(), "activate_account", newToken, activationUrl);
    }

    /**
     * Envoie un email HTML personnalisé.
     *
     * @param to L'adresse email du destinataire.
     * @param subject Le sujet de l'email.
     * @param token Le token d'activation à inclure.
     * @param activationUrl L'URL à inclure pour activer le compte.
     * @throws MessagingException En cas d'erreur lors de la création ou l'envoi de l'email.
     * @throws jakarta.mail.MessagingException En cas d'erreur via Jakarta Mail.
     */
    private void sendEmail2(String to, String subject, String token, String activationUrl) throws MessagingException, jakarta.mail.MessagingException {
        // Création du message MIME
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);

        // Construction du contenu HTML de l'email
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<html><body style='font-family: Arial, sans-serif;'>");

        // Bandeau bleu avec le titre d'activation
        emailContent.append("<div style='background-color:#007bff; color:#fff; padding:10px; text-align:center;'>");
        emailContent.append("<h1>MindCare Activating account</h1>");
        emailContent.append("</div>");

        // Section contenant le token et le lien d'activation
        emailContent.append("<div style='background-color:#f8f9fa; padding:10px; margin-top:20px;'>");
        emailContent.append("<h3 style='color:#28a745;'>Token : </h3>");
        emailContent.append("<p><strong>This is your token :</strong> ").append(token).append("</p>");
        emailContent.append("<a href='").append(activationUrl).append("' style='background-color:#007bff; color:#fff; padding:10px; text-decoration:none; display:inline-block; margin-top:10px;'>Activate Account</a>");
        emailContent.append("</div>");

        emailContent.append("</body></html>");

        // Définition du contenu HTML du message
        helper.setText(emailContent.toString(), true);
        System.out.println("mail sent");
        // Envoi de l'email
        emailSender.send(message);
        System.out.println("mail sent");
    }

    /**
     * Génère un token d'activation pour l'utilisateur, l'enregistre dans la base et le retourne.
     *
     * @param user L'utilisateur pour lequel générer le token d'activation.
     * @return Le token d'activation généré.
     */
    private String generateAndSaveActivationToken(User user) {
        // Génération d'un code d'activation de 6 chiffres
        String generatedToken = generateActivationCode(6);
        // Création d'un EmailToken avec une validité de 15 minutes
        var emailtoken = EmailToken.builder()
                .emailToken(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        // Enregistrement du token d'activation dans la base
        emailtokenRepository.save(emailtoken);
        return generatedToken;
    }

    /**
     * Génère un code d'activation composé uniquement de chiffres.
     *
     * @param length La longueur souhaitée du code.
     * @return Le code d'activation généré.
     */
    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        // Sélection aléatoire de chiffres pour former le code
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

    /**
     * Enregistre le token JWT généré pour l'utilisateur dans la base.
     *
     * @param user L'utilisateur pour lequel enregistrer le token.
     * @param jwtToken Le token JWT généré.
     */
    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    /**
     * Authentifie un utilisateur à partir de son email et mot de passe.
     * 
     * Si l'utilisateur a activé le mode MFA, une réponse indiquant que le MFA est requis est renvoyée (tokens vides).
     * Sinon, des tokens d'accès et de rafraîchissement sont générés, les anciens tokens sont révoqués et une réponse d'authentification est retournée.
     *
     * @param request Les informations d'authentification (email et mot de passe).
     * @return Un objet AuthenticationResponse contenant les tokens.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Authentifie l'utilisateur avec les identifiants fournis
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // Recherche l'utilisateur par email dans la base
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NoSuchElementException("No user with the provided email"));

        // Si l'utilisateur a activé le mode MFA, retourne une réponse indiquant que le MFA doit être validé
        if (user.isEnabled()) {
            return AuthenticationResponse.builder()
                    .accessToken("")
                    .refreshToken("")
                    .mfaEnabled(true)
                    .build();
        }
      
        // Génère un token d'accès et un token de rafraîchissement
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        // Révoque tous les tokens existants pour l'utilisateur
        revokeAllUserTokens(user);
        // Enregistre le nouveau token d'accès dans la base
        saveUserToken(user, jwtToken);

        // Retourne la réponse d'authentification avec les tokens générés
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(false)
                .build();
    }

    /**
     * Révoque tous les tokens valides de l'utilisateur en les marquant comme expirés et révoqués.
     *
     * @param user L'utilisateur dont les tokens doivent être révoqués.
     */
    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    /**
     * Rafraîchit le token d'accès en utilisant le token de rafraîchissement fourni dans l'en-tête Authorization.
     * Si le token de rafraîchissement est valide, un nouveau token d'accès est généré, les anciens tokens sont révoqués,
     * et la réponse contenant le nouveau token d'accès et le token de rafraîchissement est écrite dans la réponse HTTP.
     *
     * @param request  La requête HTTP contenant l'en-tête Authorization.
     * @param response La réponse HTTP dans laquelle sera écrit le nouveau token.
     * @throws IOException En cas d'erreur d'écriture dans la réponse.
     */
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        // Extraction du token de rafraîchissement depuis l'en-tête Authorization
        refreshToken = authHeader.substring(7);
        // Extraction de l'email (nom d'utilisateur) contenu dans le token
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow(() -> new NoSuchElementException("No user with the provided email"));
            // Si le token de rafraîchissement est valide
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                // Révocation de tous les tokens existants de l'utilisateur
                revokeAllUserTokens(user);
                // Enregistrement du nouveau token d'accès dans la base
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .mfaEnabled(false)
                        .build();
                // Écriture de la réponse en JSON dans le flux de sortie HTTP
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    /**
     * Vérifie le code de vérification (souvent pour la validation du 2FA).
     *
     * Reçoit un VerificationRequest contenant l'email et le code de vérification.
     * Si aucun utilisateur n'est trouvé ou si le code est incorrect, une exception est levée.
     * Sinon, un nouveau token d'accès est généré et retourné dans la réponse.
     *
     * @param verificationRequest L'objet contenant l'email et le code de vérification.
     * @return Un AuthenticationResponse contenant le token d'accès.
     */
    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
        // Recherche de l'utilisateur par email
        User user = repository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("No user found with %s", verificationRequest.getEmail()))
                );
        // Vérification du code de vérification via le service de 2FA
        if (tfaService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())) {
            throw new BadCredentialsException("Code is not correct");
        }
        // Génération d'un nouveau token d'accès
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .mfaEnabled(user.isEnabled())
                .build();
    }

    /**
     * Active le compte de l'utilisateur à partir du token d'activation.
     *
     * Récupère le token d'activation stocké dans la base. Si le token est expiré,
     * un nouvel email de validation est envoyé et une exception est levée.
     * Sinon, le compte de l'utilisateur est activé et la date de validation du token est enregistrée.
     *
     * @param token Le token d'activation envoyé à l'utilisateur par email.
     * @throws MessagingException En cas d'erreur lors de l'envoi de l'email.
     * @throws jakarta.mail.MessagingException En cas d'erreur lors de l'envoi de l'email via Jakarta Mail.
     */
    public void activateAccount(String token) throws MessagingException, jakarta.mail.MessagingException {
        // Récupère le token d'activation depuis la base
        EmailToken savedToken = emailtokenRepository.findByEmailtoken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        // Si le token est expiré, renvoie un nouvel email de validation et lève une exception
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been sent to the same email address");
        }
        // Active le compte de l'utilisateur en définissant enabled à true
        var user = repository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        repository.save(user);
        // Enregistre la date de validation du token d'activation
        savedToken.setValidatedAt(LocalDateTime.now());
        emailtokenRepository.save(savedToken);
    }
}
