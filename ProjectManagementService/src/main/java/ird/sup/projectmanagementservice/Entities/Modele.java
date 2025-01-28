package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Modele {
    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String urlModele;
    private String categorie;

    @OneToMany(fetch=FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DataSet> Datasets=new ArrayList<>();
    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    private AnnotationModele annotation;
    @OneToMany(mappedBy = "modelInference", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AnnClassification> annClassifications = new ArrayList<>();
}
