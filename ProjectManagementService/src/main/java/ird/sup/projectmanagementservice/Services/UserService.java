package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.Entities.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService  {
    @Autowired
    private UserRepository ur;

    public List<User> getUsers() {
        return ur.findAll();
    }

    public Optional<User> findUserById(Long id) {
        return ur.findById(id);
    }

    public User getUser(String code) {
        try {
            return ur.findByUserName(code);
        } catch (Exception e) {return null;}
    }

    public User getUserE(String code) {
        try {
            return ur.findByUserEmail(code);
        } catch (Exception e) {return null;}
    }

    public User saveUser(User u) {
        return ur.save(u);
    }

    public void deleteUser(Long id) {
        ur.deleteById(id);

    }

    public User saveUserImage(Long id, Blob blob) throws IOException {
        Optional<User> userOptional = ur.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setImage(blob);
            return ur.save(user);
        }
        return null;
    }
    public byte[] getUserImage(Long id) throws SQLException {
        Optional<User> userOptional = ur.findById(id);
        if (userOptional.isPresent() && userOptional.get().getImage() != null) {
            return userOptional.get().getImage().getBytes(1,(int) userOptional.get().getImage().length());
        }
        return null; // Retourne null si l'utilisateur n'a pas d'image
    }




}

