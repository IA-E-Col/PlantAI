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

    @ManyToMany
    @JoinTable(
            name = "projet_modele",
            joinColumns = @JoinColumn(name = "projet_id"),
            inverseJoinColumns = @JoinColumn(name = "modele_id"))
    @JsonIgnore
    private List<Modele> modeles;

    @OneToMany(fetch=FetchType.LAZY,mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DataSet> Datasets = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection collection;

    @ManyToOne(cascade = CascadeType.ALL)
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

