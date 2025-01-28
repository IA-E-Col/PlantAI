import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ImageService } from '../../services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-annotation-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './annotation-detail.component.html',
  styleUrl: './annotation-detail.component.css'
})
export class AnnotationDetailComponent {

  /****************/
  idModele: any;
  Specimen: any;
  Model: any;
  Annotation: any;
  class: any;
  isValide: any;
  correct: any;
  Plots!: Array<any>;
  isLoad: boolean = true;

  /****************/
  SpecimenPath: string | null = null;
  heatmapUrl: string | null = null;
  statsUrls: any = {};
  classes: any;
  classeCorrect: any;
  userString!: any;

  /****************/
  descriptionsVisible: boolean[] = [];
  selectedValue: any;
  comments!: any;
  newComment: string = '';
  userId!: any;
  private user!: any;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private projetservice: ProjetService, private imageService: ImageService) {
    this.userString = localStorage.getItem("authUser");
    this.user = JSON.parse(this.userString);
    this.userId = this.user.user.id; // recuperer aussi les projets collab
    this.descriptionsVisible = Array(8).fill(false)
  }

  processImage(): void {
    if (this.SpecimenPath) {
      this.getHeatmap();
      this.getAllStats();
    } else {
      console.error("SpecimenPath is null");
    }
  }

  getHeatmap(): void {
    const ModeleId = this.idModele;
    if (this.SpecimenPath) {
      this.imageService.getHeatmap(this.SpecimenPath, ModeleId).subscribe((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.heatmapUrl = objectURL;
        console.log('heatmapUrl:', this.heatmapUrl)
      });
    } else {
      console.error("SpecimenPath is null");
    }
  }

  getAllStats(): void {
    if (this.SpecimenPath) {
      this.imageService.getAllStats(this.SpecimenPath).subscribe((urls: any) => {
        this.statsUrls = urls;
        console.log('statsUrls:', this.statsUrls)
      });
    } else {
      console.error("SpecimenPath is null");
    }
  }

  toggleDescription(index: number) {
    this.descriptionsVisible[index] = !this.descriptionsVisible[index];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const navigation = window.history.state;
      this.Specimen = navigation.plante;
      this.idModele = navigation.modeleId;
      console.log("the model id receved ", this.idModele)
    });

    this.projetservice.func_predict(this.Specimen.id, this.idModele).subscribe({
      next: (data) => {
        console.log(data)
        this.Annotation = data;
        if (this.Annotation.valide) {
          this.isValide = "Validé";
        } else {
          this.isValide = "Non Validé";
        }
        this.projetservice.getComments(this.Annotation.id).subscribe(
          {
            next: (data) => {
              this.comments = data;
              console.log("this is the comments", data)
            },
            error: err => {
              alert("erreur recuperation model");
            }
          }
        )
        this.projetservice.func_get_Classes_ByModel(this.idModele).subscribe(
          {
            next: (data) => {
              this.classes = data;
              for (const classe of this.classes) {
                if (classe.identifier === this.Annotation.valeurCorrecte) {
                  this.classeCorrect = classe.name;
                }
              }
              this.isLoad = false;
              console.log("this is the classes", data)
            },
            error: err => {
              alert("erreur recuperation classes");
            }
          }
        )

      },
      error: err => {
        alert("erreur recuperation model");
      }
    })

    this.projetservice.func_get_Model(this.idModele).subscribe(
      {
        next: (data) => {
          this.Model = data;
          console.log("this is the model", data)
        },
        error: err => {
          alert("erreur recuperation model");
        }
      }
    )
  }

  addComment() {
    console.log('Nouveau commentaire:', this.newComment);
    if (this.newComment) {
      console.log("commentaire ", { id: null, commentaire: this.newComment })
      this.projetservice.addCommentToAnnotation(this.Annotation.id, this.userId, { id: null, commentaire: this.newComment }).subscribe(
        {
          next: (data) => {
            console.log("commentaire added", data)
            this.ngOnInit()
          },
          error: err => {
            alert("erreur recuperation model");
          }
        }
      )

      // Réinitialiser le champ de texte
      this.newComment = '';
    }

    /* openCommentDialog() {
       const dialogRef = this.dialog.open(CommentDialogComponent, {
         width: '400px'
       });
   
       dialogRef.afterClosed().subscribe(result => {
         if (result) {
           console.log('Comment:', result);
   
           this.isValide = "validé";
           console.log(this.selectedValue)
           this.correct = this.selectedValue;
         }
       });*/
  }

  openCommentDialog(comments: string[]) {
    if (comments.length != 0){
      const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '500px',
      data: { comments: comments }
    });

    dialogRef.afterClosed().subscribe(result => {
    });}
  }

  updateAnnotation() {

    console.log(this.selectedValue)
    this.Annotation.valeurCorrecte = this.selectedValue;
    this.Annotation.valide = true;
    console.log("annotation sended", this.Annotation)
    this.projetservice.func_update_annotation(this.Annotation).subscribe({
      next: (data) => {
        console.log("annotation updated", data)
        this.ngOnInit();
      },
      error: err => {
        alert("erreur recuperation annotation");
      }
    }

    )

  }

  openImageInNewWindow() {
    window.open(this.Specimen.image.image_url, '_blank');
  }
}
