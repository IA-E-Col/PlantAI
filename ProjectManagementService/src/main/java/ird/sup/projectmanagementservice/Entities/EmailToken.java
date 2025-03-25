package ird.sup.projectmanagementservice.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class EmailToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Utilisation de Long pour être cohérent avec l'id d'autres entités

    @Column(unique = true)
    private String emailToken; // Assurez-vous que ce champ existe avec cette casse exacte

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime validatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Convention snake_case pour le nom de la colonne
    private User user;
}
