package ird.sup.projectmanagementservice.Web;

import com.opencsv.exceptions.CsvException;
import ird.sup.projectmanagementservice.DTO.Message;
import ird.sup.projectmanagementservice.Entities.AnnotationH.AnnotationSP.AnnClassification;
import ird.sup.projectmanagementservice.Enums.EFormat;
import ird.sup.projectmanagementservice.Services.CsvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins="*")
@RequestMapping("/api/import")
@RestController
public class CsvController {

    @Autowired
    private CsvService csvService;

    @PostMapping("/import-csv/{colId}")
    public int importCsv(@RequestPart("file") MultipartFile file, @PathVariable Long colId) {
        try {
            csvService.importCsv(file, colId);
            return 1;
        } catch (IOException | CsvException e) {
            return 0;
        }
    }
    @PostMapping("/import-annotations")
    public ResponseEntity<?> importAnnotationCSV(@RequestPart("file") MultipartFile file, @RequestParam("format") String format) {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".") + 1) : "";
        // Check the file extension
        List<AnnClassification> annClassifications;
        if (fileExtension.equalsIgnoreCase("csv") && format.equals(EFormat.CSV.name()))
            annClassifications = csvService.importAnnotationsCSV(file);

        else if (fileExtension.equalsIgnoreCase("json") && format.equals(EFormat.JSON.name()))
            annClassifications = csvService.importAnnotationsJSON(file);

        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Message("Invalid file format. Please upload a CSV or JSON file."));
        }
        if (annClassifications == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Message("media, dataset or model does not exist or the annotation created for these parameters already exists"));
        return ResponseEntity.ok(annClassifications);
    }
}
