package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.DataSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataSetRepository extends JpaRepository<DataSet,Long> {
}
