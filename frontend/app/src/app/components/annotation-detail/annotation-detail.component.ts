import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, ModelsActions, NavigationActions } from '../../store';
import { 
  selectAllModels,
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';
import { 
  selectNavigationDatasetId,
  selectNavigationModelId
} from '../../store/navigation/navigation.selectors';
import { 
  selectUser,
  selectUserId 
} from '../../store/auth/auth.selectors';

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
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './annotation-detail.component.html',
  styleUrl: './annotation-detail.component.css'
})

export class AnnotationDetailComponent implements OnInit, OnDestroy {
  // UI Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faUserCircle = faUserCircle;

  // NgRx Observables
  user$: Observable<any>;
  userId$: Observable<number | null>;
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  datasetId$: Observable<string | null>;
  modelId$: Observable<string | null>;
  
  // Reactive state management
  private commentsSubject = new BehaviorSubject<Commentaire[]>([]);
  comments$: Observable<Commentaire[]> = this.commentsSubject.asObservable();
  
  private evaluationsSubject = new BehaviorSubject<any[]>([]);
  evaluations$: Observable<any[]> = this.evaluationsSubject.asObservable();
  
  // Component state
  commentss: Commentaire[] = [];
  comments: any = [];
  showModal = false;
  editedText = '';
  selectedComment: any = null;
  
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
  
  SpecimenPath: string | null = null;
  heatmapUrl: string | null = null;
  statsUrls: any = {};
  classes: any;
  classeCorrect: any;
  userString!: any;
  
  descriptionsVisible: boolean[] = [];
  selectedValue: any;
  newComment: string = '';
  userId!: any;
  evaluations: any;
  datasetId!: any;
  private user!: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.user$ = this.store.select(selectUser);
    this.userId$ = this.store.select(selectUserId);
    this.models$ = this.store.select(selectAllModels);
    this.modelsLoading$ = this.store.select(selectModelsLoading);
    this.modelsError$ = this.store.select(selectModelsError);
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
    this.modelId$ = this.store.select(selectNavigationModelId);
    
