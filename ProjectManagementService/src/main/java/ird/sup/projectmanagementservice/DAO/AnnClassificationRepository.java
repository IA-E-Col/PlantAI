package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnClassificationRepository extends JpaRepository<AnnClassification,Long> {
}
