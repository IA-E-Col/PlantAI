package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Enums.EState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface AnnClassificationRepository extends JpaRepository<AnnClassification,Long> {
    @Query("SELECT a FROM AnnClassification a " +
            "WHERE a.etat IN :etats " +
            "AND a.dataset.projet.Id IN :projetIds")
    List<AnnClassification> findByEtatInAndProjetIdIn(
            List<EState> etats,
            List<Long> projetIds
    );


}
