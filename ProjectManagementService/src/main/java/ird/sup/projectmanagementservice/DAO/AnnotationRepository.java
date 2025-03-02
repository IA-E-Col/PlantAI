package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnotationRepository extends JpaRepository<Annotation,Long> {
}
