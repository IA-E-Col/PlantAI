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
                .prenom(request.getPrenom())
                .nom(request.getNom())
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
        var newToken= generateAndSaveActivationToken(user);
          sendEmail2(user.getEmail(), "activate_account", newToken,activationUrl);
          //emailService.sendEmail(user.getEmail(), user.getfullNname(), "activate_account",activationUrl,newToken,"Account activation");
      }
      private void sendEmail2(String to, String subject, String token,String activationUrl) throws MessagingException, jakarta.mail.MessagingException {
          MimeMessage message = emailSender.createMimeMessage();
          MimeMessageHelper helper = new MimeMessageHelper(message, true);
          helper.setTo(to);
          helper.setSubject(subject);

          StringBuilder emailContent = new StringBuilder();
          emailContent.append("<html><body style='font-family: Arial, sans-serif;'>");

          // Cadre bleu avec le texte "Welcome to Poker Planning"
          emailContent.append("<div style='background-color:#007bff; color:#fff; padding:10px; text-align:center;'>");
          emailContent.append("<h1>PlantAi Activating account</h1>");
          emailContent.append("</div>");

          // Texte de base de l'e-mail




          // Design de la réponse
          emailContent.append("<div style='background-color:#f8f9fa; padding:10px; margin-top:20px;'>");
          emailContent.append("<h3 style='color:#28a745;'>Token : </h3>");
          emailContent.append("<p><strong>This is your token :</strong> ").append(token).append("</p>");
          emailContent.append("<a href='").append(activationUrl).append("' style='background-color:#007bff; color:#fff; padding:10px; text-decoration:none; display:inline-block; margin-top:10px;'>Activate Account</a>");
          emailContent.append("</div>");

          emailContent.append("</body></html>");

          helper.setText(emailContent.toString(), true);
          System.out.println("mail sent");
          emailSender.send(message);
          System.out.println("mail sent");
      }
      private String generateAndSaveActivationToken(User user) {
        String generatedToken=generateActivationCode(6);
          LocalDateTime createdAt = LocalDateTime.now();
   var emailtoken= EmailToken.builder()
           .emailToken(generatedToken)
           .createdAt(LocalDateTime.now())
           .expiresAt(LocalDateTime.now().plusMinutes(15))
           .user(user)
           .build();
   emailtokenRepository.save(emailtoken);
        return generatedToken;
      }

      private String generateActivationCode(int length) {
        String characters="0123456789";
        StringBuilder codeBuilder=new StringBuilder();
          SecureRandom secureRandom=new SecureRandom();
          for (int i=0;i<length;i++){
              int randomIndex=secureRandom.nextInt(characters.length()); //0..9
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

      public AuthenticationResponse authenticate(AuthenticationRequest request) {
    	    // 1) Authentifie l'utilisateur via Spring Security
    	  System.out.println(request.getEmail()+ request.getPassword());
    	  System.out.println(request.getPassword());
    	    try {
    	        authenticationManager.authenticate(
    	            new UsernamePasswordAuthenticationToken(
    	                request.getEmail(),
    	                request.getPassword()
    	            )
    	        );
    	    } catch (Exception ex) {
    	        System.err.println("Erreur durant l'authentification : " + ex.getMessage());
    	        throw ex; // ou gérer l'erreur selon vos besoins
    	    }
    	    System.out.println("hola2");
    	    // 2) Recherche l'utilisateur en base
    	    var user = repository.findByEmaill(request.getEmail())
    	            .orElseThrow(() -> new NoSuchElementException("No user with the provided email"));
               System.out.println(user);
    	    // 3) Vérifie si l'utilisateur a activé le 2FA
    	    if (user.isMfaEnabled()) {
    	        // Retourne une réponse indiquant qu'il faut valider le MFA
    	        return AuthenticationResponse.builder()
    	                .accessToken("")
    	                .refreshToken("")
    	                .mfaEnabled(true)
    	                .build();
    	    }

    	    // 4) Génère les tokens d'accès et de rafraîchissement
    	    var jwtToken = jwtService.generateToken(user);
    	    var refreshToken = jwtService.generateRefreshToken(user);

    	    // 5) Révoque tous les tokens précédents
    	    revokeAllUserTokens(user);

    	    // 6) Enregistre le nouveau token dans la base
    	    saveUserToken(user, jwtToken);
    	    System.out.println("mrigl");
    	    // 7) Retourne la réponse d'authentification
    	    return AuthenticationResponse.builder()
    	            .accessToken(jwtToken)
    	            .refreshToken(refreshToken)
    	            .mfaEnabled(false)
    	            .build();
    	   
    	}




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

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
      final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
      final String refreshToken;
      final String userEmail;
      if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
        return;
      }
      refreshToken = authHeader.substring(7);
      userEmail = jwtService.extractUsername(refreshToken);
      if (userEmail != null) {

        var user = this.repository.findByEmaill(userEmail)
                .orElseThrow(() -> new NoSuchElementException("No user with the provided email"));

        if (jwtService.isTokenValid(refreshToken, user)) {
          var accessToken = jwtService.generateToken(user);
          revokeAllUserTokens(user);
          saveUserToken(user, accessToken);
          var authResponse = AuthenticationResponse.builder()
                  .accessToken(accessToken)
                  .refreshToken(refreshToken)
                  .mfaEnabled(false)
                  .build();
          new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
        }
      }
    }
      public AuthenticationResponse verifyCode(
              VerificationRequest verificationRequest
      ) {
          User user = repository
                  .findByEmaill(verificationRequest.getEmail())
                  .orElseThrow(() -> new EntityNotFoundException(
                          String.format("No user found with %S", verificationRequest.getEmail()))
                  );
          if (tfaService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())) {

              throw new BadCredentialsException("Code is not correct");
          }
          var jwtToken = jwtService.generateToken(user);
          return AuthenticationResponse.builder()
                  .accessToken(jwtToken)
                  .mfaEnabled(user.isMfaEnabled())
                  .build();
      }

      //@Transactional
      public void activateAccount(String token) throws MessagingException, jakarta.mail.MessagingException {
          EmailToken savedToken = emailtokenRepository.findByEmailToken(token)
                  // todo exception has to be defined
                  .orElseThrow(() -> new RuntimeException("Invalid token"));
          if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
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
  }
