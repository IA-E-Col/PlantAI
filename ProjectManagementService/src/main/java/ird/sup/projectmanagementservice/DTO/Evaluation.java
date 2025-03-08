package ird.sup.projectmanagementservice.DTO;

import ird.sup.projectmanagementservice.Entities.Expertise;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {
    Long userId ;
    String username;
    String nom;
    String prenom;
    String email;
    String tel;
    String departement;
    String image;
    Expertise e;
    boolean vote;
}
