package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP;

import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("txt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnTexte extends AnnotationSpecimen {
    String contenu;
}
