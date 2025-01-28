package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.DAO.AnnClassificationRepository;
import ird.sup.projectmanagementservice.DAO.AnnotationSpecimenRepository;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Services.AnnotationModeleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/annotationModele")
public class AnnotationModeleController {
    @Autowired
    AnnotationModeleService annotationModeleService;
    @Autowired
    AnnClassificationRepository annotationClassificationrepository;

    @GetMapping("/getAllClasse")
    public List<ClasseAnnotation> getAllclasses() {
        return annotationModeleService.getAllClasses();
    }

    @GetMapping("/{id}")
    public AnnotationModele getClasseById(@PathVariable Long id) {
        return annotationModeleService.getModelById(id);
    }


    @PostMapping("/addClasse")
    public ClasseAnnotation createClasse(@RequestBody ClasseAnnotation classeAnnotation) {
        return annotationModeleService.createClasseAnnotation(classeAnnotation);
    }
   @GetMapping("/{idannotation}/comments")
    public List<Commentaire> getComments(@PathVariable Long idannotation) {
        return annotationModeleService.getcomments(idannotation);
    }


    @PostMapping("/{idAnnotation}/{idUser}/addComment")
    public Commentaire addCommentToAnnotation(@RequestBody Commentaire commentaire,@PathVariable Long idAnnotation,@PathVariable Long idUser) {
        System.out.println("commentaire "+commentaire.getCommentaire());
        return annotationModeleService.addCommentToAnnotation(idUser,idAnnotation,commentaire);
    }
    @PutMapping("/updateAnnotationSpecimen")
    public AnnotationSpecimen addCommentToAnnotation(@RequestBody AnnClassification annotation) {
        AnnClassification a=annotationClassificationrepository.findById(annotation.getId()).get();
        a.setValeurCorrecte(annotation.getValeurCorrecte());
        a.setValide(annotation.isValide());
       return annotationClassificationrepository.save(a);
    }

    @PutMapping("update/{id}")
    public AnnotationModele updateModel(@PathVariable Long id, @RequestParam AnnotationModele updatedAnnModel) {

        return annotationModeleService.updateModel(updatedAnnModel);
    }


}
