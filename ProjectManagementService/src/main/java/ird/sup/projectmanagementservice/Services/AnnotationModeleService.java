package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnBBox;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class AnnotationModeleService {
    @Autowired
    private AnnotationModeleRepository annModeleRepository;
    @Autowired
    private ClasseAnnotationRepository classeAnnotationRepository;
    @Autowired
    private AnnotationSpecimenRepository annRepository;
    @Autowired
    private AnnotationSpecimenRepository annotationSpecimenRepository;
    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AnnotationRepository annotationRepository;
    @Autowired
    AnnClassificationRepository annClassificationRepository;

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
        AnnotationSpecimen a = annRepository.findById(id).get();
        return a.getCommentaires();
    }

    public Commentaire addCommentToAnnotation(Long idUser,Long idAnnotation,Commentaire commentaire  ) {
        AnnotationSpecimen a = annotationSpecimenRepository.findById(idAnnotation).get();
        User u = userRepository.findById(idUser).get();
        u.getCommentaires().add(commentaire);
        a.getCommentaires().add(commentaire);
        commentaire.setAnnotation(a);
        commentaire.setCreateurC(u);
        return commentaireRepository.save(commentaire);

    }
    public Commentaire updateComment(Long idUser, Long idAnnotation, Long idCommentaire, Commentaire updatedComment) {
        AnnotationSpecimen annotation = annotationSpecimenRepository.findById(idAnnotation).orElse(null);
        User user = userRepository.findById(idUser).orElse(null);
        Commentaire commentaire = commentaireRepository.findById(idCommentaire).orElse(null);

        if (annotation == null || user == null || commentaire == null) {
            return null; // Gérer l'erreur selon votre logique
        }

        if (!annotation.getCommentaires().contains(commentaire) || !user.getCommentaires().contains(commentaire)) {
            return null; // Vérification que le commentaire appartient bien à l'utilisateur et à l'annotation
        }

        commentaire.setCommentaire(updatedComment.getCommentaire());
        return commentaireRepository.save(commentaire);
    }

    public boolean deleteComment(Long idUser, Long idAnnotation, Long idCommentaire) {
        AnnotationSpecimen annotation = annotationSpecimenRepository.findById(idAnnotation).orElse(null);
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
