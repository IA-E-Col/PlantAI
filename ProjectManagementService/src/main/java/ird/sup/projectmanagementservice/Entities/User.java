package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

<<<<<<< HEAD
=======
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
import java.util.ArrayList;
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
    @Column(nullable = true)
    @Lob
    Blob image;
    @OneToMany(fetch=FetchType.LAZY,mappedBy = "createur",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Projet> projetsCree;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Participation> participations = new ArrayList<>();


    @OneToMany(fetch=FetchType.LAZY, mappedBy="createurC", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Commentaire> commentaires;

<<<<<<< HEAD
    public List<Commentaire> getCommentaires() {
        return commentaires;
    }

=======
    @JsonProperty("image")
    public byte[] getImageAsByteArray() throws SQLException, IOException {
        if (image != null) {
            return image.getBytes(1, (int) image.length());
        }
        return null;
    }


>>>>>>> be99445863f02e21ea9da6174469aa49c3523908
}

