package ird.sup.projectmanagementservice.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ird.sup.projectmanagementservice.Entities.User;

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
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest request, @RequestPart("file") MultipartFile file)
            throws MessagingException, jakarta.mail.MessagingException, SQLException, IOException {
        var response = service.register(request,file);
        
        // Si MFA est activé, on renvoie l'objet complet (avec QR code, etc.)
        if (request.isMfaEnabled()) {
            return ResponseEntity.ok(response);
        }
        
        // Sinon, on envoie juste un 202 (Accepted) sans corps (réponse vide),
        // comme indiqué dans votre logique front (qui vérifie `if (response) {...} else {...}`)
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) throws SQLException {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(
            @RequestBody VerificationRequest verificationRequest
    ) throws MessagingException, jakarta.mail.MessagingException, SQLException {
      return ResponseEntity.ok(service.verifyCode(verificationRequest));
    }

    @GetMapping("/activate-account")
    public void confirm(@RequestParam String emailtoken)
            throws MessagingException, jakarta.mail.MessagingException {
        service.activateAccount(emailtoken);
    }
    


    @GetMapping("/getidbyemail/{email}")
    public ResponseEntity<Long> getUserIdByEmail(@PathVariable String email) {
        return service.getUserByEmail(email)
                .map(user -> ResponseEntity.ok(user.getId()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity
                .badRequest()
                .header("Content-Type", "text/plain")
                .body(ex.getMessage());
    }

    @PutMapping("/modifieruser")
    public ResponseEntity<User> modifierUser(@RequestBody ProfileUpdateRequest request) {
        User updatedUser = service.modifierProfile(request);
        return ResponseEntity.ok(updatedUser);
    }



    }


