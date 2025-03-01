package ird.sup.projectmanagementservice.Entities.AnnotationH;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.Commentaire;
import ird.sup.projectmanagementservice.Entities.Modele;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "annSpecification", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
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





}
