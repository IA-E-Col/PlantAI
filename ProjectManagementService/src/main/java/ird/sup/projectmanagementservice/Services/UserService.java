package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.Entities.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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



}

