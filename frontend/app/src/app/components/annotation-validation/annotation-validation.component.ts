import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { CollectionsActions, ModelsActions, NavigationActions } from '../../store';
import { 
  selectAllModels,
  selectModelsLoading,
  selectModelsError 
} from '../../store/models/models.selectors';
import { 
  selectNavigationDatasetId,
  selectNavigationModelId,
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';
import { 
  selectUser,
  selectUserId 
} from '../../store/auth/auth.selectors';

interface Annotation {
  id: number;
  imageUrl: string;
  class: string;
  prediction: string;
  confidence: number;
  specimenId: number;
  modelId: number;
  datasetId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface Vote {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  vote: boolean;
  weight: number;
  createdAt: string;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

interface ValidationStats {
  inFavor: number;
  against: number;
  inFavorUsers: Vote[];
  againstUsers: Vote[];
  totalVotes: number;
  consensus: 'STRONG_FAVOR' | 'WEAK_FAVOR' | 'DIVIDED' | 'WEAK_AGAINST' | 'STRONG_AGAINST';
}

@Component({
  selector: 'app-annotation-validation',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe],
  templateUrl: './annotation-validation.component.html',
  styleUrl: './annotation-validation.component.css'
})
export class AnnotationValidationComponent implements OnInit, OnDestroy {
  // NgRx Observables
  user$: Observable<any>;
  userId$: Observable<number | null>;
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  datasetId$: Observable<string | null>;
  modelId$: Observable<string | null>;
  collectionId$: Observable<string | null>;
  
  // Reactive state management
  private annotationSubject = new BehaviorSubject<Annotation | null>(null);
  annotation$: Observable<Annotation | null> = this.annotationSubject.asObservable();
  
  private votesSubject = new BehaviorSubject<Vote[]>([]);
  votes$: Observable<Vote[]> = this.votesSubject.asObservable();
  
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$: Observable<Comment[]> = this.commentsSubject.asObservable();
  
  private validationStatsSubject = new BehaviorSubject<ValidationStats | null>(null);
  validationStats$: Observable<ValidationStats | null> = this.validationStatsSubject.asObservable();
  
  // Component state
  annotation: Annotation | null = null;
  votes: Vote[] = [];
  comments: Comment[] = [];
  validationStats: ValidationStats | null = null;
  newComment: string = '';
  userVote: boolean | null = null;
  isLoading: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    // Initialize NgRx observables
    this.user$ = this.store.select(selectUser);
    this.userId$ = this.store.select(selectUserId);
    this.models$ = this.store.select(selectAllModels);
    this.modelsLoading$ = this.store.select(selectModelsLoading);
    this.modelsError$ = this.store.select(selectModelsError);
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
    this.modelId$ = this.store.select(selectNavigationModelId);
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
  }

  ngOnInit(): void {
    // Load annotation data
    this.loadAnnotationData();
    
    // Subscribe to errors
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });
    
    console.log('Annotation validation component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnnotationData(): void {
    console.log('Loading annotation validation data');
    
    // Generate mock annotation data
    const mockAnnotation = this.generateMockAnnotation();
    this.annotation = mockAnnotation;
    this.annotationSubject.next(mockAnnotation);
    
    // Generate mock votes
    const mockVotes = this.generateMockVotes();
    this.votes = mockVotes;
    this.votesSubject.next(mockVotes);
    
    // Generate mock comments
    const mockComments = this.generateMockComments();
    this.comments = mockComments;
    this.commentsSubject.next(mockComments);
    
    // Calculate validation stats
    this.calculateValidationStats();
    
    console.log('Mock annotation validation data loaded:', {
      annotation: mockAnnotation,
      votes: mockVotes.length,
      comments: mockComments.length,
      stats: this.validationStats
    });
  }

  private generateMockAnnotation(): Annotation {
    return {
      id: Date.now(),
      imageUrl: 'http://riha.african-herbaria.org/img/parts/TOGO/TOGO04291.jpg',
      class: 'Sol/Pas Sol',
      prediction: 'Sol',
      confidence: 0.87,
      specimenId: 1,
      modelId: 1,
      datasetId: 1,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  }

  private generateMockVotes(): Vote[] {
    return [
      {
        id: 1,
        userId: 1,
        userName: 'Jane Doe',
        userAvatar: 'https://th.bing.com/th/id/R.737c59144b9b2f046b6cc535c365b5bb?rik=Z1jk4d3OWIfoOw&pid=ImgRaw&r=0',
        vote: true,
        weight: 1,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        userId: 2,
        userName: 'Paula Poe',
        userAvatar: 'https://th.bing.com/th/id/OIP.Xe0FlT8qEGLqyrrIbv2P9wHaF7?rs=1&pid=ImgDetMain',
        vote: true,
        weight: 1,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        userId: 3,
        userName: 'John Doe',
        userAvatar: 'https://th.bing.com/th/id/OIP.IrUBHhdMo6wWLFueKNreRwHaHa?rs=1&pid=ImgDetMain',
        vote: false,
        weight: 1,
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ];
  }

  private generateMockComments(): Comment[] {
    return [
      {
        id: 1,
        userId: 3,
        userName: 'John Doe',
        userAvatar: 'https://th.bing.com/th/id/OIP.IrUBHhdMo6wWLFueKNreRwHaHa?rs=1&pid=ImgDetMain',
        text: 'À mon avis, il y a quelques problèmes avec cette prédiction, ce spécimen ne vérifie pas cette propriété.',
        createdAt: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: 2,
        userId: 1,
        userName: 'Jane Doe',
        userAvatar: 'https://th.bing.com/th/id/R.737c59144b9b2f046b6cc535c365b5bb?rik=Z1jk4d3OWIfoOw&pid=ImgRaw&r=0',
        text: 'Non, la prédiction vérifie parfaitement les propriétés du spécimen. Je te recommande de vérifier la Distribution de la plante et ses propriétés à travers la "Model Library".',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        userId: 2,
        userName: 'Paula Poe',
        userAvatar: 'https://th.bing.com/th/id/OIP.Xe0FlT8qEGLqyrrIbv2P9wHaF7?rs=1&pid=ImgDetMain',
        text: 'C\'est vrai. Au niveau de la Model Library on peut parfaitement voir les que les informations sont conformes à ce qui a été retourné par le modèle.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  private calculateValidationStats(): void {
    if (!this.votes.length) {
      this.validationStats = null;
      return;
    }

    const inFavorVotes = this.votes.filter(vote => vote.vote === true);
    const againstVotes = this.votes.filter(vote => vote.vote === false);
    
    const inFavorWeight = inFavorVotes.reduce((sum, vote) => sum + vote.weight, 0);
    const againstWeight = againstVotes.reduce((sum, vote) => sum + vote.weight, 0);
    const totalWeight = inFavorWeight + againstWeight;
    
    const inFavorPercentage = totalWeight > 0 ? (inFavorWeight / totalWeight) * 100 : 0;
    const againstPercentage = totalWeight > 0 ? (againstWeight / totalWeight) * 100 : 0;
    
    let consensus: ValidationStats['consensus'];
    if (inFavorPercentage >= 80) consensus = 'STRONG_FAVOR';
    else if (inFavorPercentage >= 60) consensus = 'WEAK_FAVOR';
    else if (inFavorPercentage >= 40) consensus = 'DIVIDED';
    else if (inFavorPercentage >= 20) consensus = 'WEAK_AGAINST';
    else consensus = 'STRONG_AGAINST';
    
    this.validationStats = {
      inFavor: Math.round(inFavorPercentage),
      against: Math.round(againstPercentage),
      inFavorUsers: inFavorVotes,
      againstUsers: againstVotes,
      totalVotes: this.votes.length,
      consensus
    };
    
    this.validationStatsSubject.next(this.validationStats);
  }

  submitVote(vote: boolean): void {
    console.log('Submitting vote:', vote);
    
    // Check if user already voted
    const existingVoteIndex = this.votes.findIndex(v => v.userId === 1); // Mock current user ID
    
    const newVote: Vote = {
      id: Date.now(),
      userId: 1, // Mock current user ID
      userName: 'Current User',
      userAvatar: 'assets/user.png',
      vote: vote,
      weight: 1,
      createdAt: new Date().toISOString()
    };
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      this.votes[existingVoteIndex] = newVote;
    } else {
      // Add new vote
      this.votes.push(newVote);
    }
    
    this.votesSubject.next([...this.votes]);
    this.calculateValidationStats();
    this.userVote = vote;
    
    console.log('Vote submitted successfully');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.submitVote({ 
    //   annotationId: this.annotation!.id, 
    //   userId: this.userId, 
    //   vote: vote 
    // }));
  }

  addComment(): void {
    if (!this.newComment.trim()) return;
    
    console.log('Adding comment:', this.newComment);
    
    const newComment: Comment = {
      id: Date.now(),
      userId: 1, // Mock current user ID
      userName: 'Current User',
      userAvatar: 'assets/user.png',
      text: this.newComment,
      createdAt: new Date().toISOString()
    };
    
    this.comments.unshift(newComment);
    this.commentsSubject.next([...this.comments]);
    this.newComment = '';
    
    console.log('Comment added successfully');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(AnnotationsActions.addComment({ 
    //   annotationId: this.annotation!.id, 
    //   userId: this.userId, 
    //   comment: this.newComment 
    // }));
  }

  submitValidation(): void {
    if (!this.annotation || !this.validationStats) return;
    
    console.log('Submitting validation for annotation:', this.annotation.id);
    
    this.isLoading = true;
    
    // Simulate validation submission
    setTimeout(() => {
      if (this.annotation && this.validationStats) {
        this.annotation.status = this.validationStats.consensus === 'STRONG_FAVOR' || 
                                this.validationStats.consensus === 'WEAK_FAVOR' ? 'APPROVED' : 'REJECTED';
        
        this.annotationSubject.next(this.annotation);
        this.isLoading = false;
        
        const status = this.annotation.status === 'APPROVED' ? 'approved' : 'rejected';
        Swal.fire('Success', `Annotation ${status} successfully`, 'success');
        
        console.log('Validation submitted successfully:', this.annotation.status);
        
        // TODO: Replace with proper NgRx action
        // this.store.dispatch(AnnotationsActions.submitValidation({ 
        //   annotationId: this.annotation.id, 
        //   status: this.annotation.status 
        // }));
      }
    }, 1000);
  }

  // UI Helper methods
  trackByVoteId(index: number, vote: Vote): number {
    return vote.id;
  }

  trackByCommentId(index: number, comment: Comment): number {
    return comment.id;
  }

  getConsensusClass(): string {
    if (!this.validationStats) return 'badge-secondary';
    
    switch (this.validationStats.consensus) {
      case 'STRONG_FAVOR': return 'badge-success';
      case 'WEAK_FAVOR': return 'badge-info';
      case 'DIVIDED': return 'badge-warning';
      case 'WEAK_AGAINST': return 'badge-warning';
      case 'STRONG_AGAINST': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getConsensusText(): string {
    if (!this.validationStats) return 'No consensus';
    
    switch (this.validationStats.consensus) {
      case 'STRONG_FAVOR': return 'Strong Favor';
      case 'WEAK_FAVOR': return 'Weak Favor';
      case 'DIVIDED': return 'Divided';
      case 'WEAK_AGAINST': return 'Weak Against';
      case 'STRONG_AGAINST': return 'Strong Against';
      default: return 'Unknown';
    }
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.7) return 'text-warning';
    return 'text-danger';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canSubmitValidation(): boolean {
    return this.validationStats !== null && 
           this.validationStats.totalVotes >= 3 && 
           !this.isLoading;
  }
}
