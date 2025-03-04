package ird.sup.projectmanagementservice.DTO;
import ird.sup.projectmanagementservice.Entities.Expertise;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
public class UserWithExpertiseDTO {
    Long Id ;
    String username;
    String nom;
    String prenom;
    String email;
    String tel;
    String departement;
    byte[] image;
    Expertise e;


}
