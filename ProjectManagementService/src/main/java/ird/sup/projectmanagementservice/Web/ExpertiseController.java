package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.DAO.ExpertiseRepository;
import ird.sup.projectmanagementservice.Entities.Expertise;
import ird.sup.projectmanagementservice.Entities.Modele;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/expertises")
public class ExpertiseController {
    private final ExpertiseRepository expertiseRepository;
    ExpertiseController(ExpertiseRepository expertiseRepository) {
        this.expertiseRepository = expertiseRepository;
    }
    @GetMapping("/")
    public ResponseEntity<List<Expertise>> getAllLevels() {
        return new ResponseEntity<>(expertiseRepository.findAll(), HttpStatus.OK);
    }
}
