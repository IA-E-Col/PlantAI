package ird.sup.projectmanagementservice.Services;


import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // On choisit d'authentifier par email
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByUserEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), // username (ici email)
                user.getPassword(), // mot de passe encodé
                new ArrayList<>()   // liste des rôles/authorities si nécessaire
        );
    }
}