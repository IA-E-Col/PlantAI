package ird.sup.projectmanagementservice.DTO;
import ird.sup.projectmanagementservice.Entities.Expertise;
import lombok.*;

import java.sql.Blob;

@NoArgsConstructor     
@Getter
@Setter
@AllArgsConstructor
public class UserWithExpertiseDTO {
    Long id ;
    String username;
    String nom;
    String prenom;
    String email;
    String tel;
    String departement;
    String image;
    Expertise e;


}
