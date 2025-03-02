package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationValeur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String commentaire;
    Date creationDate;
    @ManyToOne(cascade = CascadeType.ALL)
    private User createurC;
    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    private AnnotationSpecimen annotation;



}
