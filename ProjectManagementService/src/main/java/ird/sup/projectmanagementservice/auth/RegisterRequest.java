package ird.sup.projectmanagementservice.auth;

import ird.sup.projectmanagementservice.Entities.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  private String prenom;
  private String nom;
  private String email;
  private String password;
  private Role role;
  private boolean mfaEnabled;
}
