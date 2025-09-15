package ird.sup.projectmanagementservice.Entities.MediaH;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.Collection;
import ird.sup.projectmanagementservice.Entities.Specimen;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_media", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id;
    
    // ERD fields
    String Description;       // Description
    String code_media;        // was CodeMedia
    String rdf_path;          // RDF path
    String resolution;        // Resolution
    String taille;            // Size
    String file_name;         // File name
    String path;              // Path
    String pcd_number;        // PCD number
    String contenu;           // Content
    
    @OneToMany(mappedBy = "media", fetch=FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AnnClassification> annotationSpecimens;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Specimen specimen;
}
