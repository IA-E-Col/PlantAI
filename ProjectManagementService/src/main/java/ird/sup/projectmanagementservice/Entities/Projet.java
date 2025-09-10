package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String nomProjet;
    String description;
    Date dateCreation;
    @OneToMany(mappedBy = "projet", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Participation> collaborateurs = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "projet_modele",
            joinColumns = @JoinColumn(name = "projet_id"),
            inverseJoinColumns = @JoinColumn(name = "modele_id"))
    @JsonIgnore
    private List<Modele> modeles;

    @OneToMany(fetch=FetchType.LAZY,mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DataSet> datasets = new ArrayList<>();

    @ManyToOne
    private Collection collection;

    @ManyToOne
    private User createur;

    public int getNumberOfDataset(){
        try {
            return this.datasets != null ? this.datasets.size() : 0;
        } catch (Exception e) {
            return 0;
        }
    }
    
    public int getNumberOfSpecimen(){
        int n = 0;
        try {
            if (this.datasets != null) {
                for(DataSet d : this.datasets){
                    if (d.getSpecimens() != null) {
                        n += d.getSpecimens().size();
                    }
                }
            }
        } catch (Exception e) {
            return 0;
        }
        return n;
    }

}

