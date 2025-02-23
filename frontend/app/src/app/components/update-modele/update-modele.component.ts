import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProjetService} from "../../services/projet.service";
import {NgIf, NgForOf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import Swal from 'sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from "../../filter.pipe";

@Component({
  selector: 'app-update-modele',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    FilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './update-modele.component.html',
  styleUrl: './update-modele.component.css'
})
export class UpdateModeleComponent {

  modelFormGroup! : FormGroup
  
  constructor(private fb: FormBuilder, private projetService: ProjetService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(){}

  modifier_mdl(){


    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to modify this model. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, modify model',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procédez à la modification du model

      }
    });

  }

}
