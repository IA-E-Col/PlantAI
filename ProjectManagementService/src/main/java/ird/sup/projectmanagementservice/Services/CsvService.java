package ird.sup.projectmanagementservice.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.exceptions.CsvException;
import ird.sup.projectmanagementservice.DAO.*;
import ird.sup.projectmanagementservice.DTO.AnnotationRecord;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Entities.Collection;
import ird.sup.projectmanagementservice.Entities.DataSet;
import ird.sup.projectmanagementservice.Entities.MediaH.Image;
import ird.sup.projectmanagementservice.Entities.MediaH.Media;
import ird.sup.projectmanagementservice.Entities.Modele;
import ird.sup.projectmanagementservice.Entities.Specimen;
import ird.sup.projectmanagementservice.Enums.EState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class CsvService {

    @Autowired
    private SpecimenRepository specimenRepository;
    @Autowired
    private CollectionRepository collectionRepository;
    @Autowired
    private MediaRepository mediaRepository;
    @Autowired
    private DataSetRepository dataSetRepository;
    @Autowired
    private ModeleRepository modeleRepository;
    @Autowired
    private AnnotationRepository annotationRepository;
    @Autowired
    private AnnClassificationRepository annClassificationRepository;

    public void importCsv(MultipartFile file ,Long colId) throws IOException, CsvException {
        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> records = csvReader.readAll();
            if (records.isEmpty()) {
                throw new IOException("CSV file is empty");
            }

            // Lire l'en-tête
            String[] header = records.get(0);
            Map<String, Integer> columnIndexMap = getColumnIndexMap(header);
            Collection c = this.collectionRepository.findById(colId).get();
            for (int i = 1; i < records.size(); i++) {
                String[] record = records.get(i);

                Specimen specimen = new Specimen();
                specimen.setFamille(record[columnIndexMap.get("family")]);
                specimen.setGenre(record[columnIndexMap.get("genus")]);
                specimen.setEpitheteSpecifique(record[columnIndexMap.get("specificEpithet")]);
                specimen.setNomScientifique(record[columnIndexMap.get("scientificName")]);
                specimen.setNomScientifiqueAuteur(record[columnIndexMap.get("scientificNameAuthorship")]);
                specimen.setIdentificationRemarques(record[columnIndexMap.get("identificationRemarks")]);
                specimen.setEnregistrePar(record[columnIndexMap.get("recordedBy")]);
                specimen.setCatalogueCode(record[columnIndexMap.get("catalogNumber")]);
                specimen.setCodeInstitution(record[columnIndexMap.get("institutionCode")]);
                specimen.setCollectionCode(record[columnIndexMap.get("collectionCode")]);
                specimen.setPays(record[columnIndexMap.get("country")]);
                specimen.setCodePays(record[columnIndexMap.get("countryCode")]);
                specimen.setDepartement(record[columnIndexMap.get("stateProvince")]);
                specimen.setVille(record[columnIndexMap.get("county")]);
                specimen.setLieu(record[columnIndexMap.get("locality")]);
                specimen.setDateCreation(record[columnIndexMap.get("eventDate")]);
                specimen.setLatitude(parseFloat(record[columnIndexMap.get("decimalLatitude")]));
                specimen.setLongitude(parseFloat(record[columnIndexMap.get("decimalLongitude")]));

                Image image = new Image();

                image.setCodeMedia(record[columnIndexMap.get("occurrenceID")]);
                image.setImage_url(record[columnIndexMap.get("associatedMedia")]);
                image.setRdf_path(record[columnIndexMap.get("RDF_path")]);
                image.setImage_path(record[columnIndexMap.get("IMAGE_path")]);
                specimen.getMedias().add(image);
                specimen.setCollection(c);
                image.setSpecimen(specimen);
               specimen = specimenRepository.save(specimen);
               c.getSpecimens().add(specimen);
            }
        }
    }

    private Map<String, Integer> getColumnIndexMap(String[] header) {
        Map<String, Integer> columnIndexMap = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            columnIndexMap.put(header[i], i);
        }
        return columnIndexMap;
    }

    private Integer parseInteger(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    private Float parseFloat(String value) {
        try {
            return Float.parseFloat(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }


    public List<AnnClassification> importAnnotationsCSV(MultipartFile file) {
        List<AnnClassification> annClassifications = new ArrayList<>();
        try (InputStreamReader reader = new InputStreamReader(file.getInputStream())) {
            CsvToBean<AnnotationRecord> csvToBean = new CsvToBeanBuilder<AnnotationRecord>(reader)
                    .withType(AnnotationRecord.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

            List<AnnotationRecord> records = csvToBean.parse();

            // Example: process records
            for (AnnotationRecord record : records) {
                Optional<Media> media = mediaRepository.findById(record.getMediaId());
                if (media.isEmpty())
                    return null;
                Optional<DataSet> dataset = dataSetRepository.findById(record.getDatasetId());
                if (dataset.isEmpty())
                    return null;
                Optional<Modele> modele = modeleRepository.findById(record.getModelInferenceId());
                if (modele.isEmpty())
                    return null;
                Optional<AnnClassification> annClassification = annClassificationRepository.findAnnotationByDatasetAndMediaAndModel(dataset.get().getId(),media.get().getId(), modele.get().getId());
                if (annClassification.isPresent())
                    return null;
                AnnClassification annotation = new AnnClassification(record.getLibelle(), record.getValeurPrecision(), record.getValeurPredite(), media.get(), modele.get(), dataset.get());
                annotation.setEtat(EState.PENDING);
                annotation.setModeAquisition("Inference");
                AnnClassification newAnnotation = annotationRepository.save(annotation);
                annClassifications.add(newAnnotation);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to process file", e);
        }
        return annClassifications;
    }
    public List<AnnClassification> importAnnotationsJSON(MultipartFile file) {
        List<AnnClassification> annClassifications = new ArrayList<>();
        try {
            // Parse JSON content from the file using Jackson's ObjectMapper
            ObjectMapper objectMapper = new ObjectMapper();

            // Assuming your JSON is an array of AnnotationRecord objects
            List<AnnotationRecord> records = objectMapper.readValue(file.getInputStream(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, AnnotationRecord.class));

            // Process each record
            for (AnnotationRecord record : records) {
                Optional<Media> media = mediaRepository.findById(record.getMediaId());
                if (media.isEmpty())
                    return null;
                Optional<DataSet> dataset = dataSetRepository.findById(record.getDatasetId());
                if (dataset.isEmpty())
                    return null;
                Optional<Modele> modele = modeleRepository.findById(record.getModelInferenceId());
                if (modele.isEmpty())
                    return null;
                Optional<AnnClassification> annClassification = annClassificationRepository.findAnnotationByDatasetAndMediaAndModel(dataset.get().getId(), media.get().getId(), modele.get().getId());
                if (annClassification.isPresent())
                    return null;
                AnnClassification annotation = new AnnClassification(record.getLibelle(), record.getValeurPrecision(), record.getValeurPredite(), media.get(), modele.get(), dataset.get());
                annotation.setEtat(EState.PENDING);
                annotation.setModeAquisition("Inference");
                AnnClassification newAnnotation = annotationRepository.save(annotation);
                annClassifications.add(newAnnotation);
            }
        } catch (Exception e) {
            // Handle exception (e.g., log or rethrow)
            e.printStackTrace();
            return null;
        }
        return annClassifications;
    }
}
