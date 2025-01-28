package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClasseAnnotationRepository extends JpaRepository<ClasseAnnotation,Long> {
}
