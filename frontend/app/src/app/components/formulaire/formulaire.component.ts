import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ProjetService } from "../../services/projet.service";
import {NavigationExtras, Router} from '@angular/router';
import { RouterModule } from '@angular/router';
interface ClasseAnnotation {
  id: number;
  identifier: string;
  name: string;
}

// Interface pour Modele
interface Modele {
  id: number;
  name: string;
  description: string;
  urlModele: string;
  categorie: string;
}

// Interface pour ModelResponse
interface ModelResponse {
  model: Modele;
  classes: ClasseAnnotation[];
  selectedClass: string | null; // Utilisation de 'number' pour correspondre à 'Long' en Java
}
@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})

// Define the Specimen interface

export class FormulaireComponent implements OnInit {

  filterValues: string[][] = [];
  message_err!: string
  familyOptions: string[] = [];
  genreOptions: string[] = [];
  specificEpithetOptions: string[] = [];
  scientificNameOptions: string[] = [];
  scientificNameAuthorOptions: string[] = [];
  countryOptions: string[] = [];
  cityOptions: string[] = [];
  locationOptions: string[] = [];
  departmentOptions: string[] = [];
  recordedByOptions: string[] = [];
  id: any;
  ModelsForAnnotations : ModelResponse[]=[];
  Filtres : {
  test: string[][];
  selectedAnnotations: { modelid: number; classeid: string | null }[];}={
    test: [],
    selectedAnnotations: []
  };
  p: number=1;
  constructor(private router: Router, private projetService: ProjetService) { }

  ngOnInit(): void {
    this.projetService.func_get_Champs_Filtre().subscribe({
      next: (data) => {
        this.filterValues = data;
        console.log(data);
        if (this.filterValues.length >= 0) {
          this.genreOptions = this.filterValues[9].filter(option => option !== null);
          this.specificEpithetOptions = this.filterValues[8].filter(option => option !== null);
          this.familyOptions = this.filterValues[7].filter(option => option !== null);
          this.scientificNameAuthorOptions = this.filterValues[15].filter(option => option !== null);
          this.scientificNameOptions = this.filterValues[6].filter(option => option !== null);
          this.departmentOptions = this.filterValues[5].filter(option => option !== null);
          this.cityOptions = this.filterValues[4].filter(option => option !== null);
          this.locationOptions = this.filterValues[3].filter(option => option !== null);
          this.recordedByOptions  = this.filterValues[2].filter(option => option !== null);
          this.countryOptions = this.filterValues[0].filter(option => option !== null);

          this.populateSuggestions();
          this.setupEventListeners();
        }
        console.log(data);
      },
      error: (err) => {
        this.message_err = err;
      }
    });
    this.projetService.func_get_All_modelsForFiltre().subscribe({
      next: (data) => {
        this.ModelsForAnnotations=data;
        console.log("models for filtre" ,data);
      },
      error: (err) => {
        this.message_err = err;
      }
    });
  }

  populateSuggestions(): void {
    const suggestions: { [key: string]: string[] } = {
      'Family': this.familyOptions,
      'Genre': this.genreOptions,
      'Specific Epithet': this.specificEpithetOptions,
      'Scientific Name': this.scientificNameOptions,
      'Scientific Name Author': this.scientificNameAuthorOptions,
      'Country': this.countryOptions,
      'City': this.cityOptions,
      'Location': this.locationOptions,
      'Department': this.departmentOptions,
      'Recorded By': this.recordedByOptions
    };

    console.log(suggestions);

    Object.keys(suggestions).forEach(key => {
      const datalist = document.getElementById(`${key.toLowerCase().replace(/\s+/g, '-')}-suggestions`) as HTMLDataListElement | null;
      if (datalist) {
        suggestions[key].forEach(value => {
          const option = document.createElement('option');
          option.value = value;
          datalist.appendChild(option);
        });
      }
    });
  }

