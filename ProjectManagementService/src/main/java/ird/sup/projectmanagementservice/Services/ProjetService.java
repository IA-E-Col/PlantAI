package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.DTO.UserWithExpertiseDTO;
import ird.sup.projectmanagementservice.Entities.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjetService  {
    @Autowired
    private ProjetRepository pr;
    @Autowired
    private UserRepository ur;
    @Autowired
    private CollectionRepository cs;
    @Autowired
    private ExpertiseRepository er;
    @Autowired
    private ParticipationRepository prp;
    public Projet addProjet(Projet p , Long idUser , Long idCollection) {
        User u=ur.findById(idUser).get();
        Collection c=cs.findById(idCollection).get();
        p.setDateCreation(new Date());
        u.getProjetsCree().add(p);
        p.setCreateur(u);
        p.setCollection(c);
        c.getProjets().add(p);
        return  pr.save(p);
    }

    public Projet updateProjet(Projet c) {
        return pr.save(c);
    }

    public void deleteProjet(Long id) {  // à vérifier !!!!!
            pr.deleteById(id);
    }

    public Projet findProjetbyId(Long id) {
        return pr.findById(id).orElse(null);
    }


    public List<Projet> getProjets(){
        return this.pr.findAll();
    }

    // discuter avec Youssef !!!!!
    public List<Projet> getProjetsIdCre(Long Id){
        List<Projet> projets = this.pr.findPrjByIdC(Id);
        return projets;
    }

    public List<Projet> getProjetsIdCollab(Long Id){
        List<Projet> projets = new ArrayList<>();
        for(Projet p: this.getProjets()){
            Optional user = p.getParticipations().stream().filter(c -> c.getUser().getId().equals(Id)).findFirst();
            if(user != Optional.empty())
                projets.add(p);
        }
        return projets;
    }

    public List<UserWithExpertiseDTO> getCollaborateurs(Long id) {
        return pr.findUsersInProject(id);
    }

    public Projet addCollaborateur(Long idU , Long idP, Long idE){
        System.out.println("test");
        Projet p = pr.findById(idP).get();
        User u = ur.findById(idU).get();
        Expertise e = er.findById(idE).get();
        Participation pa = new Participation(null,u,p,e);
        p.getParticipations().add(pa);
        u.getParticipations().add(pa);
        prp.save(pa);
        ur.save(u);

        return pr.save(p);
    }
    public List<User> getPossibleCollaborateurs(Long idP) {
        return pr.findUsersNotInProject(idP);
    }
    public Projet deleteCollaborateur(Long idU , Long idP){
        Projet p = pr.findById(idP).get();
        User u = ur.findById(idU).get();
        Participation participationToRemove;
        for (Participation participation : p.getParticipations()) {
            if (participation.getUser().getId().equals(idU) && participation.getProjet().getId().equals(idP)) {
                prp.deleteById(participation.getId());
                break;
            }
        }


        ur.save(u);
        return pr.save(p);
    }

    public User getCreateur(Long id) {
        Projet p = pr.findById(id).get();
        if(p==null)
            return null;
        return null;
    }

    public Collection getCollections(Long id) {
        Projet p=pr.findById(id).get();
        return p.getCollection();
    }

    public List<DataSet> getDatasets(Long id) {
        Projet p=pr.findById(id).get();
        return p.getDatasets();
    }

    public List<Projet> getAllProjetsIdUser(Long id) {
        List<Projet> projets= this.getProjetsIdCre(id);
        projets.addAll(this.getProjetsIdCollab(id));
        return projets;
    }
}
