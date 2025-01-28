package ird.sup.projectmanagementservice.Web;

import com.opencsv.exceptions.CsvException;
import ird.sup.projectmanagementservice.Services.CsvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@CrossOrigin(origins="*")
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
}
