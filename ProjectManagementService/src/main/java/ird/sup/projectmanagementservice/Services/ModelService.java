package ird.sup.projectmanagementservice.Services;

import ird.sup.projectmanagementservice.DAO.*;

import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.AnnotationModele;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationMDL.ClasseAnnotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationSpecimen;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnotationValeur;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.Specimen;


import ird.sup.projectmanagementservice.Enums.EState;
import ird.sup.projectmanagementservice.response.classificationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import java.util.Optional;

@Service
public class ModelService {
    @Autowired
    private ModeleRepository modelRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private SpecimenRepository specimenRepository;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private AnnClassificationRepository annClassificationRepository;

    @Autowired
    private DataSetRepository dataSetRepository;
    @Autowired
    private ClasseAnnotationRepository classeAnnotationRepository;
    @Autowired
    private AnnotationModeleRepository annotationModeleRepository;


    public List<Modele> getAllModels() {
        return modelRepository.findAll();
    }

    public Modele getModelById(Long id) {
        return modelRepository.findById(id).orElse(null);
    }

    public Modele createModel(Modele model ) {
        Modele newModel = new Modele();
        newModel.setName(model.getName());
        newModel.setDescription(model.getDescription());
        newModel.setUrlModele(model.getUrlModele());
        newModel.setCategorie(model.getCategorie());
       // AnnotationModele annotationModele = new AnnotationModele();
       //  annotationModele.setLibelle(model.getUrlModele());
       //  for (String Id : classes) {
       //      ClasseAnnotation c = classeAnnotationRepository.findById(Long.decode(Id)).get();
       //       annotationModele.getClasseAnnotationS().add(c);
       // }
       // model.setAnnotation(annotationModele);
       // annotationModele.getModeles().add(newModel);
        return modelRepository.save(model);
    }

    public Modele updateModel(Long id, Modele updatedModel) {
        Modele existingModel = modelRepository.findById(id).orElse(null);
        if (existingModel != null) {
            existingModel.setName(updatedModel.getName());
            existingModel.setDescription(updatedModel.getDescription());
            existingModel.setUrlModele(updatedModel.getUrlModele());
            return modelRepository.save(existingModel);
        } else
            return null;

    }


    public Modele addDataSetToModele(Long modeleId, DataSet dataSet) {
        Optional<Modele> modeleOptional = modelRepository.findById(modeleId);
        if (modeleOptional.isPresent()) {
            Modele modele = modeleOptional.get();
            modele.getDatasets().add(dataSet);
            return modelRepository.save(modele);
        }
        return null;
    }

    public Modele removeDataSetFromModele(Long modeleId, Long dataSetId) {
        Optional<Modele> modeleOptional = modelRepository.findById(modeleId);
        if (modeleOptional.isPresent()) {
            Modele modele = modeleOptional.get();
            modele.getDatasets().removeIf(dataSet -> dataSet.getId().equals(dataSetId));
            return modelRepository.save(modele);
        }
        return null;
    }

    public Annotation predict(Long modeleId, Long imageId) {
        /*Optional<Modele> modeleOptional = modelRepository.findById(modeleId);
        Optional<Image> imageOptional = imageRepository.findById(imageId);
        System.out.println(modeleId);
        if (modeleOptional.isPresent() && imageOptional.isPresent()) {

            Modele modele = modeleOptional.get();
            String urlImage = imageOptional.get().getImage_url();
            String url ="http://127.0.0.1:8000/predict";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> map= new LinkedMultiValueMap<>();
            map.add("image", urlImage);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
            classificationResponse response = restTemplate.postForObject(url, request, classificationResponse.class);
            AnnClassification u = new AnnClassification();
            ClasseM c= new ClasseM(null,response.getPredictionValue(),"String",response.getPredictionValue());
            c=classeRepository.save(c);
            u.setLibelle(response.getLibelle());
            u.setMode(response.getMode());
            u.setEtat(response.isEtat());
            u.setModele(modele);
            u.getClasses().add(c);
            imageOptional.get().getAnnotations().add(u);
            return annClassificationRepository.save(u);

        }*/
        return null;
    }

    public ArrayList<Annotation> predictForDataset(Long modeleId, Long datasetId) {
        Optional<Modele> modeleOptional = modelRepository.findById(modeleId);
        Optional<DataSet> datasetOptional = dataSetRepository.findById(datasetId);
        ArrayList<Annotation> resultat = new ArrayList<>();
        if (modeleOptional.isPresent() && datasetOptional.isPresent()) {
            DataSet dataset = datasetOptional.get();
            List<Specimen> specimens = dataset.getSpecimens(); // Supposons que Dataset a une méthode getImageUrls()
            Annotation annotation;
            for (Specimen specimen : specimens) {
                annotation = predictImage(modeleId, specimen.getId(), datasetId);
                if (annotation != null) {
                    resultat.add(annotation);

                    System.out.println("Annotation saved with ID: " + annotation.getId());
                } else {
                    System.out.println("Failed to annotate image: " + specimen.getId());
                }
            }

            return resultat;
        } else {
            System.out.println("Model or Dataset not found");
            return null;
        }

    }

