package ird.sup.projectmanagementservice.DTO;
import ird.sup.projectmanagementservice.Entities.Expertise;
import lombok.*;

import java.sql.Blob;

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
    Blob image;
    Expertise e;


}
