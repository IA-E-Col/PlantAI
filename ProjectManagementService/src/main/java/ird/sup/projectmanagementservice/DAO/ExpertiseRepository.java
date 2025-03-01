package ird.sup.projectmanagementservice.DAO;
import ird.sup.projectmanagementservice.Entities.ELevel;
import ird.sup.projectmanagementservice.Entities.Expertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExpertiseRepository  extends JpaRepository<Expertise,Long> {

    Optional<Expertise> findByLevel(ELevel level);
}
