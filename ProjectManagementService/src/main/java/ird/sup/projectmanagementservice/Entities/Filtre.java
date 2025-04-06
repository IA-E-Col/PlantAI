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
    @OneToMany(fetch=FetchType.EAGER,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ValueFiltre> values;
}
