package ird.sup.projectmanagementservice.DTO;
import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnnotationRecord {

    @CsvBindByName(column = "ann_specification")
    private String annSpecification;

    @CsvBindByName(column = "libelle")
    private String libelle;

    @CsvBindByName(column = "valeur_precision")
    private float valeurPrecision;

    @CsvBindByName(column = "valeur_predite")
    private String valeurPredite;

    @CsvBindByName(column = "media_id")
    private Long mediaId;

    @CsvBindByName(column = "model_inference_id")
    private Long modelInferenceId;

    @CsvBindByName(column = "dataset_id")
    private Long datasetId;
}
