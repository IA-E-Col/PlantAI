package ird.sup.projectmanagementservice.DAO;
import ird.sup.projectmanagementservice.Entities.EmailToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmailTokenRepository extends JpaRepository<EmailToken, Long> {
    Optional<EmailToken> findByEmailToken(String emailToken);
}