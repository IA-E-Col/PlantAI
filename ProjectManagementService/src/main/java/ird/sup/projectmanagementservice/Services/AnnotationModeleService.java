package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
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
}
