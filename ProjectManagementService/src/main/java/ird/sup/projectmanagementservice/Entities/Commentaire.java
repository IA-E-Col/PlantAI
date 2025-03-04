package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationValeur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import java.util.Date;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
<<<<<<< HEAD
=======

>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

<<<<<<< HEAD
    //Date creationDate;
    private Long id;

    private String commentaire;

    @ManyToOne(cascade = CascadeType.ALL)
    private User createurC;

    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
=======

    private Long id;

    private String commentaire;
   private Date creationDate;

    @ManyToOne
    private User createurC;

    @ManyToOne
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
    private AnnClassification annotation;
}
