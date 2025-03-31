package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionRepository extends JpaRepository<Collection,Long>{}

