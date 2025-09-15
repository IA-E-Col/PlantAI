package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValueFiltre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String value;
    
    // Many-to-many relationship with Filtre (as per ERD)
    @ManyToMany(mappedBy = "values")
    @JsonIgnore
    private List<Filtre> filtres;
}
