package ird.sup.projectmanagementservice.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
@Entity
@Data
public class Expertise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    ELevel level;
    int value;
}
