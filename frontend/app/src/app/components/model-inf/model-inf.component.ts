import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {ProjetService} from "../../services/projet.service";

type ModelCategory = 'classification' | 'segmentation' | 'detection';

@Component({
  selector: 'app-model-inf',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './model-inf.component.html',
  styleUrl: './model-inf.component.css'
})
export class ModelInfComponent {

  currentStep: number = 1;
  modelId!: string;
  modele! : any;
  model! : any;
  message_err! : string;

  categoryDescriptions: Record<ModelCategory, string> = {
    classification: "Classification models are designed to categorize input data into predefined classes. They output a label that indicates the class to which the input belongs.",
    segmentation: "Segmentation models are used to partition an image into multiple segments or regions, each representing a different part of the image, often used for tasks such as object detection and image analysis.",
    detection: "Detection models identify and locate objects within an image or video, providing both the class of each object and its location within the frame."
  };

  constructor(private route: ActivatedRoute , private router : Router ,private projetService : ProjetService ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.modelId = params['id'];
    });

    this.projetService.func_get_Model(this.modelId).subscribe({
      next: (data) => {
        this.modele = data;
        console.log('le modele:', this.modele);

        this.model = {
          name: this.modele.name,
          description: this.modele.description,
          categorie: this.modele.categorie as ModelCategory,
          accuracy: '95%',
          loss: '0.92',
          example1: 'assets/Smooth_toothed.png',
          example2: 'Exemple de sortie 2',
          architectureImage: 'chemin/vers/image.png',
          numLayers: 5,
          numParams: 1000000,
          modelUsage: 'Le modèle YOLO pour classification de plantes prend en entrée des images représentant des plantes. Il retourne des prédictions indiquant si la plante est de type lisse ou dentée. Pour utiliser le modèle vous pouvez alimenter vos données d\'entrée dans le modèle pour effectuer des prédictions. Les sorties incluent des étiquettes indiquant la classification de chaque plante détectée, facilitant ainsi l\'automatisation de la classification des types de feuillage dans des images.'
      };
      },
      error: (err) => {
        this.message_err = err;
        console.error(`Erreur lors de la récupération du model par ID ${this.modelId}: `, err);
      }
    });
  }

  getCategoryDescription(): string {
    if (this.model?.categorie in this.categoryDescriptions) {
      return this.categoryDescriptions[this.model.categorie as ModelCategory];
    } else {
      return "No description available for this category.";
    }
  }
}
