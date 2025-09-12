package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.DAO.CollectionRepository;
import ird.sup.projectmanagementservice.Entities.Collection;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.Projet;
import ird.sup.projectmanagementservice.Entities.Specimen;
import ird.sup.projectmanagementservice.Services.CollectionService;
import ird.sup.projectmanagementservice.Services.DatasetService;
import ird.sup.projectmanagementservice.Services.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;
    @Autowired
    private DatasetService datasetService;
    @Autowired
    private ProjetService ps;
    @Autowired
    private CollectionRepository cr;
   /* @PostMapping("/addCollection")
    public ResponseEntity<Collection> addCollection(@RequestBody Collection iDC ) {
       System.out.println(iDC.getNom());
        if( iDC !=null) {
            Collection newCollection = collectionService.addCollection(iDC);
            //Collection NVC = collectionService.addSpecimens(newCollection.getId(), iDC.getSpecimens());
            return ResponseEntity.ok(newCollection);
        }
        return ResponseEntity.notFound().build();
    }*/

    @PostMapping("/addCollection")
    public ResponseEntity<Collection> addCollection(
            @RequestPart("nom") String nom,
            @RequestPart("Description") String description,
            Principal principal
            ) {

        Collection iDC = new Collection();
        iDC.setNom(nom);
        iDC.setDescription(description);


        // Vous pouvez également traiter le fichier collectionFile ici si nécessaire

        System.out.println(iDC.getNom());
        if (iDC != null) {
            Collection newCollection = collectionService.addCollection(iDC, principal);
            return ResponseEntity.ok(newCollection);
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping("/addDataset/{PId}")
    public ResponseEntity<DataSet> addDataset(@RequestBody DataSet iDD, @PathVariable Long PId) {
        Projet p =  ps.findProjetbyId(PId);
        System.out.println("ici je vais recupere le projet"+p.getId());
        if( p!=null) {
            DataSet newDataset = collectionService.addDataset(PId, iDD);
            System.out.println("ici c'est le dataset cree"+newDataset.getId());
            //Collection NVC = collectionService.addSpecimens(newDataset.getId(), iDD.getSpecimens());
            return ResponseEntity.ok(newDataset);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/addSpecimensToDataset/{IDdataset}")
    public ResponseEntity<DataSet> addSpecimensToDataset(@RequestBody List<Long> specimens, @PathVariable Long IDdataset) {

        if( IDdataset!=null) {
            DataSet newDataset = collectionService.addSpecimensToDataset(IDdataset, specimens);
            System.out.println("ici apres ajout de specimens to dataset"+newDataset.getId());
            return ResponseEntity.ok(newDataset);
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/update")
    public ResponseEntity<Collection> updateCollection(@RequestBody Collection collection) {
        Collection updatedCollection = collectionService.updateCollection(collection);
        return ResponseEntity.ok(updatedCollection);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        try {
            collectionService.deleteCollection(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting collection: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Collection> findCollectionById(@PathVariable Long id) {
        Collection collection = collectionService.findCollectionbyId(id);
        if (collection != null) {
            return ResponseEntity.ok(collection);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dataset/{id}")
    public ResponseEntity<DataSet> findDatasetById(@PathVariable Long id) {
        Optional<DataSet> datasetOpt = datasetService.getDataSetById(id);
        if (datasetOpt.isPresent()) {
            DataSet dataset = datasetOpt.get();
            // Set the specimen count without loading specimens
            int specimenCount = datasetService.getSpecimenCount(id);
            dataset.setNumberOfSpecimen(specimenCount);
            return ResponseEntity.ok(dataset);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/Datasets")
    public ResponseEntity<List<DataSet>> findDatasetByCollections(@PathVariable Long id) {
        Collection collection = collectionService.findCollectionbyId(id);
        if (collection != null && collection.getProjets() != null) {
            List<DataSet> allDatasets = new ArrayList<>();
            for (Projet projet : collection.getProjets()) {
                if (projet.getDatasets() != null) {
                    allDatasets.addAll(projet.getDatasets());
                }
            }
            return ResponseEntity.ok(allDatasets);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/specimen")
    public ResponseEntity<List<Specimen>> findSpecienByCollections(@PathVariable Long id) {
        Collection collection = collectionService.findCollectionbyId(id);
        if (collection.getSpecimens() != null) {
            return ResponseEntity.ok(collection.getSpecimens());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/Dataset/{id}/specimen")
    public ResponseEntity<List<Specimen>> findSpecimensByDataset(@PathVariable Long id) {
        Optional<DataSet> dataSetOpt = datasetService.getDataSetById(id);
        if (dataSetOpt.isPresent() && dataSetOpt.get().getSpecimens() != null) {
            return ResponseEntity.ok(dataSetOpt.get().getSpecimens());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateDataset/{id}")
    public ResponseEntity<DataSet> updateDataset(@PathVariable Long id, @RequestBody DataSet dataset) {
        try {
            System.out.println("=== UPDATING DATASET ===");
            System.out.println("Dataset ID: " + id);
            System.out.println("Dataset name: " + dataset.getName());
            System.out.println("Dataset description: " + dataset.getDescription());
            
            Optional<DataSet> existingDatasetOpt = datasetService.getDataSetById(id);
            if (!existingDatasetOpt.isPresent()) {
                System.err.println("Dataset not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            DataSet existingDataset = existingDatasetOpt.get();
            existingDataset.setName(dataset.getName());
            existingDataset.setDescription(dataset.getDescription());
            
            DataSet updatedDataset = datasetService.saveDataSet(existingDataset);
            System.out.println("Dataset updated successfully: " + updatedDataset.getId());
            
            return ResponseEntity.ok(updatedDataset);
        } catch (Exception e) {
            System.err.println("Error updating dataset: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/deleteDataset/{id}")
    public ResponseEntity<Void> deleteDataset(@PathVariable Long id) {
        try {
            System.out.println("=== DELETING DATASET ===");
            System.out.println("Dataset ID: " + id);
            
            Optional<DataSet> datasetOpt = datasetService.getDataSetById(id);
            if (!datasetOpt.isPresent()) {
                System.err.println("Dataset not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            datasetService.deleteDataSet(id);
            System.out.println("Dataset deleted successfully: " + id);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting dataset: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Collection>> getCollections() {
        List<Collection> collections = collectionService.getCollections();
        return ResponseEntity.ok(collections);
    }

    @GetMapping("/{id}/projet")
    public ResponseEntity<Projet> getProjet(@PathVariable Long id) {
        Projet projet = collectionService.getProjet(id);
        if (projet != null) {
            return ResponseEntity.ok(projet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
