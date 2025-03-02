package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.DTO.Evaluation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Vote;
import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.Enums.EState;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnnotationModeleService {
    @Autowired
    private AnnotationModeleRepository annModeleRepository;
    @Autowired
    private ClasseAnnotationRepository classeAnnotationRepository;
    @Autowired
    private AnnotationSpecimenRepository annRepository;
    @Autowired
    private AnnClassificationRepository annotationClassificationRepository;
    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VoteRepository voteRepository;
    public List<AnnotationModele> getAllModels() {
        return annModeleRepository.findAll();
    }

    public AnnotationModele getModelById(Long id) {
        return annModeleRepository.findById(id).orElse(null);
    }

    public AnnotationModele createModel(AnnotationModele annModel) {
        return annModeleRepository.save(annModel);
    }

    public ClasseAnnotation createClasseAnnotation(ClasseAnnotation classeAnnotation) {
        return classeAnnotationRepository.save(classeAnnotation);
    }

    public AnnotationModele updateModel( AnnotationModele updatedModel) {

        if (updatedModel != null) {
            AnnotationModele existingAnnModel =  updatedModel;
            return annModeleRepository.save(existingAnnModel);
        } else
            return null;

    }

    public List<ClasseAnnotation> getAllClasses() {
        return classeAnnotationRepository.findAll();
    }

    public List<Commentaire> getcomments(Long id) {
        AnnotationSpecimen a = annRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("AnnotationSpecimen not found"));
        List<Commentaire> commentaires = a.getCommentaires();
        commentaires.sort(Comparator.comparing(Commentaire::getCreationDate));
        return commentaires;
    }

    public Commentaire addCommentToAnnotation(Long idUser,Long idAnnotation,Commentaire commentaire  ) {
        AnnotationSpecimen a = annRepository.findById(idAnnotation).get();
        User u = userRepository.findById(idUser).get();
        u.getCommentaires().add(commentaire);
        a.getCommentaires().add(commentaire);
        commentaire.setCreationDate(new Date());
        commentaire.setAnnotation(a);
        commentaire.setCreateurC(u);
        return commentaireRepository.save(commentaire);

    }

    public Evaluation voteForAnnotation(Long id,AnnClassification ann, User user, boolean value) {
        Vote vote = new Vote(id,user,value,ann);
        voteRepository.save(vote);
        System.out.println(user.getId());
        List<Evaluation> evaluations = voteRepository
                .findEvaluationByAnnotation(ann.getId(), ann.getDataset().getProjet().getId());
        for (Evaluation evaluation : evaluations) {
            if (Objects.equals(evaluation.getUserId(), user.getId())) {
                return evaluation;
            }
        }
        return null;
    }

    public AnnClassification updateState(AnnClassification annotation, String state) {
        if (annotation.getEtat() == EState.PENDING)
            annotation.setEtat(EState.valueOf(state));
        return annotationClassificationRepository.save(annotation);
    }
}
