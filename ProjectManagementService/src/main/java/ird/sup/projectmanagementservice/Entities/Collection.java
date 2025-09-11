package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Collection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String nom;
    String description;
    Date dateCreation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;
    @OneToMany(fetch=FetchType.LAZY,mappedBy = "collection",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Specimen> specimens = new ArrayList<>();
    @OneToMany(fetch=FetchType.LAZY,mappedBy = "collection",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Projet> projets = new ArrayList<>();
}
