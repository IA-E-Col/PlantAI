import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { ProjetService } from "../../services/projet.service";
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-cree-modele',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    RouterOutlet,
    FormsModule,
    CommonModule
  ],
  templateUrl: './cree-modele.component.html',
  styleUrls: ['./cree-modele.component.css']
})
export class CreeModeleComponent implements OnInit {
  currentStep: number = 1;
  additionalClassSelects: number[] = [];
  classes: any[] = [];
  modelData = {
    name: '',
    description: '',
    urlModele: '',
    categorie: '',
  };
  classesAnnotation: any []=[""]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projetServ: ProjetService,
    private dialogRef: MatDialogRef<CreeModeleComponent>
  ) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.projetServ.func_get_All_classe().subscribe(
      response => {
        this.classes = response;
      },
      error => {
        console.error('Error fetching classes', error);
      }
    );
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.currentStep === 3) {
      console.log(this.modelData)
     this.projetServ.addModel(this.modelData).subscribe(
        response => {
         console.log('Model added successfully!', response);
         this.projetServ.addClassesToModel(response.id,this.classesAnnotation).subscribe(
           response => {
             console.log('classes added successfully!', response);
             this.dialogRef.close();
           },
           error => {
             console.error('Error adding classes', error);
           }
         );
        },
        error => {
          console.error('Error adding model', error);
       }
      );
    } else {
      this.nextStep();
    }
  }

  cancel() {
    this.router.navigateByUrl("/admin/projets");
    console.log('Form cancelled!');
  }

  addClass() {
    this.additionalClassSelects.push(this.additionalClassSelects.length);
    //this.modelData.classes.push('');  // Add a new empty class identifier
  }

  removeClass(index: number) {
    this.additionalClassSelects.splice(index, 1);
    this.classesAnnotation.splice(index + 1, 1);  // Remove the class identifier at the same index
  }
}
