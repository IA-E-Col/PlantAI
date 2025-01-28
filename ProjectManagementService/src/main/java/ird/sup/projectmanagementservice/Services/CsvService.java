package ird.sup.projectmanagementservice.Services;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import ird.sup.projectmanagementservice.DAO.CollectionRepository;
import ird.sup.projectmanagementservice.DAO.MediaRepository;
import ird.sup.projectmanagementservice.DAO.SpecimenRepository;
import ird.sup.projectmanagementservice.Entities.Collection;
import ird.sup.projectmanagementservice.Entities.MediaH.Image;
import ird.sup.projectmanagementservice.Entities.MediaH.Media;
import ird.sup.projectmanagementservice.Entities.Specimen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CsvService {

    @Autowired
    private SpecimenRepository specimenRepository;
    @Autowired
    private CollectionRepository collectionRepository;
    @Autowired
    private MediaRepository mediaRepository;

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


}
