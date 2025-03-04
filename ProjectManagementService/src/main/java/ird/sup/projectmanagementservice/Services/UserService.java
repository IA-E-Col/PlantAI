package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.Entities.ChangePasswordRequest;
import ird.sup.projectmanagementservice.Entities.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * Service de gestion des utilisateurs.
 * 
 * Ce service offre des opérations CRUD (création, lecture, mise à jour, suppression)
 * ainsi que la gestion du changement de mot de passe pour les utilisateurs.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    // Repository pour accéder aux données des utilisateurs
    private final UserRepository userRepository;
    // Encodeur de mots de passe, par exemple BCryptPasswordEncoder
    private final PasswordEncoder passwordEncoder;

    // ----------------- Méthodes existantes -----------------

    /**
     * Récupère la liste de tous les utilisateurs.
     *
     * @return une liste de User.
     */
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    /**
     * Recherche un utilisateur par son ID.
     *
     * @param id l'identifiant de l'utilisateur.
     * @return un Optional contenant l'utilisateur si trouvé, sinon vide.
     */
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Recherche un utilisateur par son nom d'utilisateur.
     *
     * @param username le nom d'utilisateur à rechercher.
     * @return l'utilisateur trouvé, ou null en cas d'erreur.
     */
    public User getUser(String username) {
        try {
            return userRepository.findByUserName(username);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Recherche un utilisateur par son email.
     *
     * @param email l'email à rechercher.
     * @return l'utilisateur trouvé, ou null en cas d'erreur.
     */
    public User getUserE(String email) {
        try {
            return userRepository.findByUserEmail(email);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Enregistre un nouvel utilisateur ou met à jour un utilisateur existant.
     *
     * @param u l'utilisateur à enregistrer.
     * @return l'utilisateur enregistré.
     */
    public User saveUser(User u) {
        return userRepository.save(u);
    }

    /**
     * Supprime un utilisateur par son ID.
     *
     * @param id l'identifiant de l'utilisateur à supprimer.
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Permet de changer le mot de passe de l'utilisateur connecté.
     *
     * Cette méthode effectue les opérations suivantes :
     * - Récupère l'utilisateur connecté via le Principal (ici, le principal retourne l'email).
     * - Vérifie que le mot de passe actuel fourni correspond au mot de passe stocké.
     * - Vérifie que le nouveau mot de passe et sa confirmation sont identiques.
     * - Encode et met à jour le mot de passe dans la base.
     *
     * @param request       Objet contenant le mot de passe actuel, le nouveau mot de passe et sa confirmation.
     * @param connectedUser Le Principal représentant l'utilisateur connecté.
     * @throws UsernameNotFoundException si l'utilisateur n'est pas trouvé.
     * @throws IllegalStateException si le mot de passe actuel est incorrect ou si les nouveaux mots de passe ne correspondent pas.
     */
    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        // Récupère l'utilisateur connecté en utilisant l'email fourni par le Principal via Guava Optional
        Optional<User> userOptional = userRepository.findByEmail(connectedUser.getName());
        if (!userOptional.isPresent()) {
            throw new UsernameNotFoundException("User not found with email: " + connectedUser.getName());
        }
        // Extrait l'utilisateur de l'Optional
        User user = userOptional.get();

        // Vérifie que le mot de passe actuel correspond au mot de passe enregistré (en tenant compte de l'encodage)
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }

        // Vérifie que le nouveau mot de passe et sa confirmation sont identiques
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Passwords do not match");
        }

        // Encode le nouveau mot de passe et met à jour l'utilisateur
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ----------------- Méthodes supplémentaires -----------------

    /**
     * Ajoute un utilisateur dans la base (similaire à saveUser).
     *
     * @param user l'utilisateur à ajouter.
     * @return l'utilisateur ajouté.
     */
    public User addUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Récupère un utilisateur par son email en se basant sur l'email.
     *
     * @param email l'email de l'utilisateur.
     * @return l'utilisateur trouvé.
     * @throws UsernameNotFoundException si l'utilisateur n'est pas trouvé.
     */
    public User retrieveUserbyemail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return userOptional.get();
    }

    /**
     * Récupère l'ID d'un utilisateur à partir de son email.
     *
     * @param email l'email de l'utilisateur.
     * @return l'identifiant de l'utilisateur.
     * @throws UsernameNotFoundException si l'utilisateur n'est pas trouvé.
     */
    public Long retrieveidbyemail(String email) {
        User user = retrieveUserbyemail(email);
        return user.getId();
    }

    /**
     * Récupère tous les utilisateurs.
     *
     * @return une liste de tous les utilisateurs.
     */
    public List<User> retrieveAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Met à jour un utilisateur en utilisant son ID.
     *
     * @param user   L'utilisateur avec les nouvelles informations.
     * @param userId L'identifiant de l'utilisateur à mettre à jour.
     * @return l'utilisateur mis à jour.
     */
    public User updateUser(User user, Long userId) {
        // Ici, vous pouvez ajouter une vérification pour s'assurer que l'utilisateur existe.
        // Pour simplifier, on effectue une sauvegarde qui met à jour l'utilisateur si il existe.
        return userRepository.save(user);
    }

    /**
     * Récupère un utilisateur par son ID.
     *
     * @param userId L'identifiant de l'utilisateur.
     * @return l'utilisateur trouvé, ou null si non trouvé.
     */
    public User retrieveUser(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    /**
     * Supprime un utilisateur par son ID.
     *
     * @param userId L'identifiant de l'utilisateur à supprimer.
     */
    public void removeUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
