package ird.sup.projectmanagementservice.DAO;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import ird.sup.projectmanagementservice.Entities.EmailToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import ird.sup.projectmanagementservice.Entities.EmailToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface EmailTokenRepository extends JpaRepository<EmailToken, Integer> {
    
    // Cette méthode recherche un EmailToken par la valeur de son champ emailToken
    Optional<EmailToken> findByEmailToken(String emailToken);

}
