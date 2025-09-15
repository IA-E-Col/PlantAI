package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filtre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String libelle;
    
    // Relationship to DataSet (1..n as per ERD)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dataset_id")
    @JsonIgnore
    private DataSet dataset;
    
    // Many-to-many relationship with ValueFiltre (as per ERD)
    @ManyToMany
    @JoinTable(
        name = "filtre_value_filtre",
        joinColumns = @JoinColumn(name = "filtre_id"),
        inverseJoinColumns = @JoinColumn(name = "value_filtre_id")
    )
    @JsonIgnore
    private List<ValueFiltre> values;
}
