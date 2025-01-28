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
    float Xmax;
    float Ymax;
    float Xmin;
    float Ymin;
}
