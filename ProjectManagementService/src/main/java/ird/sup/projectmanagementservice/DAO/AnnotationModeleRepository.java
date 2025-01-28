package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnBBox;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnotationModeleRepository extends JpaRepository<AnnotationModele,Long> {
}
