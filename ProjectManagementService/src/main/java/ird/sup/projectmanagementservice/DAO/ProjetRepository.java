package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.Projet;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjetRepository extends JpaRepository<Projet,Long> {
    @Query("select u from Projet u where u.createur.Id = :x")
    public List<Projet> findPrjByIdC(@Param("x")Long Id);

    @Query("SELECT u FROM User u WHERE u.Id NOT IN " +
            "(SELECT cu.Id FROM Projet p JOIN p.collaborateurs cu WHERE p.Id = :projectId) " +
            "AND u.Id <> (SELECT p.createur.Id FROM Projet p WHERE p.Id = :projectId)")
    List<User> findUsersNotInProject(@Param("projectId") Long projectId);

    @Query("SELECT u FROM User u " +
            "WHERE u.Id IN (SELECT cu.Id FROM Projet p JOIN p.collaborateurs cu WHERE p.Id = :projectId) " +
            "OR u.Id = (SELECT p.createur.Id FROM Projet p WHERE p.Id = :projectId)")
    List<User> findUsersInProject(@Param("projectId") Long projectId);
}
