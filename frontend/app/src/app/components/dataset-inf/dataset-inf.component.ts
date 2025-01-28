import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from "../../services/projet.service";

@Component({
  selector: 'app-dataset-inf',
  standalone: true,
  imports: [],
  templateUrl: './dataset-inf.component.html',
  styleUrl: './dataset-inf.component.css'
})
export class DatasetInfComponent {
  cheminDtl = "assets/INFO1.png";
  IdCollection!: any;
  DatasetNam!: any;
  DatasetDescription!: any;
  DatasetImages!: any;

  constructor(private route: ActivatedRoute, private projetservice: ProjetService) { }

  ngOnInit() {
    this.IdCollection = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('Id');

    this.projetservice.func_get_dataset(this.IdCollection).subscribe({
      next: (data) => {
        console.log(data)
        this.DatasetNam = data.name;
        this.DatasetDescription = data.description;
        this.DatasetImages = data.numberOfSpecimen;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
