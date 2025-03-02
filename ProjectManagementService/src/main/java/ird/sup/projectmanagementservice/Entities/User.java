package ird.sup.projectmanagementservice.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@Builder  // Ajoutez cette annotation pour générer le builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String username;
    String nom;
    String prenom;
    
    @Column(nullable = false, unique = true)
    String email;

    @Column(name = "tel")
    String tel;

    @Column(name = "departement")
    String departement;

    @Column(nullable = false)
    @JsonIgnore
    String password;

    @Column(nullable = true)
    @Lob
    byte[] image;

    @Enumerated(EnumType.STRING)
    Role role;

    boolean enabled;
    private String secret;      // pour stocker le secret du 2FA
    private boolean mfaEnabled; // pour indiquer si le 2FA est activé
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<Token> tokens;

    // Les relations avec d'autres entités
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "createur", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Projet> projetsCree;

    @ManyToMany(mappedBy = "collaborateurs")
    @JsonIgnore
    private List<Projet> projetsCollab;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "createurC", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Commentaire> commentaires;

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

    public String getfullNname() {
        return nom+" "+prenom;
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
