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

import java.util.List;

@RestController
@CrossOrigin(origins="*")
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
            @RequestPart("Description") String description
            ) {

        Collection iDC = new Collection();
        iDC.setNom(nom);
        iDC.setDescription(description);


        // Vous pouvez également traiter le fichier collectionFile ici si nécessaire

        System.out.println(iDC.getNom());
        if (iDC != null) {
            Collection newCollection = collectionService.addCollection(iDC);
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
        datasetService.deleteDataSet(id);
        return ResponseEntity.ok().build();
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
        DataSet dataset = datasetService.getDataSetById(id).get();
        if (dataset != null) {
            return ResponseEntity.ok(dataset);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/Datasets")
    public ResponseEntity<List<DataSet>> findDatasetByCollections(@PathVariable Long id) {
        Collection collection = collectionService.findCollectionbyId(id);
        if (collection.getDatasets() != null) {
            return ResponseEntity.ok(collection.getDatasets());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/Specimens")
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
        DataSet dataSet = datasetService.getDataSetById(id).get();
        if (dataSet.getSpecimens() != null) {
            return ResponseEntity.ok(dataSet.getSpecimens());
        } else {
            return ResponseEntity.notFound().build();
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
