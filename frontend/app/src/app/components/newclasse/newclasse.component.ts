import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProjetService} from "../../services/projet.service";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ClasseComponent} from "../classe/classe.component";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-newclasse',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './newclasse.component.html',
  styleUrl: './newclasse.component.css'
})
export class NewclasseComponent {
  classeForm: FormGroup;

  constructor( private dialogRef: MatDialogRef<NewclasseComponent>,private route: ActivatedRoute, private router: Router,private fb: FormBuilder, private projetService: ProjetService) {
    this.classeForm = this.fb.group({
      name: ['', Validators.required],
      identifier: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.classeForm.valid) {
      this.projetService.addClasse(this.classeForm.value).subscribe(
        response => {
          console.log('Classe added successfully', response);
          //this.router.navigate(['/admin/classes']);
          this.dialogRef.close();

        },
        error => {
          console.error('Error adding classe', error);
        }
      );
    }
  }
}
