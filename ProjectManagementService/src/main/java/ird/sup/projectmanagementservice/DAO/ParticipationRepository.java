package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
}
