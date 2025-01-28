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

    /*
    @Query("SELECT DISTINCT p FROM Projet p JOIN p.collaborateurs c WHERE p.createur.id = :x OR c.id = :x")
    List<Projet> findPrjByIdC(@Param("x") Long Id);
     */
}