  setupEventListeners(): void {
    const form = document.getElementById('tag-form') as HTMLFormElement;

    // Empêcher la soumission automatique du formulaire sur 'Enter'
    form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        event.preventDefault(); // Empêche la soumission par défaut sur 'Enter'
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();  //Empêche la soumission par défaut du formulaire
      this.handleSubmit(form); // Soumet le formulaire via votre méthode handleSubmit
    });

    const inputFields = form.querySelectorAll('.input-field');
    inputFields.forEach(inputField => {
      inputField.addEventListener('keyup', (event) => {
        const keyboardEvent = event as KeyboardEvent;
        const target = event.target as HTMLInputElement;
        if (keyboardEvent.key === 'Enter' && target.value.trim() !== '') {
          this.addTag(target.value.trim(), inputField.closest('.tag-container') as HTMLElement);
          target.value = '';
          event.stopPropagation(); //Empêche la propagation de l'événement pour éviter la soumission automatique du formulaire
        }
      });
    });
  }

  handleSubmit(form: HTMLFormElement): void {
    console.log(this.ModelsForAnnotations);
    this.Filtres.selectedAnnotations = this.ModelsForAnnotations.map(m => ({
      modelid: m.model.id,
      classeid: m.selectedClass,
    }));

    console.log("annotation filtre ", this.Filtres.selectedAnnotations);

    const allTags: { [key: string]: string[] } = {};
    const fieldContainers = form.querySelectorAll('.field-container');

    fieldContainers.forEach(container => {
      const label = container.querySelector('label')?.innerText || '';
      const tagContainer = container.querySelector('.tag-container') as HTMLElement;

      if (tagContainer) { // Ensure tagContainer is not null
        const tags = this.getUniqueTags(tagContainer);
        allTags[label] = tags;
      } else {
        console.warn(`No tag container found for ${label}`);
      }
    });

    console.log(allTags); // Here, you can send these data to the server in Angular

    const selectedOptions = [
      allTags['Country'],
      allTags['Genre'],
      allTags['Recorded By'],
      allTags['Family'],
      allTags['Specific Epithet'],
      allTags['Scientific Name'],
      allTags['Scientific Name Author'],
      allTags['City'],
      allTags['Department'],
      allTags['Location']
    ];
    this.Filtres.test=selectedOptions;
    console.log('ici tout les filtre', this.Filtres); // Here, you can send these data to the server in Angular
    this.projetService.func_get_Specimen_Filtred(this.Filtres,this.projetService.projet.id).subscribe({
      next: (data) => {
        this.id = this.projetService.projet.id;
        console.log('Data:', data);
        this.projetService.specimens = data;
        this.projetService.specimenstosend=data;
        console.log("specimenstosend",this.projetService.specimenstosend)
        console.log('specimens:', this.projetService.specimens);
        //const timestamp = new Date().getTime();
        //this.router.navigate(['/admin/formulaire/list_images/0'], { queryParams: { timestamp } });
        // Générer un timestamp unique à chaque navigation
        const timestamp = new Date().getTime();
        console.log("timestamp",timestamp)
        // Naviguer vers la même route avec les paramètres de navigation
        this.router.navigate(['/admin/formulaire/images-form/17'], { queryParams: { timestamp } });

      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getUniqueTags(tagContainer: HTMLElement): string[] {
    const tags: string[] = [];
    const tagValues = new Set<string>();

    const tagElements = tagContainer.getElementsByClassName('tag');
    for (let i = 0; i < tagElements.length; i++) {
      const tagElement = tagElements[i] as HTMLElement;
      let tagValue = tagElement.textContent?.trim() || '';

      // Remove the 'x' from the end of the tag if present
      if (tagValue.endsWith('x')) {
        tagValue = tagValue.slice(0, -1).trim();
      }

      if (!tagValues.has(tagValue)) {
        tagValues.add(tagValue);
        tags.push(tagValue);
      }
    }

    return tags;
  }


  getTags(tagContainer: HTMLElement): string[] {
    const tags: string[] = [];
    const tagElements = tagContainer.getElementsByClassName('tag');
    for (let i = 0; i < tagElements.length; i++) {
      const tagElement = tagElements[i] as HTMLElement;
      tags.push(tagElement.textContent?.trim() || '');
    }
    return tags;
  }

  removeTag(tag: HTMLElement, tagContainer: HTMLElement): void {
    tag.style.animation = 'fadeOut 0.3s';

    // Assurez-vous que la suppression se produit après l'animation
    setTimeout(() => {
      if (tag.parentElement === tagContainer) {
        tagContainer.removeChild(tag);
      }
    }, 100); // 300 ms correspond à la durée de l'animation fadeOut
  }

  addTag(value: string, tagContainer: HTMLElement): void {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerText = value;
    tag.style.background = '#007bff';
    tag.style.color = 'white';
    tag.style.padding = '5px 10px';
    tag.style.borderRadius = '20px';
    tag.style.display = 'flex';
    tag.style.alignItems = 'center';
    tag.style.transform = 'scale(0.8)';
    tag.style.animation = 'fadeIn 0.3s forwards';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerText = 'x';
    closeBtn.style.background = '#fff';
    closeBtn.style.color = '#007bff';
    closeBtn.style.marginLeft = '5px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.padding = '0 8px';
    closeBtn.style.fontWeight = 'bolder';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => {
      this.removeTag(tag, tagContainer); // Utilisation de la méthode removeTag pour supprimer le tag
    });

    tag.appendChild(closeBtn);
    tagContainer.insertBefore(tag, tagContainer.querySelector('.input-field'));
  }
}
