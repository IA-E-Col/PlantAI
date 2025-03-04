package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.username = :x")
    User findByUserName(@Param("x") String username);

    @Query("SELECT u FROM User u WHERE u.email = :x")
    User findByUserEmail(@Param("x") String email);
    
    Optional<User> findByEmail(String email);
}
