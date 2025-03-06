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

import io.swagger.v3.oas.models.Paths;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Path;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.mail.MessagingException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.SecureRandom;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.nio.file.Files;
import java.util.Base64;
/**
 * Service centralisant la logique d'authentification et d'inscription, incluant la génération de tokens JWT,
 * la gestion des tokens d'activation par email et l'authentification à double facteur (2FA).
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUserRepository repository;
    private final TokenRepository tokenRepository;
    private final EmailTokenRepository emailtokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final TwoFactorAuthenticationService tfaService;
    private final JavaMailSender emailSender;

    @Value("http://localhost:4200/activate-account")
    private String activationUrl;

    public AuthenticationResponse register(RegisterRequest request)
            throws MessagingException, jakarta.mail.MessagingException {

    	// 1) Si le champ image est au format Base64, on enregistre le fichier en local.
    	if (request.getImage() != null && request.getImage().startsWith("data:image")) {
    	    try {
    	        int commaIndex = request.getImage().indexOf(",");
    	        if (commaIndex > 0) {
    	            // Récupérer la partie "base64" (après la virgule)
    	            String base64Data = request.getImage().substring(commaIndex + 1);
    	            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

    	            // Générer un nom de fichier unique (ex: 1678123456789_profile.png)
    	            String fileName = System.currentTimeMillis() + "_profile.png";

    	            // Définir le dossier cible : "../frontend/src/assets/uploads/"
    	            // (Hypothèse : le backend et le frontend sont au même niveau)
    	            String uploadDir = "../frontend/app/src/assets/uploads/";
    	            File directory = new File(uploadDir);
    	            if (!directory.exists()) {
    	                directory.mkdirs();
    	            }

    	            // Écrire le fichier sur le disque
    	            File file = new File(directory, fileName);
    	            try (FileOutputStream fos = new FileOutputStream(file)) {
    	                fos.write(imageBytes);
    	            }

    	            // Stocker un chemin relatif pour que le front (Angular) puisse y accéder :
    	            // Par exemple "assets/uploads/1678123456789_profile.png"
    	            request.setImage("assets/uploads/" + fileName);
    	        }
    	    } catch (IOException e) {
    	        throw new RuntimeException("Failed to process base64 image: " + e.getMessage(), e);
    	    }
    	}


        // 2) Créer l'utilisateur
        var user = User.builder()
                .prenom(request.getPrenom())
                .nom(request.getNom())
                .email(request.getEmail())
                .departement(request.getDepartement())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .mfaEnabled(request.isMfaEnabled())
                .image(request.getImage())  // Stocke "uploads/xxx.png"
                .build();

        // 2) Génère et assigne un secret si 2FA est activé
        if (user.isMfaEnabled()) {
            user.setSecret(tfaService.generateNewSecret());
        }

        // 3) Enregistre l'utilisateur (non encore "enabled")
        var savedUser = repository.save(user);

        // 4) Envoie un email de validation
        sendValidationEmail(savedUser);

        // 5) Génère les tokens JWT
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);

        // 6) Enregistre le token JWT dans la base
        saveUserToken(savedUser, jwtToken);

        // 7) Construire la réponse
        return AuthenticationResponse.builder()
                .secretImageUri(
                    user.isMfaEnabled() ? tfaService.generateQrCodeImageUri(user.getSecret()) : null
                )
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(user.isMfaEnabled())
                .profileImageUrl(user.getImage())  // Permettre au front de connaître le chemin
                .secretImageUri(user.isMfaEnabled() ? tfaService.generateQrCodeImageUri(user.getSecret()) : null)
                .build();
    }
    

    private void sendValidationEmail(User user)
            throws MessagingException, jakarta.mail.MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        sendEmail2(user.getEmail(), "activate_account", newToken, activationUrl);
    }

    private void sendEmail2(String to, String subject, String token, String activationUrl)
            throws MessagingException, jakarta.mail.MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);

        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<html><body style='font-family: Arial, sans-serif;'>");
        emailContent.append("<div style='background-color:#007bff; color:#fff; padding:10px; text-align:center;'>");
        emailContent.append("<h1>PlantAi Activating account</h1>");
        emailContent.append("</div>");
        emailContent.append("<div style='background-color:#f8f9fa; padding:10px; margin-top:20px;'>");
        emailContent.append("<h3 style='color:#28a745;'>Token : </h3>");
        emailContent.append("<p><strong>This is your token :</strong> ").append(token).append("</p>");
        emailContent.append("<a href='").append(activationUrl)
                    .append("' style='background-color:#007bff; color:#fff; padding:10px; text-decoration:none; display:inline-block; margin-top:10px;'>Activate Account</a>");
        emailContent.append("</div>");
        emailContent.append("</body></html>");

        helper.setText(emailContent.toString(), true);
        emailSender.send(message);
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var emailtoken = EmailToken.builder()
                .emailToken(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        emailtokenRepository.save(emailtoken);
        return generatedToken;
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

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
     * Authentification standard.
     * - Si MFA activé, renvoie un accessToken vide => forcer verifyCode().
     * - Sinon, renvoie token + refresh + info sur l'image.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("Authentication failed: " + ex.getMessage());
        }

        var user = repository.findByEmaill(request.getEmail())
                .orElseThrow(() -> new NoSuchElementException("No user with the provided email"));

        // Si l'utilisateur a activé la 2FA => renvoie un token vide pour forcer la saisie OTP.
        if (user.isMfaEnabled()) {
            return AuthenticationResponse.builder()
                    .accessToken("")    // Forcer la saisie OTP
                    .refreshToken("")
                    .mfaEnabled(true)
                    .build();
        }

        // Sinon, 2FA non activé => on génère directement les tokens
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(false)
                .profileImageUrl(user.getImage())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .userId(user.getId())
                .build();
    }


    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = repository.findByEmaill(userEmail)
                    .orElseThrow(() -> new NoSuchElementException("No user with the provided email"));
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .mfaEnabled(user.isMfaEnabled())
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
        User user = repository
                .findByEmaill(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("No user found with %S", verificationRequest.getEmail()))
                );

        if (tfaService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())) {
            throw new BadCredentialsException("Code is not correct");
        }

        // Si le code est correct, on génère un nouveau token
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }

    public void activateAccount(String token) throws MessagingException, jakarta.mail.MessagingException {
        EmailToken savedToken = emailtokenRepository.findByEmailToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            // Ré-envoie un nouveau token si expiré
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = repository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        repository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        emailtokenRepository.save(savedToken);
    }
    
    public Optional<User> getUserByEmail(String email) {
        // Remarquez que votre repository utilise la méthode findByEmaill (avec deux 'l')
        return repository.findByEmaill(email);
    }


}
