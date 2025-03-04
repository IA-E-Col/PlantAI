package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.DAO.AnnClassificationRepository;
import ird.sup.projectmanagementservice.DAO.ProjetRepository;
import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.DAO.VoteRepository;
import ird.sup.projectmanagementservice.DTO.Evaluation;
import ird.sup.projectmanagementservice.DTO.Message;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.Entities.Vote;
import ird.sup.projectmanagementservice.Enums.EState;
import ird.sup.projectmanagementservice.Services.AnnotationModeleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/annotationModele")
public class AnnotationModeleController {
    @Autowired
    AnnotationModeleService annotationModeleService;
    @Autowired
    AnnClassificationRepository annotationClassificationrepository;
    @Autowired
    private ProjetRepository projetRepository;
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/history/{userId}/{dataSetId}")
    public List<AnnClassification> getAnnHistory(@PathVariable Long userId, @PathVariable Long dataSetId) {
        return annotationModeleService.GetAnnHistory(userId, dataSetId);
    }

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
    @PutMapping("/{idUser}/{idAnnotation}/{idCommentaire}/updateComment")
    public Commentaire updateComment(
            @PathVariable Long idUser,
            @PathVariable Long idAnnotation,
            @PathVariable Long idCommentaire,
            @RequestBody Commentaire updatedComment) {
        return annotationModeleService.updateComment(idUser, idAnnotation, idCommentaire, updatedComment);
    }

    @DeleteMapping("/{idUser}/{idAnnotation}/{idCommentaire}/deleteComment")
    public boolean deleteComment(@PathVariable Long idUser, @PathVariable Long idAnnotation, @PathVariable Long idCommentaire) {
        System.out.println("DELETE /api/annotationModele/" + idUser + "/" + idAnnotation + "/" + idCommentaire + "/deleteComment");
        return annotationModeleService.deleteComment(idUser, idAnnotation, idCommentaire);
    }


    @PutMapping("/updateAnnotationSpecimen")
    public AnnotationSpecimen addCommentToAnnotation(@RequestBody AnnClassification annotation) {
        AnnClassification a=annotationClassificationrepository.findById(annotation.getId()).get();
        a.setValeurCorrecte(annotation.getValeurCorrecte());
        a.setEtat(EState.PENDING);
        return annotationClassificationrepository.save(a);
    }

    @PutMapping("update/{id}")
    public AnnotationModele updateModel(@PathVariable Long id, @RequestParam AnnotationModele updatedAnnModel) {

        return annotationModeleService.updateModel(updatedAnnModel);
    }

    @PutMapping("{idAnnotation}/{idUser}/vote")
    public ResponseEntity<?> voteForAnnotation(@RequestBody Vote vote, @PathVariable Long idAnnotation, @PathVariable Long idUser) {
        Optional<AnnClassification> annotation = annotationClassificationrepository.findById(idAnnotation);
        if (annotation.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("Annotation not found!"));
        if (!annotation.get().getEtat().equals(EState.PENDING))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new Message("Annotation already validated!"));
        Optional<User> user = userRepository.findById(idUser);
        if (user.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("User not found!"));
        List<User> users = projetRepository.findUsersNotInProject(annotation.get().getDataset().getProjet().getId());
        System.out.println("DatasetId: " + annotation.get().getDataset().getId());
        System.out.println("projectId:" + annotation.get().getDataset().getProjet().getId());
        if (users.stream().anyMatch(u -> u.getId().equals(user.get().getId())))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Message("This user does not belong to the project!"));
        Vote v = voteRepository.findByAnnotationAndUser(annotation.get(), user.get());
        Long voteId = v != null ? v.getId() : null;
        Evaluation evaluation = annotationModeleService.voteForAnnotation(voteId, annotation.get(), user.get(),vote.isValue());
        if (evaluation == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Message("Some Error Happened!"));
        return ResponseEntity.status(HttpStatus.OK).body(evaluation);
    }
    @GetMapping("{idAnnotation}/evaluation")
    public ResponseEntity<?> getCurrentEvaluation(@PathVariable Long idAnnotation) {

        Optional<AnnClassification> annotation = annotationClassificationrepository.findById(idAnnotation);
        if (annotation.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("Annotation not found!"));
        List<Evaluation> evaluations = voteRepository.findEvaluationByAnnotation(annotation.get().getId(),annotation.get().getDataset().getProjet().getId());
        return ResponseEntity.ok().body(evaluations);

    }
    @GetMapping("{idAnnotation}/state")
    public ResponseEntity<?> getCurrentEvaluation(@PathVariable Long idAnnotation,@RequestParam String state ) {

        Optional<AnnClassification> annotation = annotationClassificationrepository.findById(idAnnotation);
        if (annotation.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("Annotation not found!"));
        if (!annotation.get().getEtat().equals(EState.PENDING))
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Message("Annotation already treated!"));
        for (EState s : EState.values()) {
            if (s.name().equals(state)) {
                AnnClassification annotationResult = annotationModeleService.updateState(annotation.get(),state);
                return ResponseEntity.ok().body(annotationResult);
            }
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Message("Unmatching state value!"));
    }
}
