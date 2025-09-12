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
import java.util.Set;
import java.util.HashSet;

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

    // Transient field for JSON serialization
    @Transient
    private int datasetsCount;

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

    public int getDatasetsCount(){
        return datasetsCount;
    }

    public void setDatasetsCount(int datasetsCount) {
        this.datasetsCount = datasetsCount;
    }
    
    public int getNumberOfSpecimen(){
        try {
            if (this.datasets != null) {
                // Count unique specimens across all datasets to avoid double-counting
                Set<Long> uniqueSpecimenIds = new HashSet<>();
                for(DataSet d : this.datasets){
                    if (d.getSpecimens() != null) {
                        for(Specimen s : d.getSpecimens()) {
                            uniqueSpecimenIds.add(s.getId());
                        }
                    }
                }
                return uniqueSpecimenIds.size();
            }
        } catch (Exception e) {
            return 0;
        }
        return 0;
    }

}

