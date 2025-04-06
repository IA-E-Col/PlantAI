package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id ;
    String nomProjet;
    String Description;
    Date dateCreation ;
    @OneToMany(mappedBy = "projet", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Participation> participations = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "projet_modele",
            joinColumns = @JoinColumn(name = "projet_id"),
            inverseJoinColumns = @JoinColumn(name = "modele_id"))
    @JsonIgnore
    private List<Modele> modeles;

    @OneToMany(fetch=FetchType.EAGER,mappedBy = "projet", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<DataSet> Datasets = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JsonIgnore
    private Collection collection;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private User createur;

    public int getNumberOfDataset(){
        return this.Datasets.size();
    }
    public int getNumberOfSpecimen(){
        int n =0;

            for(DataSet d : getDatasets()){
                n+=d.getSpecimens().size();
            }


        return n;
    }

}

