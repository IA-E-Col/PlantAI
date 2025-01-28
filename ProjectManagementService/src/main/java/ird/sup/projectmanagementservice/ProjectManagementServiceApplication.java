package ird.sup.projectmanagementservice;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.Entities.*;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Services.CollectionService;
import ird.sup.projectmanagementservice.Services.DatasetService;
import ird.sup.projectmanagementservice.Services.ProjetService;
import ird.sup.projectmanagementservice.Services.SpecimenService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class ProjectManagementServiceApplication implements CommandLineRunner {
    @Autowired
    UserRepository ur ;
    @Autowired
    ProjetService ps;
    @Autowired
    ProjetRepository pr;
    @Autowired
    ModeleRepository mr;
    @Autowired
    CollectionRepository pc;
    @Autowired
    SpecimenRepository pS;
    @Autowired
    CollectionService pC;
    @Autowired
    DatasetService ds;
    public static void main(String[] args) {

        SpringApplication.run(ProjectManagementServiceApplication.class, args);
        System.out.println("application lanched with sucess");
    }


    @Override
    public void run(String... args) throws Exception {
    }
}

