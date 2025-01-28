import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-collection-info',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './collection-info.component.html',
  styleUrl: './collection-info.component.css'
})
export class CollectionInfoComponent {

  collectionId: any;
  collection: any;
  errorMessage!: string;
  private routeSub!: Subscription;
  cheminDtl = "assets/INFO1.png";
  NbSpecimens: any;

  constructor(private projetService: ProjetService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.routeSub = this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('id') || params.get('Id');
      console.log('Collection ID:', this.collectionId);  // Debugging purpose
    });

    this.projetService.func_get_collection_by_id(this.collectionId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'An error occurred while fetching collection';
          // Optionally, you can log the error or handle it as needed
          console.error('Error fetching collection', error);
          return of([]);
        })
      )
      .subscribe(
        (collection) => {
          console.log('la collection', collection)
          this.collection = collection;
        }
      );

    this.projetService.func_get_SpecimenByCollection(this.collectionId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'An error occurred while fetching collection';
          // Optionally, you can log the error or handle it as needed
          console.error('Error fetching collection', error);
          return of([]);
        })
      )
      .subscribe(
        (specimens) => {
          console.log(specimens)
          this.NbSpecimens = specimens.length;
        }
      );
  }

}
