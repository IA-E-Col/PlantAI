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
public class Media {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id;
    String CodeMedia;
    
    @OneToMany(mappedBy = "media", fetch=FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AnnClassification> annotationSpecimens;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Specimen specimen;
}
