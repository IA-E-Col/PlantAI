package ird.sup.projectmanagementservice.tfa;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;


/**
 * Service dédié à la gestion de l'authentification à deux facteurs (2FA).
 * 
 * Il permet :
 * - de générer un secret unique pour chaque utilisateur,
 * - de créer un QR code pour configurer l'application d'authentification,
 * - de vérifier les codes générés par l'utilisateur.
 */
@Service
@Slf4j
public class TwoFactorAuthenticationService {

    /**
     * Génère un secret pour l'authentification à deux facteurs.
     * 
     * @return Un secret aléatoire encodé en Base32.
     */
    public String generateNewSecret() {
        return new DefaultSecretGenerator().generate();
    }

    /**
     * Génère une image de code QR sous forme de Data URI. 
     * Ce code QR contient le secret et les informations nécessaires pour configurer 
     * une application d'authentification (ex: Google Authenticator).
     *
     * @param secret Le secret généré pour l'utilisateur.
     * @return Une chaîne de caractères au format Data URI représentant le QR code.
     */
    public String generateQrCodeImageUri(String secret) {
        // Configuration des données du QR code
        QrData data = new QrData.Builder()
                .label("IRD 2FA example") // Nom qui apparaîtra dans l'app d'authentification
                .secret(secret)            // Le secret généré pour l'utilisateur
                .issuer("IRD")          // Nom de l'organisation ou de l'application
                .algorithm(HashingAlgorithm.SHA1) // Algorithme de hachage (SHA1, SHA256, etc.)
                .digits(6)                 // Nombre de chiffres du code
                .period(30)                // Durée de validité d'un code (en secondes)
                .build();

        // Génération de l'image QR code
        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData;
        try {
            imageData = generator.generate(data);
        } catch (QrGenerationException e) {
            log.error("Error while generating QR-CODE", e);
            return null; // ou vous pouvez lever une exception personnalisée
        }

        // Conversion de l'image en Data URI (ex: "data:image/png;base64,....")
        return getDataUriForImage(imageData, generator.getImageMimeType());
    }

    /**
     * Vérifie si le code OTP (One Time Password) fourni est valide pour un secret donné.
     *
     * @param secret Le secret associé à l'utilisateur.
     * @param code   Le code OTP saisi par l'utilisateur.
     * @return true si le code est valide, false sinon.
     */
    public boolean isOtpValid(String secret, String code) {
        // Gestion du temps pour la validité du code
        TimeProvider timeProvider = new SystemTimeProvider();
        // Génération du code basé sur l'algorithme TOTP (Time-based One-Time Password)
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        // Vérification du code avec le temps actuel
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        return verifier.isValidCode(secret, code);
    }

    /**
     * Vérifie si le code OTP fourni n'est pas valide.
     *
     * @param secret Le secret associé à l'utilisateur.
     * @param code   Le code OTP saisi par l'utilisateur.
     * @return true si le code n'est pas valide, false sinon.
     */
    public boolean isOtpNotValid(String secret, String code) {
        return !this.isOtpValid(secret, code);
    }
}
