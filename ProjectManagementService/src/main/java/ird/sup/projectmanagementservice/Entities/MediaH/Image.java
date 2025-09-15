package ird.sup.projectmanagementservice.Entities.MediaH;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("img")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Image extends Media {
    String image_url;
    String image_path;
    // Note: resolution and taille are now inherited from Media as String
    // Additional Image-specific fields can be added here if needed
}
