package ird.sup.projectmanagementservice.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.mail.MessagingException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import javax.sql.rowset.serial.SerialException;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request)
            throws MessagingException, jakarta.mail.MessagingException {
        var response = service.register(request);
        
        // Si MFA est activé, on renvoie l'objet complet (avec QR code, etc.)
        if (request.isMfaEnabled()) {
            return ResponseEntity.ok(response);
        }
        
        // Sinon, on envoie juste un 202 (Accepted) sans corps (réponse vide),
        // comme indiqué dans votre logique front (qui vérifie `if (response) {...} else {...}`)
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(service.verifyCode(verificationRequest));
    }

    @GetMapping("/activate-account")
    public void confirm(@RequestParam String emailtoken)
            throws MessagingException, jakarta.mail.MessagingException {
        service.activateAccount(emailtoken);
    }
    

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadUserImage(@RequestParam("file") MultipartFile file) {
        try {
            // 1) Vérifier que le fichier n'est pas vide
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty or missing.");
            }
            // 2) Vérifier/créer le dossier "uploads"
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            // 3) Générer un nom unique
            String originalName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + (originalName != null ? originalName : "file");
            Path filePath = uploadPath.resolve(fileName);

            // 4) Écriture du fichier
            file.transferTo(filePath.toFile());

            // 5) Générer l'URL (exemple fictif)
            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body("Error uploading image: " + e.getMessage());
        }
    }

    @GetMapping("/getidbyemail/{email}")
    public ResponseEntity<Long> getUserIdByEmail(@PathVariable String email) {
        return service.getUserByEmail(email)
                .map(user -> ResponseEntity.ok(user.getId()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    }


