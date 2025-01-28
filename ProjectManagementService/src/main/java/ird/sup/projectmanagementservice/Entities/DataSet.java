package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ird.sup.projectmanagementservice.Entities.MediaH.Image;
import ird.sup.projectmanagementservice.Entities.MediaH.Media;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataSet {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String description;
   // @ManyToOne(cascade = CascadeType.ALL)
   // @JsonIgnore
   // Collection collection ;
    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    Projet projet ;
    @OneToMany(fetch=FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Filtre> Filtres;
    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "Dataset_specimen",
            joinColumns = @JoinColumn(name = "Dataset_id"),
            inverseJoinColumns = @JoinColumn(name = "specimen_id"))
    private List<Specimen> specimens=new ArrayList<>();

    public int getNumberOfSpecimen(){
        return specimens.size();
    }

}
