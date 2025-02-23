import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from "sweetalert2";
import { FormsModule } from '@angular/forms';
import { faInfoCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-dataset-model',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    FilterPipe,
    CommonModule,
    NgxPaginationModule,
    FontAwesomeModule
  ],
  templateUrl: './dataset-model.component.html',
  styleUrl: './dataset-model.component.css'
})
export class DatasetModelComponent {
  searchtext: any;
  modeles!: Array<any>
  m: number = 1;
  faPlay = faPlay
  faInfoCircle = faInfoCircle

  private Dataset: any;

  constructor(private route: ActivatedRoute, private router: Router, private projetservice: ProjetService) {
  }

  ngOnInit() {
    this.projetservice.func_get_All_models().subscribe({
      next: (data) => {
        this.modeles=data;
        },
  
      error: (err) => {
        Swal.fire('Error', 'Failed to load models', 'error');
        console.error(err);
      }
    });


    this.route.parent?.params.subscribe(params => {
          this.Dataset = params['id'];
        });
    
  }

  doPrediction(modeleId :any) {
    console.log(this.Dataset)
    this.router.navigate([`/admin/datasets/${this.Dataset}/datasetPrediction/${modeleId}`]);
  }

  info_model(id: any){
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
  }
}
