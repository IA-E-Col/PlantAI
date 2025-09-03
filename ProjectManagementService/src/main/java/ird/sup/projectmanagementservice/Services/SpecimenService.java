package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.SpecimenRepository;
import ird.sup.projectmanagementservice.DTO.selectedAnnotation;
import ird.sup.projectmanagementservice.Entities.Specimen;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class SpecimenService {

    @Autowired
    private SpecimenRepository ps;
    @Autowired
    private ProjetService projs;
    @Autowired
    private ModelService modelService;

    public List<List> getChamps() {
        List<List> distinctValues = new ArrayList<>();
        distinctValues.add(ps.findChampPays());
        distinctValues.add(ps.findChampCodePays());
        distinctValues.add(ps.findChampEnregistrePar());
        distinctValues.add(ps.findChampLieu());
        distinctValues.add(ps.findChampVille());
        distinctValues.add(ps.findChampDepartement());
        distinctValues.add(ps.findChampNomScientifique());
        distinctValues.add(ps.findChampFamille());
        distinctValues.add(ps.findChampEpitheteSpecifique());
        distinctValues.add(ps.findChampGenre());
        distinctValues.add(ps.findChampCatalogueCode());
        distinctValues.add(ps.findChampIdentification());
        distinctValues.add(ps.findChampCollectionCode());
        distinctValues.add(ps.findChampCodeInstitution());
        distinctValues.add(ps.findChampBaseDEnregistrement());
        distinctValues.add(ps.findChampNomScientifiqueAuteur());
        return distinctValues;
    }

    /*public List<Specimen> getUsersFilteredBy(List<List<String>> champs) {

        List<List<String>> distinctValues = new ArrayList<>();
        /*
         * List<String> pays = ps.findChampPays() ;
         * List<String> genre = ps.findChampGenre();
         * List<String> enregistrePar = ps.findChampEnregistrePar();
         * List<String> famille = ps.findChampFamille();
         * List<String> epitheteSpecifique = ps.findChampEpitheteSpecifique();
         * List<String> nomScientifique = ps.findChampNomScientifique();
         * List<String> nomScientifiqueAuteur = ps.findChampNomScientifiqueAuteur();
         * List<String> Ville = ps.findChampVille();
         * List<String> Departement = ps.findChampDepartement();
         * List<String> Lieu = ps.findChampLieu();
         *

        for (int i = 0; i < 10; i++)
            distinctValues.add(i, champs.get(i));

        /*
         * if(champs.get(0).isEmpty()){
         * distinctValues.add(0,pays);
         * }
         * if(champs.get(1).isEmpty()){
         * distinctValues.add(1,genre);
         * }
         * if(champs.get(2).isEmpty()){
         * distinctValues.add(2,enregistrePar);
         * }
         * if(champs.get(3).isEmpty()){
         * distinctValues.add(3,famille);
         * }
         * if(champs.get(4).isEmpty()){
         * distinctValues.add(4,epitheteSpecifique);
         * }
         * if(champs.get(5).isEmpty()){
         * distinctValues.add(5,nomScientifique);
         * }
         * 
         * 
         *

        return ps
                .findByPaysInOrGenreInOrEnregistreParInOrFamilleInOrEpitheteSpecifiqueInOrNomScientifiqueInOrNomScientifiqueAuteurInOrVilleInOrDepartementInOrLieuIn(
                        distinctValues.get(0), // Pays
                        distinctValues.get(1), // Genre
                        distinctValues.get(2), // EnregistrePar
                        distinctValues.get(3), // Famille
                        distinctValues.get(4), // EpitheteSpecifique
                        distinctValues.get(5), // NomScientifique
                        distinctValues.get(6), // NomScientifiqueAuteur
                        distinctValues.get(7), // Ville
                        distinctValues.get(8), // Departement
                        distinctValues.get(9) // Lieu
                );
    }*/

     public List<Specimen> getSpecimensFilteredBy(List<List<String>> champs, List<selectedAnnotation> filtreAnn, Long idProjet) {
        try {
            boolean toutValid=true;
            int ifs=0;
            int ifel=0;
            
            // Validate input parameters
            if (champs == null || filtreAnn == null || idProjet == null) {
                return new ArrayList<>();
            }
            
            List<String> pays = champs.get(0) != null && !champs.get(0).isEmpty() ? champs.get(0) : null;
            List<String> genre = champs.get(1) != null && !champs.get(1).isEmpty() ? champs.get(1) : null;
            List<String> enregistrePar = champs.get(2) != null && !champs.get(2).isEmpty() ? champs.get(2) : null;
            List<String> famille = champs.get(3) != null && !champs.get(3).isEmpty() ? champs.get(3) : null;
            List<String> epitheteSpecifique = champs.get(4) != null && !champs.get(4).isEmpty() ? champs.get(4) : null;
            List<String> nomScientifique = champs.get(5) != null && !champs.get(5).isEmpty() ? champs.get(5) : null;
            List<String> nomScientifiqueAuteur = champs.get(6) != null && !champs.get(6).isEmpty() ? champs.get(6) : null;
            List<String> ville = champs.get(7) != null && !champs.get(7).isEmpty() ? champs.get(7) : null;
            List<String> departement = champs.get(8) != null && !champs.get(8).isEmpty() ? champs.get(8) : null;
            List<String> lieu = champs.get(9) != null && !champs.get(9).isEmpty() ? champs.get(9) : null;
            
            List<Specimen> SpecimensByMetadat = ps.findByMultipleCriteria(
                    pays, genre, enregistrePar, famille, epitheteSpecifique, nomScientifique, nomScientifiqueAuteur, ville,
                    departement, lieu);
            List<Specimen> Specimens = new ArrayList<>();
            System.out.println("le nombre des specimen par filtre metadata  "+SpecimensByMetadat.size());
            
            // Get project to check collection
            var projet = projs.findProjetbyId(idProjet);
            if (projet == null || projet.getCollection() == null) {
                System.out.println("Project or collection not found for ID: " + idProjet);
                return new ArrayList<>();
            }
            
            Long projectCollectionId = projet.getCollection().getId();
            
            for(Specimen s : SpecimensByMetadat){
                if(s.getCollection() != null && s.getCollection().getId() != null && 
                   s.getCollection().getId().equals(projectCollectionId)){
                    for(selectedAnnotation ann : filtreAnn){
                        if(ann.getClasseid()!=null){

                            if(modelService.predictImage(null,Long.valueOf(ann.getModelid()),s.getId()).getValeurPredite().compareTo(ann.getClasseid())==0){
                                ifs++;
                            }
                            else{
                                ifel++;
                                toutValid=false;
                            }
                        }
                    }
                    if(toutValid){Specimens.add(s);}

                    toutValid=true;
                }

            }
            System.out.println("totale des predictions "+(ifs+ifel));
            System.out.println("le nombre d'egalite "+ifs);
            System.out.println("le nombre d'inegalite "+ifel);

            System.out.println("le nombre des specimen par filtre metadata et annotation "+Specimens.size());
            return Specimens;
        } catch (Exception e) {
            System.err.println("Error in getSpecimensFilteredBy: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Specimen> getAllSpecimen() {
        return ps.findAll();
    }

}
