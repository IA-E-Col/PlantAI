package ird.sup.projectmanagementservice.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValueFiltre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String value;
}
