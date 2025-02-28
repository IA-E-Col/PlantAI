package ird.sup.projectmanagementservice.Entities;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;

@Getter
public enum ELevel {
    BEGINNER("Débutant"),
    INTERMEDIATE("Intermédiaire"),
    ADVANCED("Avancé"),
    EXPERT("Expert"),
    MASTER("Maître");

    @Enumerated(EnumType.STRING)
    private final String label;

    ELevel(String label) {
        this.label = label;
    }

}