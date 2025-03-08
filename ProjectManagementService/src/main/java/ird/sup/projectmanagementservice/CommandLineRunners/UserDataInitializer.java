package ird.sup.projectmanagementservice.CommandLineRunners;
import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.Entities.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public UserDataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Check if admin exists
        if (userRepository.findByUserName("admin") == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setNom("Admin");
            admin.setPrenom("User");
            admin.setEmail("admin@example.com");
            admin.setTel("0000000000");
            admin.setDepartement("Direction");
            admin.setPassword("admin123");
            userRepository.save(admin);
        }
    }
}