    this.descriptionsVisible = Array(8).fill(false);
  }

  ngOnInit(): void {
    // Get user ID from NgRx store
    this.userId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.loadAnnotationData();
        }
      });
    
    // Subscribe to errors
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });
    
    console.log('Annotation detail component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnnotationData(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.datasetId = params.get('datasetId');
        const specimenId = params.get('specimenId');
        this.idModele = params.get('modelId');
        
        if (this.idModele) {
          this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: this.idModele }));
        }
        
        console.log('Loading annotation data:', { specimenId, modelId: this.idModele, datasetId: this.datasetId });
        
        // Generate mock data for demonstration
        this.generateMockAnnotationData(specimenId);
      });
  }

  private generateMockAnnotationData(specimenId: string | null): void {
    // Generate mock specimen
    this.Specimen = {
      id: specimenId,
      nom: 'Acacia senegalensis',
      nomScientifique: 'Acacia senegalensis',
      famille: 'Fabaceae',
      genre: 'Acacia',
      espece: 'senegalensis',
      pays: 'Senegal',
      image: {
        image_url: 'assets/uploads/specimen_1.jpg'
      }
    };
    
    this.SpecimenPath = this.Specimen.image.image_url;
    
    // Generate mock annotation
    this.Annotation = {
      id: Date.now(),
      valeurPredite: 'Acacia senegalensis',
      valeurCorrecte: 'acacia_senegalensis',
      precision: 0.95,
      valide: false,
      dateCreation: new Date().toISOString()
    };
    
    this.isValide = this.Annotation.valide ? "Validé" : "Non Validé";
    
    // Generate mock model
    this.Model = {
      id: this.idModele,
      nom: 'PlantNet African Model',
      description: 'AI model for African plant identification',
      version: '2.1.0',
      accuracy: 0.92
    };
    
    // Generate mock classes
    this.classes = [
      { id: 1, identifier: 'acacia_senegalensis', name: 'Acacia senegalensis' },
      { id: 2, identifier: 'panicum_maximum', name: 'Panicum maximum' },
      { id: 3, identifier: 'vernonia_amygdalina', name: 'Vernonia amygdalina' }
    ];
    
    // Find correct class
    for (const classe of this.classes) {
      if (classe.identifier === this.Annotation.valeurCorrecte) {
        this.classeCorrect = classe.name;
        break;
      }
    }
    
    // Generate mock comments
    const mockComments = this.generateMockComments();
    this.comments = mockComments;
    this.commentsSubject.next(mockComments);
    
    // Generate mock evaluations
    const mockEvaluations = this.generateMockEvaluations();
    this.evaluations = mockEvaluations;
    this.evaluationsSubject.next(mockEvaluations);
    this.calculateVotePercentages();
    
    this.isLoad = false;
    this.processImage();
    
    console.log('Mock annotation data loaded:', {
      specimen: this.Specimen,
      annotation: this.Annotation,
      model: this.Model,
      classes: this.classes,
      comments: this.comments.length,
      evaluations: this.evaluations.length
    });
  }

  private generateMockComments(): Commentaire[] {
    return [
      {
        id: 1,
        commentaire: 'This specimen shows typical characteristics of Acacia senegalensis.',
        createurC: {
          prenom: 'Marie',
          nom: 'Dubois'
        },
        avatar: 'assets/user.png'
      },
      {
        id: 2,
        commentaire: 'The leaf structure matches the expected morphology.',
        createurC: {
          prenom: 'Jean',
          nom: 'Martin'
        },
        avatar: 'assets/user.png'
      }
    ];
  }

  private generateMockEvaluations(): any[] {
    return [
      {
        id: 1,
        userId: 1,
        vote: true,
        e: { value: 1 }
      },
      {
        id: 2,
        userId: 2,
        vote: false,
        e: { value: 1 }
      },
      {
        id: 3,
        userId: 3,
        vote: true,
        e: { value: 1 }
      }
    ];
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
      // Generate mock heatmap URL
      this.heatmapUrl = 'assets/heatmap_placeholder.png';
      console.log('Mock heatmap generated for model:', ModeleId);
    } else {
      console.error("SpecimenPath is null");
    }
  }

  getAllStats(): void {
    if (this.SpecimenPath) {
      // Generate mock stats URLs
      this.statsUrls = {
        brightness: 'assets/brightness_histogram.png',
        color: 'assets/color_histogram.png',
        contrast: 'assets/contrast_histogram.png',
        mean: 'assets/mean_histogram.png',
        variance: 'assets/variance_histogram.png',
        hog: 'assets/hog_histogram.png'
      };
      console.log('Mock stats URLs generated:', this.statsUrls);
    } else {
      console.error("SpecimenPath is null");
    }
  }

  toggleDescription(index: number) {
    this.descriptionsVisible[index] = !this.descriptionsVisible[index];
  }


  addComment(): void {
    console.log('Adding new comment:', this.newComment);
    if (this.newComment && this.userId) {
      const newComment: Commentaire = {
        id: Date.now(),
        commentaire: this.newComment,
        createurC: {
          prenom: 'Current',
          nom: 'User'
        },
        avatar: 'assets/user.png'
      };
      
      // Add to local state
      this.comments = [...this.comments, newComment];
      this.commentsSubject.next(this.comments);
      
      console.log('Comment added successfully:', newComment);
      
      // Reset the text field
      this.newComment = '';
      
      // TODO: Replace with proper NgRx action
      // this.store.dispatch(AnnotationsActions.addComment({ 
      //   annotationId: this.Annotation.id, 
      //   userId: this.userId, 
      //   comment: this.newComment 
      // }));
    }
  }
  deleteComment(idCommentaire: number): void {
    console.log('Deleting comment with id:', idCommentaire);
    
    // Remove from local state
    this.comments = this.comments.filter((comment: any) => comment.id !== idCommentaire);
    this.commentsSubject.next(this.comments);
    
    console.log('Comment deleted successfully');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.deleteComment({ 
    //   annotationId: this.Annotation.id, 
    //   userId: this.userId, 
    //   commentId: idCommentaire 
    // }));
  }
  openEdit(comment: any) {
    this.selectedComment = comment;
    this.editedText = comment.commentaire;
    this.showModal = true;
  }
  
  // Fermer l'éditeur
  closeEdit() {
    this.showModal = false;
    this.selectedComment = null;
  }
  
  // Sauvegarder les modifications
  saveEdit() {
    if (this.selectedComment) {
      this.selectedComment.commentaire = this.editedText;
      // Ajouter ici la logique de sauvegarde
    }
    this.closeEdit();
  }

  // Méthode pour mettre à jour un commentaire
  updateComment(idCommentaire: number, newComment: string): void {
    console.log('Updating comment with id:', idCommentaire, 'New text:', newComment);
    
    // Update in local state
    this.comments = this.comments.map((comment: any) => 
      comment.id === idCommentaire ? { ...comment, commentaire: newComment } : comment
    );
    this.commentsSubject.next(this.comments);
    
    console.log('Comment updated successfully');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.updateComment({ 
    //   annotationId: this.Annotation.id, 
    //   userId: this.userId, 
    //   commentId: idCommentaire, 
    //   newComment: newComment 
    // }));
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

  updateAnnotation(): void {
    console.log('Updating annotation with value:', this.selectedValue);
    
    if (this.selectedValue) {
      this.Annotation.valeurCorrecte = this.selectedValue;
      this.Annotation.valide = true;
      this.isValide = "Validé";
      
      console.log('Annotation updated:', this.Annotation);
      
      // TODO: Replace with proper NgRx action
      // this.store.dispatch(AnnotationsActions.updateAnnotation({ 
      //   annotation: this.Annotation 
      // }));
      
      Swal.fire('Success', 'Annotation updated successfully', 'success');
    } else {
      Swal.fire('Error', 'Please select a correct value', 'error');
    }
  }

  openImageInNewWindow() {
    window.open(this.Specimen.image.image_url, '_blank');
  }
  submitVote(value: boolean): void {
    console.log('Submitting vote:', value, 'for user:', this.userId);
    
    // Create new evaluation
    const newEvaluation = {
      id: Date.now(),
      userId: this.userId,
      vote: value,
      e: { value: 1 }
    };
    
    // Update local state
    this.evaluations = [...this.evaluations.filter((evaluation: any) => evaluation.userId !== this.userId), newEvaluation];
    this.evaluationsSubject.next(this.evaluations);
    this.calculateVotePercentages();
    
    console.log('Vote submitted successfully');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.submitVote({ 
    //   annotationId: this.Annotation.id, 
    //   userId: this.userId, 
    //   vote: value 
    // }));
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
  approveAnnotation(): void {
    console.log('Approving annotation:', this.Annotation.id);
    
    this.Annotation.valide = true;
    this.isValide = "Validé";
    
    console.log('Annotation approved successfully');
    
    Swal.fire('Success', 'Annotation approved successfully', 'success');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.updateAnnotationState({ 
    //   annotationId: this.Annotation.id, 
    //   state: 'APPROVED' 
    // }));
  }
  
  rejectAnnotation(): void {
    console.log('Rejecting annotation:', this.Annotation.id);
    
    this.Annotation.valide = false;
    this.isValide = "Non Validé";
    
    console.log('Annotation rejected successfully');
    
    Swal.fire('Success', 'Annotation rejected successfully', 'success');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.updateAnnotationState({ 
    //   annotationId: this.Annotation.id, 
    //   state: 'REJECTED' 
    // }));
  }

  // UI Helper methods
  trackByCommentId(index: number, comment: Commentaire): number {
    return comment.id;
  }

  trackByEvaluationId(index: number, evaluation: any): number {
    return evaluation.id;
  }

  getValidationStatusClass(): string {
    return this.Annotation?.valide ? 'badge-success' : 'badge-warning';
  }

  getAccuracyClass(accuracy: number): string {
    if (accuracy >= 0.9) return 'text-success';
    if (accuracy >= 0.7) return 'text-warning';
    return 'text-danger';
  }

  formatScientificName(name: string): string {
    return name.split(' ').map(word => 
      (word.includes('.') || word.endsWith('.') || word === '&') ? word : `<i>${word}</i>`
    ).join(' ');
  }

  
}
