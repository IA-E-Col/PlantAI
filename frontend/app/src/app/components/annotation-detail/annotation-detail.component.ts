import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ImageService } from '../../services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
interface Commentaire {
  id: number;
  commentaire: string;
  createurC: {
    prenom: string;
    nom: string;
  };
  avatar?: string;  // L'avatar est optionnel
}

@Component({
  selector: 'app-annotation-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './annotation-detail.component.html',
  styleUrl: './annotation-detail.component.css'
})

export class AnnotationDetailComponent {
  commentss: Commentaire[] = [];

  comments : any = [];
  /****************/
  faUserCircle = faUserCircle;
  idModele: any;
  Specimen: any;
  Model: any;
  Annotation: any;
  class: any;
  isValide: any;
  correct: any;
  Plots!: Array<any>;
  isLoad: boolean = true;
  favorPercentage: number = 0;
  againstPercentage: number = 0;

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
  newComment: string = '';
  userId!: any;
  evaluations: any;
  datasetId!: any
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
      this.datasetId = params.get('datasetId');
      const navigation = window.history.state;
      const specimenId = params.get('specimenId')
      this.projetservice.func_get_Specimen(specimenId).subscribe({
        next: (data) => {
          this.Specimen = data;
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to load specimen', 'error');
          console.error(err);
        }
      });
      this.idModele = params.get('modelId');
      console.log("the model id receved ", this.idModele)
    this.projetservice.func_predict(specimenId, this.idModele,this.datasetId).subscribe({
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
        this.projetservice.getEvaluations(this.Annotation.id).subscribe(
          {
            next: (evaluations) => {
              this.evaluations = evaluations;
              this.calculateVotePercentages();
              console.log("those are the evaluations:", evaluations)
            },
            error: err => {
              alert("erreur recuperation evaluations");
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
  });
  
  }

  addComment() {
    console.log('Nouveau commentaire:', this.newComment);
    if (this.newComment) {
      console.log("commentaire ", { id: null, commentaire: this.newComment })
      this.projetservice.addCommentToAnnotation(this.Annotation.id, this.userId, { id: null, commentaire: this.newComment }).subscribe(
        {
          next: (newCommentaire) => {
            console.log("commentaire added", newCommentaire)
            this.comments = [...this.comments,newCommentaire];
          },
          error: err => {
            alert("erreur recuperation model");
          }
        }
      )
      // Réinitialiser le champ de texte
      this.newComment = '';
    }
  }
  deleteComment(idCommentaire: number) {
    console.log('Suppression du commentaire avec id:', idCommentaire);
    
    this.projetservice.deleteCommentFromAnnotation(this.Annotation.id, this.userId, idCommentaire).subscribe(
      {
        next: (response) => {
          console.log('Commentaire supprimé avec succès:', response);
          // Mettre à jour la liste des commentaires
          this.comments = this.comments.filter((comment:any) => comment.id !== idCommentaire);
        },
        error: err => {
          console.error('Erreur lors de la suppression du commentaire:', err);
          alert("Erreur lors de la suppression du commentaire");
        }
      }
    );
  }

  // Méthode pour mettre à jour un commentaire
  updateComment(idCommentaire: number, newComment: string) {
    console.log('Mise à jour du commentaire avec id:', idCommentaire, 'Nouveau texte:', newComment);
    
    const updatedComment = { commentaire: newComment };
    
    this.projetservice.updateCommentOnAnnotation(this.Annotation.id, this.userId, idCommentaire, updatedComment).subscribe(
      {
        next: (updatedCommentaire) => {
          console.log('Commentaire mis à jour avec succès:', updatedCommentaire);
          // Mettre à jour la liste des commentaires avec le commentaire mis à jour
          this.comments = this.comments.map((comment:any) => 
            comment.id === idCommentaire ? { ...comment, commentaire: updatedCommentaire.commentaire } : comment
          );
        },
        error: err => {
          console.error('Erreur lors de la mise à jour du commentaire:', err);
          alert("Erreur lors de la mise à jour du commentaire");
        }
      }
    );
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
  submitVote(value : boolean)  {
    this.projetservice.submitVote(this.Annotation.id, this.userId, value).subscribe({
      next: (newEvaluation) => {
        this.evaluations = [...this.evaluations.filter((evaluation:any) => evaluation.userId != this.userId),newEvaluation];
        this.calculateVotePercentages();
      },
      error: err => {
        alert("erreur lors du vote");
      }
    }

    )
  }
  calculateVotePercentages(): void {
    const totalValue = this.evaluations.reduce((sum:any, vote:any) => sum + vote.e.value, 0);

    const favorVotes = this.evaluations
      .filter((evaluation : any) => evaluation.vote === true)
      .reduce((sum : any, evaluation:any) => sum + evaluation.e.value, 0);

    const againstVotes = this.evaluations
      .filter((evaluation:any) => evaluation.vote === false)
      .reduce((sum:any, evaluation:any) => sum + evaluation.e.value, 0);

    this.favorPercentage = totalValue ? (favorVotes / totalValue) * 100 : 0;
    this.againstPercentage = totalValue ? (againstVotes / totalValue) * 100 : 0;
  }
  approveAnnotation() : void {
    this.projetservice.updateAnnotationState(this.Annotation.id, 'APPROVED').subscribe({
      next: (newAnnotation) => {
        this.Annotation = newAnnotation;
        this.calculateVotePercentages();
      },
      error: err => {
        alert("erreur lors du vote");
      }
    }
    
    )
  }
  rejectAnnotation() : void {
    this.projetservice.updateAnnotationState(this.Annotation.id, 'REJECTED').subscribe({
      next: (newAnnotation) => {
        this.Annotation = newAnnotation;
        this.calculateVotePercentages();
      },
      error: err => {
        alert("erreur lors de la mise à jour de l'annotation");
      }
    }
    
    )
  }
}
