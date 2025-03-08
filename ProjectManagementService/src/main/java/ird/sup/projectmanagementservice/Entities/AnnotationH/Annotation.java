package ird.sup.projectmanagementservice.Entities.AnnotationH;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Modele;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "annSpecification", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Annotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    protected String libelle ;
    protected String type ;
    @OneToMany(mappedBy = "annotation", cascade = CascadeType.ALL)
    @JsonIgnore
    protected List<Modele> modeles = new ArrayList<>();
    @ManyToOne
    protected DataSet dataset;
}
