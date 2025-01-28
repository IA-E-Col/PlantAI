import { NgForOf, NgIf } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { ProjetService } from "../../services/projet.service";
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-dataset-prediction',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgxPaginationModule,
    RouterOutlet,
    CommonModule,
    FilterPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './dataset-prediction.component.html',
  styleUrl: './dataset-prediction.component.css'
})
export class DatasetPredictionComponent {
  private IdDataset: any;
  annotations: any;
  isCalculated: boolean = true; //false
  Dataset: any;
  Specimens: any;
  Old_Specimens: any;
  p: number = 1;
  filterForm: FormGroup;
  familyOptions: string[] = [];
  genreOptions: string[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private projetService: ProjetService) {
    this.filterForm = this.fb.group({
      annotationModel: [''],
      validation: [''],
      minAccuracy: [''],
      maxAccuracy: [''],
      family: [''],
      genre: ['']
    });
  }

  onSubmit(): void {
    const formValue = this.filterForm.value;
    console.log('Form Value:', formValue);

    // Process form values
    const annotationModel = formValue.annotationModel;
    const validation = formValue.validation;
    const minAccuracy = formValue.minAccuracy;
    const maxAccuracy = formValue.maxAccuracy;
    const family = formValue.family;
    const genre = formValue.genre;

    let filteredSpecimens = this.Specimens;

    if (family) {
      console.log(`Family (${family}) is selected. Performing family-specific logic.`);
      filteredSpecimens = filteredSpecimens.filter((specimen: { famille: any; }) => specimen.famille === family);
    }
    else if (genre) {
      console.log(`Genre (${genre}) is selected. Performing genre-specific logic.`);
      filteredSpecimens = filteredSpecimens.filter((specimen: { genre: any; }) => specimen.genre === genre);
    }else{
      filteredSpecimens = this.Old_Specimens;
    }

    console.log(filteredSpecimens, "Filtered Specimens");

    // Update the state with the filtered specimens
    this.Specimens = filteredSpecimens;
    this.projetService.specimens = this.Specimens
    // Perform your logic here, e.g., filter data based on form values
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const navigation = window.history.state;
      this.IdDataset = navigation.dataset;
      this.projetService.func_get_dataset(this.IdDataset).subscribe({
        next: (data) => {

          this.Dataset = data;
          this.Specimens = this.Dataset.specimens
          console.log(this.Dataset, "dataset a l'interier de fonction ")
          console.log(this.Specimens, "Specimens a l'interier de fonction ")
          this.isCalculated = true;/***********************/

          this.familyOptions = [];
          this.genreOptions = [];

          this.Specimens.forEach((specimen: { famille: string; genre: string; }) => {
            if (specimen.famille && !this.familyOptions.includes(specimen.famille)) {
              this.familyOptions.push(specimen.famille);
            }
            if (specimen.genre && !this.genreOptions.includes(specimen.genre)) {
              this.genreOptions.push(specimen.genre);
            }
          });

          this.Old_Specimens = this.Specimens;

          console.log(this.familyOptions, "family options");
          console.log(this.genreOptions, "genre options");
        },
        error: err => {
          alert("erreur recuperation model");
        }
      })
      console.log(this.Dataset, "gggggggggggggggggggggggggggggggggggggggggggggggg")
      /*this.projetService.func_predict_dataset(this.IdDataset).subscribe({
        next: (data) => {

          this.annotations = data;
          this.isCalculated=true;
          console.log(data)
        },
        error: err => {
          alert("erreur recuperation model");
        }
      })*/
    });
  }


  protected readonly Date = Date;
  doPrediction(plante: any) {
    this.router.navigate(['/admin/AnnotationDetail'], { state: { plante: plante, modeleId: 1 } });
  }

  isGridView = false;
  setView(view: string): void {
    this.isGridView = view === 'grid';
  }

  iconState: 'default' | 'down' | 'up' = 'default';
  OrderBy() {
    if (this.iconState === 'default') {
      this.iconState = 'down';
    } else if (this.iconState === 'down') {
      this.iconState = 'up';
    } else if (this.iconState === 'up') {
      this.iconState = 'down';
    }
  }
  
}
