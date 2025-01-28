package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
@Entity
@Data
@NoArgsConstructor
@DiscriminatorValue("modele")
public class AnnotationModele extends Annotation {
    @OneToMany(fetch= FetchType.LAZY, mappedBy="annotationModele", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ClasseAnnotation> classeAnnotationS= new ArrayList<>();
}
