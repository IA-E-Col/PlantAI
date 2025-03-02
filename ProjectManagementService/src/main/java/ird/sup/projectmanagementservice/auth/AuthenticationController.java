package ird.sup.projectmanagementservice.auth;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;

  @PostMapping("/register")
  public ResponseEntity<?> register( //? reponse peut changer
      @RequestBody RegisterRequest request
  ) throws MessagingException, jakarta.mail.MessagingException {
    var response=service.register(request);
    if(request.isMfaEnabled()){
      return ResponseEntity.ok(response);
    }
    return ResponseEntity.accepted().build();
  }
  
  
  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request
  ) {
    return ResponseEntity.ok(service.authenticate(request));
  }

  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }
  @PostMapping("/verify")
  public ResponseEntity<?> verifyCode(
          @RequestBody VerificationRequest verificationRequest
  )
  {
    return ResponseEntity.ok(service.verifyCode(verificationRequest));
  }
  @GetMapping("/activate-account")
  public void confirm(
          @RequestParam String emailtoken
  ) throws MessagingException, jakarta.mail.MessagingException {
    service.activateAccount(emailtoken);
  }
}
