package ird.sup.projectmanagementservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filtres {
    List<List<String>> test;
    List<selectedAnnotation> selectedAnnotations;
}
