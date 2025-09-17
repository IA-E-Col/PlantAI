package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClasseAnnotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Integer identifier;
    String name;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private AnnotationModele annotationModele;
}
