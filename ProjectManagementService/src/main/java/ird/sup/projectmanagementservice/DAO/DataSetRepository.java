package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.DataSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DataSetRepository extends JpaRepository<DataSet,Long> {
        List<DataSet> findByProjetIdIn(List<Long> projetIds);
        
        @Query("SELECT COUNT(s) FROM DataSet d JOIN d.specimens s WHERE d.id = :datasetId")
        int countSpecimensByDatasetId(@Param("datasetId") Long datasetId);
    }

