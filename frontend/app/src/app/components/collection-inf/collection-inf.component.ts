import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {ProjetService} from "../../services/projet.service";
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';



@Component({
  selector: 'app-collection-inf',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    FilterPipe,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './collection-inf.component.html',
  styleUrl: './collection-inf.component.scss'
})
export class CollectionInfComponent {
  collection:any;
  IdCollection:any;
  searchtext:any;
  modeles! : Array<any>
  m: number = 1;

  constructor(private route: ActivatedRoute, private router : Router,private projetservice:ProjetService) {
  }

  ngOnInit() {
    this.collection = this.projetservice.collection_actuelle
    this.IdCollection = this.collection.id
    console.log(this.IdCollection)
    console.log('hnnnnnaaa',this.collection)
    this.modeles = [
      {
        id: 'ML001',
        nom: 'ResNet-50',
        dateCreation: '23/05/2015',
        version: 'V1',
        description: "ResNet-50 est un modèle de réseau de neurones convolutionnel qui a révolutionné la vision par ordinateur grâce à sa profondeur exceptionnelle.",
        nombre_c: '135',
        accuracy: '95%',
        loss: '0.1'
      },
      {
        id: 'ML002',
        nom: 'LSTM',
        dateCreation: '23/05/2023',
        version: 'V5',
        description: "LSTM (Long Short-Term Memory) est un type de réseau de neurones récurrents capable de retenir des informations sur de longues périodes.",
        nombre_c: '135',
        accuracy: '92%',
        loss: '0.15'
      },
      {
        id: 'ML003',
        nom: 'Transformer',
        dateCreation: '23/05/2022',
        version: 'V3',
        description: "Le Transformer est un modèle de réseau de neurones principalement utilisé pour les tâches de traitement du langage naturel. Il est basé sur le mécanisme d'attention.",
        nombre_c: '135',
        accuracy: '93%',
        loss: '0.12'
      },
      {
        id: 'ML004',
        nom: 'YOLOv7',
        dateCreation: '20/05/2010',
        version: 'V7',
        description: "YOLOv7 est une méthode avancée de détection d'objets en temps réel utilisant un réseau de neurones convolutionnel. Elle est reconnue pour sa précision et sa rapidité dans la localisation et l'identification d'objets dans des images ou des vidéos.",
        nombre_c: '10',
        accuracy: '98%',
        loss: '0.08'
      }
    ];
  }

}
