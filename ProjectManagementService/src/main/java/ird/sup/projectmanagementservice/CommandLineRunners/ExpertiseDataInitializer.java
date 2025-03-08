package ird.sup.projectmanagementservice.CommandLineRunners;

import ird.sup.projectmanagementservice.DAO.ExpertiseRepository;
import ird.sup.projectmanagementservice.Enums.ELevel;
import ird.sup.projectmanagementservice.Entities.Expertise;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ExpertiseDataInitializer implements CommandLineRunner {

    private final ExpertiseRepository expertiseRepository;

    public ExpertiseDataInitializer(ExpertiseRepository expertiseRepository) {
        this.expertiseRepository = expertiseRepository;
    }

    @Override
    public void run(String... args) {
        int i = 1;
        for (ELevel level : ELevel.values()) {
            if (expertiseRepository.findByLevel(level).isEmpty()) {
                Expertise expertise = new Expertise();
                expertise.setLevel(level);
                expertise.setValue(i);
                expertiseRepository.save(expertise);
                i += 2;
            }
        }
    }
}
