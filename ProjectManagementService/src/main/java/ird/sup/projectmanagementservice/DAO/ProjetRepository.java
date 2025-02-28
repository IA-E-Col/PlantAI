package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.DTO.UserWithExpertiseDTO;
import ird.sup.projectmanagementservice.Entities.Projet;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjetRepository extends JpaRepository<Projet,Long> {
    @Query("select u from Projet u where u.createur.Id = :x")
    List<Projet> findPrjByIdC(@Param("x") Long Id);

    @Query("SELECT u " +
            "FROM User u " +
            "WHERE u.Id NOT IN (" +
            "    SELECT p.user.Id " +
            "    FROM Participation p " +
            "    WHERE p.projet.Id = :projectId" +
            ") " +
            "AND u.Id NOT IN (" +
            "    SELECT pr.createur.Id " +
            "    FROM Projet pr " +
            "    WHERE pr.Id = :projectId" +
            ")")
    List<User> findUsersNotInProject(@Param("projectId") Long projectId);

    @Query("SELECT new ird.sup.projectmanagementservice.DTO.UserWithExpertiseDTO(u.Id, u.username,u.nom, u.prenom, u.email," +
            "u.Tel,u.Departement,u.image, part.expertise.level)" +
            "FROM User u " +
            "JOIN Participation part ON part.user.Id = u.Id " +
            "JOIN part.projet p " +
            "WHERE p.Id = :projectId")
    List<UserWithExpertiseDTO> findUsersInProject(@Param("projectId") Long projectId);
}
