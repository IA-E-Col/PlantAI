package ird.sup.projectmanagementservice.Entities.MediaH;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@DiscriminatorValue("pcd")
@Data
@NoArgsConstructor
public class PCD extends Media {
    // Note: fileName, pcdNumber, and path are now inherited from Media
    // as file_name, pcd_number, and path respectively
    // Additional PCD-specific fields can be added here if needed
}
