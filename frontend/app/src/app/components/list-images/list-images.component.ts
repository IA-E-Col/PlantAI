import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";

import { FormsModule, Validators } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProjetService } from "../../services/projet.service";

import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-list-images',
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
  templateUrl: './list-images.component.html',
  styleUrls: ['./list-images.component.css'],
})

export class ListImagesComponent implements OnInit {

  afficherBouton: boolean = true;
  cheminPlante = 'assets/plante.png';
  p: number = 1;
  searchtext: any;
  plantes: any;
  Old_plantes: any;
  test!: any
  id: string = '';
  isGridView = false;

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
    console.log('specimens list images:', this.projetService.specimens);
    /* this.route.params.subscribe(params => {
       this.test = params['id'];
       console.log(this.test);
       this.handleDataChange();
     });*/
    this.test = this.route.snapshot.parent?.paramMap.get('id');
    console.log(this.test, "daba khdam ?"); // Maintenant vous pouvez utiliser idCollection
    this.handleDataChange();
    /* this.route.queryParams.subscribe(params => {
       this.handleDataChange();
     });*/
  }

  handleDataChange(): void {
    console.log('Executing handleDataChange');

    if (Number(this.test) <= 0) {
      console.log('Loading specimens for ID 0');
      this.plantes = this.projetService.specimens;
      this.sortPlantsByScientificName(); // Trier les plantes après avoir les données
      this.Old_plantes = this.plantes;
      this.extractDistinctValues();
    } else {
      this.projetService.func_get_SpecimenByDataset(this.test).subscribe(
        (specimens) => {
          console.log(specimens);
          this.plantes = specimens;
          this.sortPlantsByScientificName(); // Trier les plantes après avoir les données
          this.Old_plantes = this.plantes;
          this.extractDistinctValues();
        }
      );
    }
    console.log(this.plantes);
  }

  sortPlantsByScientificName(): void {
    this.plantes.sort((a: { nomScientifique: number; }, b: { nomScientifique: number; }) => {
      if (a.nomScientifique < b.nomScientifique) {
        return -1;
      } else if (a.nomScientifique > b.nomScientifique) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  navigateToImageInf(plante: any) {
    this.router.navigate([`/admin/datasets/${this.test}/images`, plante.id], {
      state: { plante: plante, plantes: this.plantes }
    });
  }

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => {
      // Check if the word contains a period or ends with a period, or is '&'
      if (word.includes('.') || word.endsWith('.') || word === '&') {
        return word; // Return word as is
      } else {
        return `<i>${word}</i>`; // Italicize other words
      }
    }).join(' '); // Join words back into a string
  }

  filterMenuActive: boolean = false;

  distinctGenera: string[] = [];
  distinctFamilies: string[] = [];
  distinctSpecificEpithets: string[] = [];

  filters = {
    Genus: '',
    Family: '',
    SpecificEpithet: ''
  };

  toggleFilterMenu() {
    this.filterMenuActive = !this.filterMenuActive;
  }

  resetFilters() {
    this.filters = {
      Genus: '',
      Family: '',
      SpecificEpithet: ''
    };
    this.plantes = this.Old_plantes; 
    this.extractDistinctValues();
    this.toggleFilterMenu()
  }

  applyFilters() {
    if (this.filters.Genus === '' && this.filters.Family === '' && this.filters.SpecificEpithet === '') {
      this.resetFilters();
    } else {
      this.plantes = this.Old_plantes.filter((plante: { genre: string; famille: string; epitheteSpecifique: string; }) => {
        return (
          (this.filters.Genus === '' || plante.genre === this.filters.Genus) &&
          (this.filters.Family === '' || plante.famille === this.filters.Family) &&
          (this.filters.SpecificEpithet === '' || plante.epitheteSpecifique === this.filters.SpecificEpithet)
        );
      });
    }
    this.extractDistinctValues();
    this.toggleFilterMenu()
  }

  extractDistinctValues() {
    const generaSet = new Set<string>();
    const familiesSet = new Set<string>();
    const specificEpithetsSet = new Set<string>();

    this.plantes.forEach((plante: { genre: string; famille: string; epitheteSpecifique: string; }) => {
      if (plante.genre) {
        generaSet.add(plante.genre);
      }
      if (plante.famille) {
        familiesSet.add(plante.famille);
      }
      if (plante.epitheteSpecifique) {
        specificEpithetsSet.add(plante.epitheteSpecifique);
      }
    });

    this.distinctGenera = Array.from(generaSet);
    this.distinctFamilies = Array.from(familiesSet);
    this.distinctSpecificEpithets = Array.from(specificEpithetsSet);
  }

}
