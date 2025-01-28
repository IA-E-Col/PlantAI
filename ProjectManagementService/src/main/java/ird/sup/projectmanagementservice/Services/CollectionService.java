package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;
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
public class CollectionService  {
    @Autowired
    private ProjetRepository pr;
    @Autowired
    private CollectionRepository cr;
    @Autowired
    private SpecimenRepository ps;
    @Autowired
    private DataSetRepository dr;

    public Collection addCollection(Collection c ) {
        c.setDateCreation(new Date());
        return  cr.save(c);
    }

    public Collection updateCollection(Collection c) {
        return cr.save(c);
    }

    public DataSet addSpecimens(Long iDD, List<Specimen> iDS){
        DataSet c = dr.findById(iDD).get();
           c.setSpecimens(iDS);
        return dr.save(c);
    }

    public DataSet addDataset(Long iDP, DataSet DS){
        System.out.println("ici je suis au service "+iDP);
        System.out.println("number of specimens "+DS.getSpecimens().size());
        Projet p = pr.findById(iDP).get();
        p.getDatasets().add(DS);
        DS.setProjet(p);
        return dr.save(DS);
    }

    public DataSet addSpecimensToDataset(Long IDdataset, List<Long> specimens){
        System.out.println("ici je suis au service d'ajout de specimens to dataset "+IDdataset);
        System.out.println("number of specimens "+specimens.size());
        DataSet d = dr.findById(IDdataset).get();
        for(Long a: specimens){
            Specimen s=ps.findById(a).get();
            s.getDatasets().add(d);
            d.getSpecimens().add(s);
        }
        return dr.save(d);
    }


    public void deleteCollection(Long id) {
        Collection c=cr.findById(id).get();
        if(c!=null) {

            cr.deleteById(id);
        }
    }

    public Collection findCollectionbyId(Long id) {
        return cr.findById(id).orElse(null);
    }

    public List<Specimen> getSpecimenByCollection(Long id) {
        return cr.findById(id).orElse(null).getSpecimens();
    }

    public List<Collection> getCollections(){
        return this.cr.findAll();
    }

    public Projet getProjet(Long id) {
        Collection c=cr.findById(id).get();
        return null;
    }
}