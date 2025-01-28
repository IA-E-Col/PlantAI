package ird.sup.projectmanagementservice.Entities.MediaH;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("txte")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Texte extends Media {

    String contenu;
}
