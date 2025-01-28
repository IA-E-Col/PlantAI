package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {
    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id ;
    String username;
    String nom;
    String prenom;
    String email;
    String Tel;
    String Departement;
    String password;
    @OneToMany(fetch=FetchType.LAZY,mappedBy = "createur",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Projet> projetsCree;

    @ManyToMany(mappedBy = "collaborateurs")
    @JsonIgnore
    private List<Projet> projetsCollab;


    @OneToMany(fetch=FetchType.LAZY, mappedBy="createurC", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Commentaire> commentaires;
}

