package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query("select u from User u where u.username = :x")
    public User findByUserName( @Param("x")String username );

    @Query("select u from User u where u.email = :x")
    public User findByUserEmail( @Param("x")String email );
}
