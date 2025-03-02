package ird.sup.projectmanagementservice.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.mail.MessagingException; // Utilisation de Jakarta Mail
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Contrôleur gérant les endpoints d'authentification, d'inscription,
 * de rafraîchissement de token, de vérification et d'activation de compte.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    // Service centralisant la logique d'authentification, d'inscription et d'activation.
    private final AuthenticationService service;

    /**
     * Endpoint d'inscription d'un nouvel utilisateur.
     *
     * Reçoit un objet RegisterRequest en JSON, lance le processus d'inscription via le service,
     * et envoie un email d'activation. Si l'authentification multi-facteurs (MFA) est activée,
     * la réponse est renvoyée immédiatement avec les informations nécessaires pour activer le MFA.
     *
     * @param request Objet contenant les informations d'inscription.
     * @return ResponseEntity avec le résultat de l'inscription ou le statut ACCEPTED.
     * @throws MessagingException           En cas d'erreur lors de l'envoi d'un email via Jakarta Mail.
     * @throws javax.mail.MessagingException En cas d'erreur lors de l'envoi d'un email via Javax Mail.
     * @throws IOException                  En cas d'erreur d'entrée/sortie.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request)
            throws MessagingException, IOException, javax.mail.MessagingException {
        // Appelle le service pour traiter l'inscription et récupérer la réponse
        var response = service.register(request);
        // Si MFA est activé, retourne la réponse avec les informations MFA
        if (request.isMfaEnabled()) {
            return ResponseEntity.ok(response);
        }
        // Sinon, retourne une réponse ACCEPTED
        return ResponseEntity.accepted().build();
    }

    /**
     * Endpoint pour l'authentification d'un utilisateur.
     *
     * Reçoit un objet AuthenticationRequest (contenant email et mot de passe)
     * et retourne un AuthenticationResponse, généralement contenant un token JWT.
     *
     * @param request Objet d'authentification.
     * @return ResponseEntity contenant l'AuthenticationResponse.
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    /**
     * Endpoint pour rafraîchir le token JWT.
     *
     * Cette méthode lit le token de rafraîchissement dans l'en-tête Authorization de la requête,
     * et si ce token est valide, elle génère un nouveau token d'accès et écrit la réponse dans l'objet HttpServletResponse.
     *
     * @param request  La requête HTTP contenant l'en-tête Authorization.
     * @param response La réponse HTTP dans laquelle le nouveau token sera écrit.
     * @throws IOException En cas d'erreur d'écriture dans la réponse.
     */
    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }

    /**
     * Endpoint pour vérifier un code de vérification (souvent utilisé pour MFA).
     *
     * Reçoit un objet VerificationRequest contenant l'email et le code de vérification,
     * et retourne une réponse indiquant si le code est valide.
     *
     * @param verificationRequest Objet contenant le code de vérification et l'email.
     * @return ResponseEntity indiquant le résultat de la vérification.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(service.verifyCode(verificationRequest));
    }

    /**
     * Endpoint pour activer le compte d'un utilisateur.
     *
     * Attend un paramètre de requête "emailtoken" et déclenche le processus d'activation du compte.
     * En cas de succès, le compte de l'utilisateur est activé ; sinon, un email avec un nouveau token d'activation est envoyé.
     *
     * @param emailtoken Le token d'activation envoyé par email.
     * @throws MessagingException           En cas d'erreur lors de l'envoi d'un email via Jakarta Mail.
     * @throws javax.mail.MessagingException En cas d'erreur lors de l'envoi d'un email via Javax Mail.
     */
    @GetMapping("/activate-account")
    public void confirm(@RequestParam String emailtoken)
            throws MessagingException, javax.mail.MessagingException {
        service.activateAccount(emailtoken);
    }
}
