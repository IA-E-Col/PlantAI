package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP;

import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("box")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnBBox extends AnnotationSpecimen {
    float x_max;
    float y_max;
    float x_min;
    float y_min;
}
