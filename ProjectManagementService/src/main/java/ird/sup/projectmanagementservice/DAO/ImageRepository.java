package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.MediaH.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image,Long> {
}
