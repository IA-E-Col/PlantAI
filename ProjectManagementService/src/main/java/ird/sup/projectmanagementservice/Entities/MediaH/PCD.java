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
@AllArgsConstructor
public class PCD extends Media {
String fileName;
String pcdNumber;
String path;
}
