package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.DTO.Message;
import ird.sup.projectmanagementservice.Entities.Collection;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.Projet;
import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/projets")
public class ProjetController {

    @Autowired
    private ProjetService projetService;
    @Autowired
    private UserService userService;
    @Autowired
    private SpecimenService specimenService;
    @Autowired
    private DatasetService datasetService;
    @PostMapping("/add/{userId}/{colId}")
    public ResponseEntity<Projet> addProjet(@RequestBody Projet projet, @PathVariable Long userId,@PathVariable Long colId) {
        Projet newProjet = projetService.addProjet(projet, userId,colId);
        return ResponseEntity.ok(newProjet);
    }

    @PutMapping("/update/{id}") // discutr youssef
    public ResponseEntity<Projet> updateProjet(@RequestBody Projet projet,@PathVariable Long id) {
        Projet projet_t = projetService.findProjetbyId(projet.getId());
        Projet updatedProjet = projetService.updateProjet(projet);
        return ResponseEntity.ok(updatedProjet);
    }

    @PutMapping("/{IdP}/addCollab/{IdC}")
    public ResponseEntity<?> addCollabProjet(@PathVariable Long IdC,@PathVariable Long IdP) {
        Optional<User> user = userService.findUserById(IdC);
        Projet projetV = projetService.findProjetbyId(IdP);
        if (user.isPresent()) {
            if (user != null && projetV != null && user.get().getId() != projetV.getCreateur().getId()) {

                List<User> collabs = projetService.getCollaborateurs(IdP);
                Optional test = collabs.stream().filter(c -> c.getId().equals(user.get().getId())).findFirst();
                if (test == Optional.empty()) {
                    Projet projet = projetService.addCollaborateur(user.get().getId(), IdP);
                    return ResponseEntity.ok(projet);
                }
                return ResponseEntity.ok(null);
            }
            else
            {
                return ResponseEntity.status(500).body(new Message("User or project does not exist or adding already existing user within the project"));
            }
        }
        return ResponseEntity.notFound().build();

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProjet(@PathVariable Long id) {
        System.out.println("deleteProjet");
        Projet projet = projetService.findProjetbyId(id);
        projet.setCreateur(null);
        projet.setCollaborateurs(null);
        projet.setCollection(null);
        for(DataSet d :projet.getDatasets()){
            datasetService.deleteDataSet(d.getId());
        }
        projetService.deleteProjet(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{IdP}/collab/{IdC}")
    public ResponseEntity<Void> deleteCollabProjet(@PathVariable Long IdC,@PathVariable Long IdP) {
        System.out.println(IdC + " " + IdP);
        Optional<User> user = userService.findUserById(IdC);
        Projet projet = projetService.findProjetbyId(IdP);
        if(user.isPresent() && projet !=null) {
            List<User> collabs = projetService.getCollaborateurs(IdP);
            Optional test = collabs.stream().filter(c -> c.getId().equals(user.get().getId())).findFirst();
            if(test != Optional.empty()) {
                projetService.deleteCollaborateur(user.get().getId(), IdP);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projet> findProjetById(@PathVariable Long id) {
        Projet projet = projetService.findProjetbyId(id);
        if (projet != null) {
            return ResponseEntity.ok(projet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Projet>> getProjets() {
        List<Projet> projets = projetService.getProjets();
        return ResponseEntity.ok(projets);
    }

// recuperer les projets creer par ml'utilisateur
    @GetMapping("/list/user/{Id}")
    public ResponseEntity<List<Projet>> getAllProjetsIdUser(@PathVariable Long Id) {
        List<Projet> projets = projetService.getAllProjetsIdUser(Id);
        return ResponseEntity.ok(projets);
    }
    @GetMapping("/list/PCR/{Id}")
    public ResponseEntity<List<Projet>> getProjetsIdUser(@PathVariable Long Id) {
        List<Projet> projets = projetService.getProjetsIdCre(Id);
        return ResponseEntity.ok(projets);
    }
    // recuperer les projets "Collab" par ml'utilisateur
    @GetMapping("/list/PCO/{Id}")
    public ResponseEntity<List<Projet>> getProjetsIdCollab(@PathVariable Long Id) {
        List<Projet> projets = projetService.getProjetsIdCollab(Id);
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/{id}/collaborateurs")
    public ResponseEntity<List<User>> getCollaborateurs(@PathVariable Long id) {
        List<User> collaborateurs = projetService.getCollaborateurs(id);
        return ResponseEntity.ok(collaborateurs);
    }

    @GetMapping("/{id}/createur")
    public ResponseEntity<User> getCreateur(@PathVariable Long id) {
        User createur = projetService.getCreateur(id);
        if(createur!=null)
            return ResponseEntity.ok(createur);
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/collections")
    public ResponseEntity<Collection> getCollections(@PathVariable Long id) {
        Collection collection = projetService.getCollections(id);
        return ResponseEntity.ok(collection);
    }

    @GetMapping("/ChampsFiltre")
    public ResponseEntity<List<List>> getChamps() {
         List<List> rest = specimenService.getChamps();
        return ResponseEntity.ok(rest);
    }

    @GetMapping("/{id}/Datasets")
    public ResponseEntity<List<DataSet>> getDatasets(@PathVariable Long id) {
        List<DataSet> collections = projetService.getDatasets(id);
        return ResponseEntity.ok(collections);
    }
    @GetMapping("/{id}/possible_collaborators")
    public ResponseEntity<List<User>> getPossibleCollaborators(@PathVariable Long id) {
        List<User> collaborators = projetService.getPossibleCollaborateurs(id);
        return ResponseEntity.ok(collaborators);
    }
}

