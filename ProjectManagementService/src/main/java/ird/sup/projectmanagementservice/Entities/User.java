package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.NaturalId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name="users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String username;
    String nom;
    String prenom;

    @NaturalId(mutable = true)
    @Column(nullable = false, unique = true)
    String email;

    @Column(name = "tel")
    String tel;

    @Column(name = "departement")
    String departement;

    @Column(nullable = false)
    @JsonIgnore
    String password;

    @Column(nullable = true, length = 500000)
    private String image;

    @Enumerated(EnumType.STRING)
    Role role;

    boolean enabled;
    String secret;      // pour stocker le secret du 2FA
    boolean mfaEnabled; // pour indiquer si le 2FA est activé

    @OneToMany(mappedBy = "user")

    @JsonIgnore
    List<Token> tokens;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "createur", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Projet> projetsCree;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Participation> participations = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "createurC", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Commentaire> commentaires;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role != null) {
            return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
        }
        return Collections.emptyList();
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return nom + " " + prenom;
    }
    
    public String getPrenom() {
        return prenom;
    }
    
    public String getNom() {
        return nom;
    }

    
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }


    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return enabled;
    }
}
