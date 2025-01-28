package ird.sup.projectmanagementservice.Web;


import ird.sup.projectmanagementservice.DAO.AnnotationSpecimenRepository;
import ird.sup.projectmanagementservice.DAO.SpecimenRepository;
import ird.sup.projectmanagementservice.DTO.Filtres;
import ird.sup.projectmanagementservice.Entities.AnnotationH.Annotation;
import ird.sup.projectmanagementservice.Entities.Specimen;
import ird.sup.projectmanagementservice.Services.SpecimenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/specimen")
public class SpecimenController {

    @Autowired
    private SpecimenService ss;
    @Autowired
    private SpecimenRepository s;
    @Autowired
    private AnnotationSpecimenRepository a;

    @GetMapping("/ValeurFilters")
    public ResponseEntity<List<List>> ChampsFiltre(){
        return ResponseEntity.ok(ss.getChamps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Specimen> getSpecimen(@PathVariable Long id){
        return ResponseEntity.ok(s.findById(id).get());
    }
    @GetMapping("/Annotation/{id}")
    public ResponseEntity<Annotation> getAnnotation(@PathVariable Long id){
        return ResponseEntity.ok(a.findById(id).get());
    }

    @GetMapping("/MoteurRecherche")
    public ResponseEntity<List<Specimen>> moteurrecherche(){
        return ResponseEntity.ok(ss.getAllSpecimen());
    }

    @PostMapping("/MR/{idProjet}")
    public ResponseEntity<List<Specimen>> filtrer(@RequestBody Filtres f, @PathVariable Long idProjet){
        return ResponseEntity.ok(ss.getSpecimensFilteredBy(f.getTest(),f.getSelectedAnnotations(),idProjet));
    }


}
