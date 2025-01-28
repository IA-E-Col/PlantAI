package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.DataSetRepository;
import ird.sup.projectmanagementservice.Entities.DataSet;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;
import java.util.Optional;

@Service
public class DatasetService {

    @Autowired
    private DataSetRepository dataSetRepository;

    public List<DataSet> getAllDataSets() {
        return dataSetRepository.findAll();
    }

    public Optional<DataSet> getDataSetById(Long id) {
        return dataSetRepository.findById(id);
    }

    public DataSet createDataSet(DataSet dataSet) {
        return dataSetRepository.save(dataSet);
    }

    public Optional<DataSet> updateDataSet(Long id, DataSet dataSetDetails) {
        return dataSetRepository.findById(id).map(dataSet -> {
            dataSet.setName(dataSetDetails.getName());
            dataSet.setDescription(dataSetDetails.getDescription());
            dataSet.setFiltres(dataSetDetails.getFiltres());
            dataSet.setSpecimens(dataSetDetails.getSpecimens());
            return dataSetRepository.save(dataSet);
        });
    }

    public boolean deleteDataSet(Long id) {

        DataSet dataSet= dataSetRepository.findById(id).get();
        System.out.println("DataSet dataSet= dataSetRepository.findById(id).get();");
       // dataSet.setCollection(null);
        System.out.println("dataSet.setCollection(null);");
        dataSet.setFiltres(null);
        System.out.println("dataSet.setFiltres(null);");
        dataSet.setSpecimens(null);
        System.out.println("dataSet.setSpecimens(null);");
        dataSet.setProjet(null);
        dataSetRepository.save(dataSet);
        System.out.println("dataSetRepository.save(dataSet);");
        dataSetRepository.delete(dataSet);
        System.out.println("dataSetRepository.delete(dataSet);");
        return true;
    }
}
