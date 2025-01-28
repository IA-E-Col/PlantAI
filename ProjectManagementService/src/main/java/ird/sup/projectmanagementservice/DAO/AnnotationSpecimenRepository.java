package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnotationSpecimenRepository extends JpaRepository<AnnotationSpecimen,Long> {
}
