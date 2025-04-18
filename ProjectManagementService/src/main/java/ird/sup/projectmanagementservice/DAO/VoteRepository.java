package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.DTO.Evaluation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.Entities.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Vote findByAnnotationAndUser(AnnClassification annotation, User user);
    @Query("SELECT new ird.sup.projectmanagementservice.DTO.Evaluation(u.id, u.username,u.nom, u.prenom, u.email," +
            "u.tel,u.departement,u.image, part.expertise, v.value)" +
            "FROM User u " +
            "JOIN Participation part ON part.user.id = u.id " +
            "JOIN part.projet p " +
            "JOIN Vote v ON v.user.id = u.id " +
            "WHERE p.Id = :projectId AND v.annotation.id = :annotationId")
    List<Evaluation> findEvaluationByAnnotation(@Param("annotationId") Long annotationId,@Param("projectId") Long projetId);
}
