package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnotationValeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String valeurPredite;
    String valeurCorrecte;
    String modeAquisition;
    boolean isValide;

}
