import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from "sweetalert2";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dataset-model',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    FilterPipe,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './dataset-model.component.html',
  styleUrl: './dataset-model.component.css'
})
export class DatasetModelComponent {
  searchtext: any;
  modeles!: Array<any>
  m: number = 1;

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


    this.Dataset = this.route.snapshot.queryParamMap.get('IdDataset');
   console.log(this.Dataset)
  }

  doPrediction(modeleId :any) {
    this.router.navigate(['/admin/DatasetPrediction'], {state: {dataset :this.Dataset  ,modeleId: modeleId}});
  }

  info_model(id: any){
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
  }
}
