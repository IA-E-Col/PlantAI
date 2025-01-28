import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, Validators} from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProjetService} from "../../services/projet.service";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";



@Component({
  selector: 'app-images-form',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    DatePipe,
    FormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './images-form.component.html',
  styleUrl: './images-form.component.css'
})
export class ImagesFormComponent {
  afficherBouton: boolean = true;
  cheminPlante = 'assets/plante.png';
  p: number = 1;
  searchtext: any;
  plantes: any;
  test!: any
  id: string = '';
  isGridView = false;
  nb_img: number = 0;

  // Tableau d'objets contenant les informations sur chaque plante
  /*plantes = [
    {
      nom: 'Rose',
      description: 'The rose is a type of flowering shrub. Its name comes from the Latin word Rosa. The flowers of the rose grow in many different colors, from the well-known red rose or yellow roses to white roses and even purple or blue roses.',
      taille: 'Medium to Large',
      genre: 'Rosa'
    },
    {
      nom: 'Sunflower',
      description: 'Sunflowers are usually tall annual or perennial plants that grow to a height of 300 cm (120 in) or more.',
      taille: 'Large',
      genre: 'Helianthus'
    },
    {
      nom: 'Orchid',
      description: 'Orchids are a diverse and widespread family of flowering plants, with blooms that are often colorful and fragrant.',
      taille: 'Small to Medium',
      genre: 'Orchidaceae'
    },
    {
      nom: 'Cactus',
      description: 'Cacti are succulent plants in the family Cactaceae, known for their distinctive appearance, often with spines and specialized photosynthetic stems.',
      taille: 'Small to Medium',
      genre: 'Cactaceae'
    },
    {
      nom: 'Tulip',
      description: 'Tulips are spring-blooming perennials that grow from bulbs. They are known for their vibrant colors and cup-shaped flowers.',
      taille: 'Small to Medium',
      genre: 'Tulipa'
    }
  ];*/

  constructor(private route: ActivatedRoute, private router: Router, private projetService: ProjetService) { }

  ngOnInit(): void {
    this.afficherBouton = this.route.snapshot.data['afficherBouton'] !== false;
    this.id = this.projetService.projet.id;

    this.route.params.subscribe(params => {
      this.test = params['id'];
      this.handleDataChange();
    });

    this.route.queryParams.subscribe(params => {
      this.handleDataChange();
    });
  }

  handleDataChange(): void {
    console.log('Executing handleDataChange');
    if (this.test === '17') {
      console.log('Loading specimens for ID 17');
      this.plantes = this.projetService?.specimens;
      this.nb_img=this.plantes.length
    } else {
      this.plantes = this.projetService.collection_actuelle?.specimens;
      this.nb_img=this.plantes.length
    }
    console.log(this.plantes);
  }


  navigateToImageInf(plante: any) {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: this.plantes }
    });
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

}
