package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.Services.UserService;
import ird.sup.projectmanagementservice.Entities.ChangePasswordRequest;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // -------------------- Endpoints existants --------------------

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUser(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserE(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if(userService.getUserE(user.getEmail()) == null) {
            User savedUser = userService.saveUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/modifier")
    public ResponseEntity<User> modifierUser(@RequestBody User user) {
        // Utilise getUserByUsername() pour vérifier l'existence
        if(this.getUserByUsername(user.getUsername()).getBody() != null) {
            User savedUser = userService.saveUser(user);
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------- Endpoints supplémentaires --------------------

    /**
     * Endpoint pour récupérer un utilisateur par email.
     */
    @GetMapping("/getbyemaill/{email}")
    public User getByEmailL(@PathVariable("email") String email) {
        return userService.retrieveUserbyemail(email);
    }

    /**
     * Endpoint pour récupérer l'ID d'un utilisateur à partir de son email.
     */
    @GetMapping("/getidbyemail/{email}")
    public Long getIdByEmail(@PathVariable("email") String email) {
        return userService.retrieveidbyemail(email);
    }

    /**
     * Endpoint pour rechercher des utilisateurs par mot-clé.
     */
    @GetMapping("/searchUser")
    public List<User> searchUser(@RequestParam(value = "keyword") String keyword) {
        List<User> allUsers = userService.retrieveAllUsers();
        return allUsers.stream()
                .filter(user ->
                        user.getPrenom().toLowerCase().contains(keyword.toLowerCase()) ||
                        user.getNom().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Endpoint pour mettre à jour un utilisateur par son ID.
     */
    @PutMapping("/update/{id-User}")
    public User updateUser(@RequestBody User user, @PathVariable("id-User") Long numUser) {
        return userService.updateUser(user, numUser);
    }

    /**
     * Endpoint pour récupérer un utilisateur par son ID.
     */
    @GetMapping("/get/{id-User}")
    public User getById(@PathVariable("id-User") Long numUser) {
        return userService.retrieveUser(numUser);
    }

    /**
     * Endpoint pour supprimer un utilisateur par son ID.
     */
    @DeleteMapping("/delete/{id-User}")
    public void deleteById(@PathVariable("id-User") Long numUser) {
        userService.removeUser(numUser);
    }

    /**
     * Endpoint pour changer le mot de passe d'un utilisateur connecté.
     *
     * @param request       Le DTO contenant l'ancien et le nouveau mot de passe.
     * @param connectedUser Le principal de l'utilisateur connecté.
     * @return ResponseEntity indiquant le succès de l'opération.
     */
    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal connectedUser) {
        userService.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }
}
