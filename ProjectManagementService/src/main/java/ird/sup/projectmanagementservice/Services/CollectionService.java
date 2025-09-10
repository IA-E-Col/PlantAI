package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.Entities.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class CollectionService  {
    @Autowired
    private ProjetRepository pr;
    @Autowired
    private CollectionRepository cr;
    @Autowired
    private SpecimenRepository ps;
    @Autowired
    private DataSetRepository dr;

    public Collection addCollection(Collection c ) {
        c.setDateCreation(new Date());
        return  cr.save(c);
    }

    public Collection updateCollection(Collection c) {
        return cr.save(c);
    }

    public DataSet addSpecimens(Long iDD, List<Specimen> iDS){
        DataSet c = dr.findById(iDD).orElseThrow(() -> new RuntimeException("Dataset not found with id: " + iDD));
        c.setSpecimens(iDS);
        return dr.save(c);
    }

    public DataSet addDataset(Long iDP, DataSet DS){
        try {
            System.out.println("=== ADDING DATASET ===");
            System.out.println("Project ID: " + iDP);
            System.out.println("Dataset name: " + DS.getName());
            System.out.println("Dataset description: " + DS.getDescription());
            
            Projet p = pr.findById(iDP).orElse(null);
            if (p == null) {
                System.err.println("Project not found with ID: " + iDP);
                return null;
            }
            
            System.out.println("Project found: " + p.getNomProjet());
            System.out.println("Project datasets count before: " + p.getDatasets().size());
            
            // Initialize specimens list if null
            if (DS.getSpecimens() == null) {
                DS.setSpecimens(new ArrayList<>());
            }
            
            p.getDatasets().add(DS);
            DS.setProjet(p);
            
            DataSet savedDataset = dr.save(DS);
            System.out.println("Dataset saved with ID: " + savedDataset.getId());
            System.out.println("Project datasets count after: " + p.getDatasets().size());
            
            // Save the project to persist the relationship
            pr.save(p);
            
            return savedDataset;
        } catch (Exception e) {
            System.err.println("Error in addDataset: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public DataSet addSpecimensToDataset(Long IDdataset, List<Long> specimens){
        try {
            System.out.println("=== ADDING SPECIMENS TO DATASET ===");
            System.out.println("Dataset ID: " + IDdataset);
            System.out.println("Number of specimens to add: " + (specimens != null ? specimens.size() : 0));
            
            if (specimens == null || specimens.isEmpty()) {
                System.out.println("No specimens to add");
                return dr.findById(IDdataset).orElse(null);
            }
            
            DataSet d = dr.findById(IDdataset).orElse(null);
            if (d == null) {
                System.err.println("Dataset not found with ID: " + IDdataset);
                return null;
            }
            
            System.out.println("Dataset found: " + d.getName());
            System.out.println("Dataset specimens count before: " + (d.getSpecimens() != null ? d.getSpecimens().size() : 0));
            
            // Initialize specimens list if null
            if (d.getSpecimens() == null) {
                d.setSpecimens(new ArrayList<>());
            }
            
            for(Long specimenId: specimens){
                Specimen s = ps.findById(specimenId).orElse(null);
                if (s != null) {
                    if (s.getDatasets() == null) {
                        s.setDatasets(new ArrayList<>());
                    }
                    s.getDatasets().add(d);
                    d.getSpecimens().add(s);
                    System.out.println("Added specimen ID: " + specimenId);
                } else {
                    System.err.println("Specimen not found with ID: " + specimenId);
                }
            }
            
            DataSet savedDataset = dr.save(d);
            System.out.println("Dataset specimens count after: " + savedDataset.getSpecimens().size());
            System.out.println("=== SPECIMENS ADDED SUCCESSFULLY ===");
            
            return savedDataset;
        } catch (Exception e) {
            System.err.println("Error in addSpecimensToDataset: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }


    public void deleteCollection(Long id) {
        Optional<Collection> collectionOpt = cr.findById(id);
        if (collectionOpt.isPresent()) {
            Collection c = collectionOpt.get();
            System.out.println("Deleting collection: " + c.getNom() + " (ID: " + id + ")");
            
            // TODO: Add cascade delete for related projects and datasets
            // For now, just delete the collection
            cr.deleteById(id);
            System.out.println("Collection deleted successfully");
        } else {
            throw new RuntimeException("Collection not found with id: " + id);
        }
    }

    public Collection findCollectionbyId(Long id) {
        return cr.findById(id).orElse(null);
    }

    public List<Specimen> getSpecimenByCollection(Long id) {
        return cr.findById(id).orElse(null).getSpecimens();
    }

    public List<Collection> getCollections(){
        return this.cr.findAll();
    }

    public Projet getProjet(Long id) {
        Collection c=cr.findById(id).get();
        return null;
    }
}