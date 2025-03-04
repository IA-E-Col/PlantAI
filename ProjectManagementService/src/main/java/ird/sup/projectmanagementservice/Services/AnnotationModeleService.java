package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.DTO.Evaluation;
<<<<<<< HEAD
=======
import ird.sup.projectmanagementservice.Entities.*;
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
<<<<<<< HEAD
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.Vote;

import ird.sup.projectmanagementservice.Entities.User;
=======

>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
import ird.sup.projectmanagementservice.Enums.EState;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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
    @Autowired
    private AnnotationRepository annotationRepository;
    @Autowired
    AnnClassificationRepository annClassificationRepository;
<<<<<<< HEAD

    //public List<AnnClassification> GetAnnHistory
=======
    @Autowired
    private ProjetRepository projetRepository;
    @Autowired
    private DataSetRepository datasetRepository;


    public List<AnnClassification> GetAnnHistory(Long userId, Long dataSetId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé !"));

        List<Long> projetsCreeIds = projetRepository.findProjetsByCreateur(user.getId());

        List<Long> projetsParticipantIds = projetRepository.findProjetsByParticipant(user.getId());

        projetsCreeIds.addAll(projetsParticipantIds);

        if (projetsCreeIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<DataSet> accessibleDataSets = datasetRepository.findByProjetIdIn(projetsCreeIds);

        DataSet selectedDataSet = accessibleDataSets.stream()
                .filter(dataset -> dataset.getId().equals(dataSetId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Dataset avec l'ID " + dataSetId + " non trouvé dans les projets accessibles"));

        List<AnnClassification> annotations = annClassificationRepository.findByEtatInAndProjetIdIn(
                List.of(EState.PENDING),
                projetsCreeIds
        );

        List<AnnClassification> filteredAnnotations = annotations.stream()
                .filter(annotation -> selectedDataSet.getSpecimens().stream()
                        .anyMatch(specimen -> specimen.getAnnotations().contains(annotation))
                )
                .collect(Collectors.toList());

        return filteredAnnotations;
    }
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908

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
        AnnClassification a = annClassificationRepository.findById(id).get();
        return a.getCommentaires();
    }

    public Commentaire addCommentToAnnotation(Long idUser,Long idAnnotation,Commentaire commentaire  ) {
        AnnClassification a = annClassificationRepository.findById(idAnnotation).get();
        User u = userRepository.findById(idUser).get();
        u.getCommentaires().add(commentaire);
        a.getCommentaires().add(commentaire);
<<<<<<< HEAD
       // commentaire.setCreationDate(new Date());
=======
        commentaire.setCreationDate(new Date());
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
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
    public Commentaire updateComment(Long idUser, Long idAnnotation, Long idCommentaire, Commentaire updatedComment) {
        AnnClassification annotation = annClassificationRepository.findById(idAnnotation).orElse(null);
        User user = userRepository.findById(idUser).orElse(null);
        Commentaire commentaire = commentaireRepository.findById(idCommentaire).orElse(null);

        if (annotation == null || user == null || commentaire == null) {
<<<<<<< HEAD
            return null; // Gérer l'erreur selon votre logique
        }

        if (!annotation.getCommentaires().contains(commentaire) || !user.getCommentaires().contains(commentaire)) {
            return null; // Vérification que le commentaire appartient bien à l'utilisateur et à l'annotation
=======
            return null;
        }

        if (!annotation.getCommentaires().contains(commentaire) || !user.getCommentaires().contains(commentaire)) {
            return null;
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
        }

        commentaire.setCommentaire(updatedComment.getCommentaire());
        return commentaireRepository.save(commentaire);
    }

    public boolean deleteComment(Long idUser, Long idAnnotation, Long idCommentaire) {
        AnnClassification annotation = annClassificationRepository.findById(idAnnotation).orElse(null);
        User user = userRepository.findById(idUser).orElse(null);
        Commentaire commentaire = commentaireRepository.findById(idCommentaire).orElse(null);

        System.out.println("Annotation trouvée : " + (annotation != null));
        System.out.println(idAnnotation);
        System.out.println("Utilisateur trouvé : " + (user != null));
        System.out.println("Commentaire trouvé : " + (commentaire != null));

        if (annotation==null || user == null || commentaire == null) {
            return false;
        }

        System.out.println("Annotation contient commentaire : " + annotation.getCommentaires().contains(commentaire));
        System.out.println("Utilisateur contient commentaire : " + user.getCommentaires().contains(commentaire));

        if (!annotation.getCommentaires().contains(commentaire) || !user.getCommentaires().contains(commentaire)) {
            return false;
        }

        annotation.getCommentaires().remove(commentaire);
        user.getCommentaires().remove(commentaire);
        commentaireRepository.delete(commentaire);
        return true;
    }


}
