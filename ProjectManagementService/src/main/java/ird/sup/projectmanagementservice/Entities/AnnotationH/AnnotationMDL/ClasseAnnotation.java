package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class ClasseAnnotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String identifier;
    String name;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private AnnotationModele annotationModele;
}