    public AnnClassification predictImage(Long datasetId, Long modeleId, Long s) {
       // System.out.println("Predict image with ID: " + s + " and modele ID: " + modeleId);
        Optional<DataSet> datasetOptional = dataSetRepository.findById(datasetId);
        Optional<Modele> modeleOptional = modelRepository.findById(modeleId);
        Specimen specimen = specimenRepository.findById(s).get();
        //System.out.println("number of media of this specimen: " + specimen.getMedias().size());
        //System.out.println("number of annotation of this specimen: " + specimen.getMedias().get(0).getAnnotationSpecimens().size());

        if(specimen.getMedias().get(0).getAnnotationSpecimens().size()!=0) {

            for (AnnClassification a : specimen.getMedias().get(0).getAnnotationSpecimens()) {

                if (a.getModelInference()!=null && a.getModelInference().getId()==modeleId) {
                    //System.out.println("number of models of this annotation: " + a.getModelInference().getName());
                    return a;
                }
            }
        }
            String url = "http://127.0.0.1:8000/predictAll/";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            //String requestBody = "{\"image_path\":\"" + specimen.getImage().getImage_url() + "\"}";
            String requestBody = "{\"image_path\":\"" + specimen.getImage().getImage_url() + "\", \"urlmodel\":\"" + modeleOptional.get().getUrlModele() + "\"}";
            System.out.println(requestBody);
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            classificationResponse response = restTemplate.postForObject(url, request, classificationResponse.class);
            AnnClassification u = new AnnClassification();
            u.setLibelle(modeleOptional.get().getUrlModele());
            if (datasetOptional.isPresent())
                u.setDataset(datasetOptional.get());
            u.setType("");
            u.setModeAquisition("Inference");
            u.setValeurPredite(response.getPredictionValue());
            u.setValeurPrecision(response.getPrecision());
            u.setEtat(EState.PENDING);
            //System.out.println("before");
           // System.out.println("after");
        u =annClassificationRepository.save(u);
          //  System.out.println(u.getId());
            u.setModelInference(modeleOptional.get());

            modeleOptional.get().getAnnClassifications().add(u);

            u.setMedia(specimen.getImage());
            specimen.getImage().getAnnotationSpecimens().add(u);
            if (u.getDataset() == null)
                return u;
            return annClassificationRepository.save(u);


    }

    public Modele addClassesToModel(Long idModel, List<String> classes) {
        System.out.println(classes.get(0).getClass());
        Modele model = this.modelRepository.findById(idModel).get();

         AnnotationModele annotationModele = new AnnotationModele();
         annotationModele.setLibelle(model.getUrlModele());
         for (String Id : classes) {
             System.out.println(Id.getClass());
             System.out.println(Long.valueOf(Id));
             ClasseAnnotation c = classeAnnotationRepository.findById(Long.valueOf(Id)).get();
               annotationModele.getClasseAnnotationS().add(c);
               c.setAnnotationModele(annotationModele);
         }
        annotationModele=annotationModeleRepository.save(annotationModele);
         model.setAnnotation(annotationModele);
         annotationModele.getModeles().add(model);
        return modelRepository.save(model);
    }

    public List<ClasseAnnotation> getAllClasses(Long idModele) {
        Modele m=this.modelRepository.findById(idModele).get();
        return m.getAnnotation().getClasseAnnotationS();
    }

   /* public Annotation predicttest(Long modeleId, String urlImage) {
        //Optional<Modele> modeleOptional = modelRepository.findById(modeleId);
        System.out.println(urlImage);
        if (modeleOptional.isPresent() true) {
            // Modele modele = modeleOptional.get();
            String url = "http://127.0.0.1:8000/predict/";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String requestBody = "{\"image_path\":\"" + urlImage + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            classificationResponse response = restTemplate.postForObject(url, request, classificationResponse.class);
            AnnClassification u = new AnnClassification();

            AnnotationValeur av = new AnnotationValeur(null, response.getPredictionValue(), "", response.getMode(), response.isEtat(), null, u);
            av = annotationValeurRepository.save(av);
            System.out.println(av.getId());
            u.setLibelle(response.getLibelle());
            u.setType("boolean");
            u = annClassificationRepository.save(u);
            System.out.println(u.getId());
            u.setAnnotationValeur(av);

            return annClassificationRepository.save(u);
        }
        return null;
    }*/
}







