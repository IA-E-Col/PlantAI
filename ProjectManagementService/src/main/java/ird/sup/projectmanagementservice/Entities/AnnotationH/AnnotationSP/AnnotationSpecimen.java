package ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.MediaH.Media;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Enums.EState;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_annotation", discriminatorType = DiscriminatorType.STRING)
@NoArgsConstructor
@AllArgsConstructor
@Data
@DiscriminatorValue("Specimen")
public class AnnotationSpecimen extends Annotation {
    protected String modeAquisition;
    @Enumerated(EnumType.STRING)
    protected EState etat;
    @ManyToOne
    protected Media media;

    }
