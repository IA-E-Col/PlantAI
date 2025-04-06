package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.MediaH.Media;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.Specimen;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("classi")
@Data
public class AnnClassification extends AnnotationSpecimen {
    private String valeurPredite;
    private float valeurPrecision;
    private String valeurCorrecte;
    @ManyToOne
    @JsonIgnore
    private Modele modelInference;

    public AnnClassification(String libelle, float valeurPrecision, String valeurPredite, Media media, Modele modelInference, DataSet dataset) {
        this.libelle = libelle;
        this.valeurPredite = valeurPredite;
        this.valeurPrecision = valeurPrecision;
        this.modelInference = modelInference;
        this.dataset = dataset;
        this.media = media;
    }

    public Modele getModel() {
        return this.modelInference;
    }
    public String getClasse() {
        System.out.println(this.modelInference.getAnnotation().getClasseAnnotationS().size());
        for (ClasseAnnotation c : this.modelInference.getAnnotation().getClasseAnnotationS())
        {   System.out.println(c.getIdentifier());
            System.out.println(this.valeurPredite);
            System.out.println(c.getIdentifier().compareTo(this.valeurPredite));
            if(c.getIdentifier().compareTo(this.valeurPredite)==0)
                return c.getName();
        }
        return null;
    }
    @OneToMany(fetch=FetchType.EAGER,mappedBy = "annotation",cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<Commentaire> commentaires ;



}
