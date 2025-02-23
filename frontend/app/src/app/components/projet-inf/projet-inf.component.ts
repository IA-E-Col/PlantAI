import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {CollectionComponent} from "../collection/collection.component";
import {ProjetService} from "../../services/projet.service";
import {DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-projet-inf',
  standalone: true,
  imports: [
    RouterOutlet,
    DatePipe,
    NgIf,
    NgForOf,
    NgStyle,
  ],
  templateUrl: './projet-inf.component.html',
  styleUrl: './projet-inf.component.css'
})
export class ProjetInfComponent implements OnInit {
  projectId!: string
  message_err! : string;
  projet! : any;
  etatDuProjet: string = 'enCours';
  createurPrj! :any
  collaborateurs! :any
  collections:any;
  nbr_c  = 0;
  nbr_s = 0;
  formatted_nbr_s: string = '';
  formatted_nbr_c: string = '';
  projets! : Array<any>

  cheminUser = "assets/user.png";
  cheminDtl = "assets/INFO1.png";
  constructor(private route: ActivatedRoute, private projetService :ProjetService) {
  }


  ngOnInit() {
    this.route.parent?.params.subscribe({
      next: (params) => {
        // Récupère le projet par ID
        this.projectId = params['id'];
        this.projetService.func_get_Id(this.projectId).subscribe({
          next: (data) => {
            this.projet = data;
            console.log('XXXXXXXxxxx', data);
            this.nbr_s = data.numberOfSpecimen;
            this.nbr_c =data.numberOfDataset;
          },
          error: (err) => {
            this.message_err = err;
            console.error(`Erreur lors de la récupération du projet par ID ${this.projectId}: `, err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des paramètres de la route: ', err);
      }
    });
  }
}
