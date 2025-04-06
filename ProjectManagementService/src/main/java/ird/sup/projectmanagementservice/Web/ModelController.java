package ird.sup.projectmanagementservice.Web;


import ird.sup.projectmanagementservice.DAO.CollectionRepository;
import ird.sup.projectmanagementservice.DAO.ModeleRepository;
import ird.sup.projectmanagementservice.DTO.Message;
import ird.sup.projectmanagementservice.DTO.ModelResponse;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.Specimen;
import ird.sup.projectmanagementservice.Services.CollectionService;
import ird.sup.projectmanagementservice.Services.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/models")
public class ModelController {
    @Autowired
    ModelService modelService;
    @Autowired
    ModeleRepository modeleRepository;
    @Autowired
    private CollectionRepository collectionRepository;
    @Autowired
    private CollectionService collectionService;

    @GetMapping("/")
    public List<Modele> getAllModels() {
        return modelService.getAllModels();
    }

    @GetMapping("/forFiltre")
    public List<ModelResponse> getAllModelsForFiltre() {
        List<ModelResponse> modelResponses = new ArrayList<>();
       List<Modele> modeles = modelService.getAllModels();
       for (Modele modele : modeles) {
           ModelResponse modelResponse = new ModelResponse();
           modelResponse.setModel(modele);
           modelResponse.setClasses(modele.getAnnotation().getClasseAnnotationS());
           modelResponses.add(modelResponse);
       }
       return modelResponses;
    }

    @GetMapping("/{id}")
    public Modele getModelById(@PathVariable Long id) {
        return modelService.getModelById(id);
    }

    @PostMapping("/addModel")
    public Modele createModel(@RequestBody Modele model) {
        return modelService.createModel(model);
    }
    @PostMapping("/addClasseToModel/{idModel}")
    public Modele addClassesToModel(@RequestBody List<String> classes,@PathVariable Long idModel) {
        return modelService.addClassesToModel(idModel,classes);
    }
    @PutMapping("/{id}")
    public Modele updateModel(@PathVariable Long id, @RequestParam Modele updatedModel) {
        return modelService.updateModel(id, updatedModel);
    }
    @GetMapping("/{idModele}/classes")
    public List<ClasseAnnotation> updateModel(@PathVariable Long idModele) {
        return modelService.getAllClasses(idModele);
    }

    @GetMapping("/predict/{idDataset}/{idSpecimen}/{idModele}")
    public AnnClassification predict(@PathVariable Long idDataset,@PathVariable Long idSpecimen, @PathVariable String idModele) {
       // System.out.println(idSpecimen);
       // System.out.println(idModele);

        AnnClassification prediction = modelService.predictImage(idDataset,Long.valueOf(idModele),idSpecimen);
        System.out.println(prediction.getId()+" "+prediction.getValeurPredite());
        if (prediction != null) {
            return prediction;
        } else {
            return null;
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModel(@PathVariable Long id) {
        System.out.println("EXPOSED API");
        Optional<Modele> model = Optional.ofNullable(modelService.getModelById(id));

        if (model.isPresent()) {
            this.modeleRepository.deleteById(id);
            return ResponseEntity.ok().body(model.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("Model Not Found !"));

    }

    @GetMapping("/predictDataset/{idS}/{idM}")
    public ResponseEntity<ArrayList<Annotation>> predictDataset(@PathVariable Long idM, @PathVariable Long idS) {
        System.out.println(idM);
        System.out.println(idS);
        ArrayList<Annotation> predictions = modelService.predictForDataset(idM, idS);
        System.out.println(predictions.size());;
        if (predictions != null) {
            return new ResponseEntity<>(predictions, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



}
