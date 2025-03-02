package ird.sup.projectmanagementservice.Entities.AnnotationH;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.Modele;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "annSpecification", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
public class Annotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String libelle ;
    String type ;
    @OneToMany(mappedBy = "annotation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Modele> modeles = new ArrayList<>();
    @ManyToOne
    private DataSet dataset;
}
