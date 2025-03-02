package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

  @Query("select t from Token t where t.user.id = :id and (t.expired = false or t.revoked = false)")
  List<Token> findAllValidTokenByUser(@Param("id") Long id);

  Optional<Token> findByToken(String token);
}
