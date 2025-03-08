package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.DTO.UserWithExpertiseDTO;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.Projet;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProjetRepository extends JpaRepository<Projet,Long> {
    @Query("select u from Projet u where u.createur.id = :x")
    List<Projet> findPrjByIdC(@Param("x") Long Id);

    @Query("SELECT u " +
            "FROM User u " +
            "WHERE u.id NOT IN (" +
            "    SELECT p.user.id " +
            "    FROM Participation p " +
            "    WHERE p.projet.Id = :projectId" +
            ") " +
            "AND u.id NOT IN (" +
            "    SELECT pr.createur.id " +
            "    FROM Projet pr " +
            "    WHERE pr.Id = :projectId" +
            ")")
    List<User> findUsersNotInProject(@Param("projectId") Long projectId);

    @Query("SELECT new ird.sup.projectmanagementservice.DTO.UserWithExpertiseDTO(u.id, u.username,u.nom, u.prenom, u.email," +
            "u.tel,u.departement,u.image, part.expertise)" +
            "FROM User u " +
            "JOIN Participation part ON part.user.id = u.id " +
            "JOIN part.projet p " +
            "WHERE p.Id = :projectId")
    List<UserWithExpertiseDTO> findUsersInProject(@Param("projectId") Long projectId);


    @Query("SELECT p.Id FROM Projet p WHERE p.createur.id = :userId")
    List<Long> findProjetsByCreateur(@Param("userId") Long userId);

    @Query("SELECT p.Id FROM Projet p JOIN p.participations part WHERE part.user.id = :userId")
    List<Long> findProjetsByParticipant(@Param("userId") Long userId);

    @Query("select a from AnnClassification a where a.dataset.id = :datasetId and a.etat = 'PENDING'")
    List<AnnClassification> findPendingAnnotationByDataset(@Param("datasetId") Long datasetId);
}