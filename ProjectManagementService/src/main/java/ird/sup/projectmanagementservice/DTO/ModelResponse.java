package ird.sup.projectmanagementservice.DTO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.Modele;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelResponse {
    Modele model;
    List<ClasseAnnotation> classes;
    String selectedClass ;

}
