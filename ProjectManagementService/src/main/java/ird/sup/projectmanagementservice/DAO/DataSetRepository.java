package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.DataSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DataSetRepository extends JpaRepository<DataSet,Long> {
        List<DataSet> findByProjetIdIn(List<Long> projetIds);
    }

