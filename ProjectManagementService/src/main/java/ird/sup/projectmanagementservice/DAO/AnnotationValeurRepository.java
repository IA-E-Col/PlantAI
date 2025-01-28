package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationValeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnotationValeurRepository extends JpaRepository<AnnotationValeur,Long> {
}
