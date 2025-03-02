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
        boolean toutValid=true;
        int ifs=0;
        int ifel=0;
        List<String> pays = champs.get(0).isEmpty() ? null : champs.get(0);
        List<String> genre = champs.get(1).isEmpty() ? null : champs.get(1);
        List<String> enregistrePar = champs.get(2).isEmpty() ? null : champs.get(2);
        List<String> famille = champs.get(3).isEmpty() ? null : champs.get(3);
        List<String> epitheteSpecifique = champs.get(4).isEmpty() ? null : champs.get(4);
        List<String> nomScientifique = champs.get(5).isEmpty() ? null : champs.get(5);
        List<String> nomScientifiqueAuteur = champs.get(6).isEmpty() ? null : champs.get(6);
        List<String> ville = champs.get(7).isEmpty() ? null : champs.get(7);
        List<String> departement = champs.get(8).isEmpty() ? null : champs.get(8);
        List<String> lieu = champs.get(9).isEmpty() ? null : champs.get(9);
      List<Specimen> SpecimensByMetadat = ps.findByMultipleCriteria(
              pays, genre, enregistrePar, famille, epitheteSpecifique, nomScientifique, nomScientifiqueAuteur, ville,
              departement, lieu);
      List<Specimen> Specimens = new ArrayList<>();
      System.out.println("le nombre des specimen par filtre metadata  "+SpecimensByMetadat.size());
     for(Specimen s :SpecimensByMetadat){
         if(s.getCollection().getId() == projs.findProjetbyId(idProjet).getCollection().getId()){
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
    }

    public List<Specimen> getAllSpecimen() {
        return ps.findAll();
    }

}
