package ird.sup.projectmanagementservice.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.MediaH.Image;
import ird.sup.projectmanagementservice.Entities.MediaH.Media;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Specimen {

    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id;
    String baseDEnregistrement;
    String codeInstitution;
    String collectionCode;
    String catalogueCode;
    String identificationRemarques;
    String nomScientifiqueAuteur;
    String genre; //
    String epitheteSpecifique;
    String famille;//
    String nomScientifique;
    String pays;
    String departement;
    String ville;
    String lieu;
    String enregistrePar;
    String dateCreation;// dateCollection
    Float latitude;
    Float longitude;
    String codePays;

    @OneToMany(fetch=FetchType.EAGER,mappedBy = "specimen",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Media> medias = new ArrayList<>();
    @ManyToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JsonIgnore
    Collection collection;

    @ManyToMany(mappedBy = "specimens",cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<DataSet> datasets = new ArrayList<>();

    public Image getImage(){
        for (Media media : this.getMedias()) {
            if (media.getClass() == Image.class) {
                return ((Image) media);
            }
        }
        return null;
    }

    public List<AnnClassification> getAnnotations(){
        for (Media media : this.getMedias()) {
            if (media.getClass() == Image.class) {
                return media.getAnnotationSpecimens();
            }
        }
        return null;
    }

}
