import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { AppState } from '../app.state';
import * as AnnotationActions from './annotations.actions';
import { Annotation, Comment, Vote, ValidationStats } from './annotations.state';

@Injectable()
export class AnnotationEffects {

  // Load Annotations Effect
  loadAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.loadAnnotations),
      switchMap(({ projectId, collectionId, datasetId, filters, page = 1, pageSize = 20 }) => {
        console.log('Loading annotations with filters:', { projectId, collectionId, datasetId, filters, page, pageSize });
        
        // Generate mock annotations based on filters
        const mockAnnotations = this.generateMockAnnotations(projectId, collectionId, datasetId, filters, page, pageSize);
        
        return of(AnnotationActions.loadAnnotationsSuccess({
          annotations: mockAnnotations.annotations,
          total: mockAnnotations.total,
          page,
          pageSize
        }));
      }),
      catchError(error => of(AnnotationActions.loadAnnotationsFailure({ error: error.message })))
    )
  );

  // Load Single Annotation Effect
  loadAnnotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.loadAnnotation),
      switchMap(({ annotationId }) => {
        console.log('Loading annotation:', annotationId);
        
        // Generate mock annotation
        const mockAnnotation = this.generateMockAnnotation(annotationId);
        
        return of(AnnotationActions.loadAnnotationSuccess({ annotation: mockAnnotation }));
      }),
      catchError(error => of(AnnotationActions.loadAnnotationFailure({ error: error.message })))
    )
  );

  // Create Annotation Effect
  createAnnotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.createAnnotation),
      switchMap(({ annotation, specimenId, modelId }) => {
        console.log('Creating annotation:', { annotation, specimenId, modelId });
        
        // Generate mock created annotation
        const mockCreatedAnnotation = this.generateMockCreatedAnnotation(annotation, specimenId, modelId);
        
        return of(AnnotationActions.createAnnotationSuccess({ annotation: mockCreatedAnnotation }));
      }),
      catchError(error => of(AnnotationActions.createAnnotationFailure({ error: error.message })))
    )
  );

  // Update Annotation Effect
  updateAnnotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.updateAnnotation),
      switchMap(({ annotationId, updates }) => {
        console.log('Updating annotation:', { annotationId, updates });
        
        // Generate mock updated annotation
        const mockUpdatedAnnotation = this.generateMockUpdatedAnnotation(annotationId, updates);
        
        return of(AnnotationActions.updateAnnotationSuccess({ annotation: mockUpdatedAnnotation }));
      }),
      catchError(error => of(AnnotationActions.updateAnnotationFailure({ error: error.message })))
    )
  );

  // Delete Annotation Effect
  deleteAnnotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.deleteAnnotation),
      switchMap(({ annotationId }) => {
        console.log('Deleting annotation:', annotationId);
        
        // Simulate successful deletion
        return of(AnnotationActions.deleteAnnotationSuccess({ annotationId }));
      }),
      catchError(error => of(AnnotationActions.deleteAnnotationFailure({ error: error.message })))
    )
  );

  // Validate Annotation Effect
  validateAnnotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.validateAnnotation),
      switchMap(({ annotationId, status, comment, userId }) => {
        console.log('Validating annotation:', { annotationId, status, comment, userId });
        
        // Generate mock validated annotation
        const mockValidatedAnnotation = this.generateMockValidatedAnnotation(annotationId, status, comment, userId);
        
        return of(AnnotationActions.validateAnnotationSuccess({ annotation: mockValidatedAnnotation }));
      }),
      catchError(error => of(AnnotationActions.validateAnnotationFailure({ error: error.message })))
    )
  );

  // Submit Vote Effect
  submitVote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.submitVote),
      switchMap(({ annotationId, vote, confidence, comment, userId }) => {
        console.log('Submitting vote:', { annotationId, vote, confidence, comment, userId });
        
        // Generate mock vote
        const mockVote = this.generateMockVote(annotationId, vote, confidence, comment, userId);
        
        return of(AnnotationActions.submitVoteSuccess({ vote: mockVote }));
      }),
      catchError(error => of(AnnotationActions.submitVoteFailure({ error: error.message })))
    )
  );

  // Add Comment Effect
  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.addComment),
      switchMap(({ annotationId, content, userId }) => {
        console.log('Adding comment:', { annotationId, content, userId });
        
        // Generate mock comment
        const mockComment = this.generateMockComment(annotationId, content, userId);
        
        return of(AnnotationActions.addCommentSuccess({ comment: mockComment }));
      }),
      catchError(error => of(AnnotationActions.addCommentFailure({ error: error.message })))
    )
  );

  // Update Comment Effect
  updateComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.updateComment),
      switchMap(({ commentId, content, userId }) => {
        console.log('Updating comment:', { commentId, content, userId });
        
        // Generate mock updated comment
        const mockUpdatedComment = this.generateMockUpdatedComment(commentId, content, userId);
        
        return of(AnnotationActions.updateCommentSuccess({ comment: mockUpdatedComment }));
      }),
      catchError(error => of(AnnotationActions.updateCommentFailure({ error: error.message })))
    )
  );

  // Delete Comment Effect
  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.deleteComment),
      switchMap(({ commentId, userId }) => {
        console.log('Deleting comment:', { commentId, userId });
        
        // Simulate successful deletion
        return of(AnnotationActions.deleteCommentSuccess({ commentId }));
      }),
      catchError(error => of(AnnotationActions.deleteCommentFailure({ error: error.message })))
    )
  );

  // Load Comments Effect
  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.loadComments),
      switchMap(({ annotationId }) => {
        console.log('Loading comments for annotation:', annotationId);
        
        // Generate mock comments
        const mockComments = this.generateMockComments(annotationId);
        
        return of(AnnotationActions.loadCommentsSuccess({ comments: mockComments }));
      }),
      catchError(error => of(AnnotationActions.loadCommentsFailure({ error: error.message })))
    )
  );

  // Load Votes Effect
  loadVotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.loadVotes),
      switchMap(({ annotationId }) => {
        console.log('Loading votes for annotation:', annotationId);
        
        // Generate mock votes
        const mockVotes = this.generateMockVotes(annotationId);
        
        return of(AnnotationActions.loadVotesSuccess({ votes: mockVotes }));
      }),
      catchError(error => of(AnnotationActions.loadVotesFailure({ error: error.message })))
    )
  );

  // Load Validation Stats Effect
  loadValidationStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.loadValidationStats),
      switchMap(({ projectId, collectionId, datasetId }) => {
        console.log('Loading validation stats:', { projectId, collectionId, datasetId });
        
        // Generate mock validation stats
        const mockStats = this.generateMockValidationStats(projectId, collectionId, datasetId);
        
        return of(AnnotationActions.loadValidationStatsSuccess({ stats: mockStats }));
      }),
      catchError(error => of(AnnotationActions.loadValidationStatsFailure({ error: error.message })))
    )
  );

  // Bulk Validate Annotations Effect
  bulkValidateAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnotationActions.bulkValidateAnnotations),
      switchMap(({ annotationIds, status, userId }) => {
        console.log('Bulk validating annotations:', { annotationIds, status, userId });
        
        // Generate mock bulk validated annotations
        const mockValidatedAnnotations = this.generateMockBulkValidatedAnnotations(annotationIds, status, userId);
        
        return of(AnnotationActions.bulkValidateAnnotationsSuccess({ annotations: mockValidatedAnnotations }));
      }),
      catchError(error => of(AnnotationActions.bulkValidateAnnotationsFailure({ error: error.message })))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  // Mock Data Generation Methods
  private generateMockAnnotations(projectId?: number, collectionId?: number, datasetId?: number, filters?: any, page: number = 1, pageSize: number = 20): { annotations: Annotation[], total: number } {
    const total = 150; // Mock total
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    
    const annotations: Annotation[] = [];
    const statuses: Array<'pending' | 'validated' | 'rejected' | 'in_progress'> = ['pending', 'validated', 'rejected', 'in_progress'];
    const predictions = ['Acacia senegalensis', 'Panicum maximum', 'Vernonia amygdalina', 'Psychotria capensis', 'Euphorbia hirta'];
    const classes = [1, 2, 3, 4, 5];
    const models = [1, 2, 3];
    
    for (let i = startIndex; i < endIndex; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const prediction = predictions[Math.floor(Math.random() * predictions.length)];
      const classId = classes[Math.floor(Math.random() * classes.length)];
      const modelId = models[Math.floor(Math.random() * models.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
      
      annotations.push({
        id: i + 1,
        specimenId: i + 1,
        modelId,
        classId,
        prediction,
        confidence,
        status,
        imageUrl: `assets/uploads/specimen_${i + 1}.jpg`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        validatedBy: status !== 'pending' ? Math.floor(Math.random() * 10) + 1 : undefined,
        validatedAt: status !== 'pending' ? new Date().toISOString() : undefined,
        comments: [],
        votes: [],
        metadata: {
          boundingBox: {
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100
          },
          features: {
            color: ['green', 'brown'],
            texture: 'smooth',
            shape: 'oval'
          }
        }
      });
    }
    
    return { annotations, total };
  }

  private generateMockAnnotation(annotationId: number): Annotation {
    return {
      id: annotationId,
      specimenId: annotationId,
      modelId: 1,
      classId: 1,
      prediction: 'Acacia senegalensis',
      confidence: 0.95,
      status: 'pending',
      imageUrl: `assets/uploads/specimen_${annotationId}.jpg`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      votes: [],
      metadata: {
        boundingBox: { x: 50, y: 50, width: 200, height: 200 },
        features: { color: ['green'], texture: 'smooth', shape: 'oval' }
      }
    };
  }

  private generateMockCreatedAnnotation(annotation: any, specimenId: number, modelId: number): Annotation {
    return {
      ...annotation,
      id: Date.now(),
      specimenId,
      modelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      votes: []
    };
  }

  private generateMockUpdatedAnnotation(annotationId: number, updates: any): Annotation {
    const baseAnnotation = this.generateMockAnnotation(annotationId);
    return {
      ...baseAnnotation,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  private generateMockValidatedAnnotation(annotationId: number, status: 'validated' | 'rejected', comment?: string, userId?: number): Annotation {
    const baseAnnotation = this.generateMockAnnotation(annotationId);
    return {
      ...baseAnnotation,
      status,
      validatedBy: userId,
      validatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private generateMockVote(annotationId: number, vote: 'approve' | 'reject', confidence: number, comment?: string, userId?: number): Vote {
    return {
      id: Date.now(),
      annotationId,
      userId: userId || 1,
      userName: `User ${userId || 1}`,
      userAvatar: `assets/avatars/user_${userId || 1}.jpg`,
      vote,
      confidence,
      comment,
      createdAt: new Date().toISOString()
    };
  }

  private generateMockComment(annotationId: number, content: string, userId: number): Comment {
    return {
      id: Date.now(),
      annotationId,
      userId,
      userName: `User ${userId}`,
      userAvatar: `assets/avatars/user_${userId}.jpg`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false
    };
  }

  private generateMockUpdatedComment(commentId: number, content: string, userId: number): Comment {
    return {
      id: commentId,
      annotationId: 1,
      userId,
      userName: `User ${userId}`,
      userAvatar: `assets/avatars/user_${userId}.jpg`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: true
    };
  }

  private generateMockComments(annotationId: number): Comment[] {
    const comments: Comment[] = [];
    for (let i = 1; i <= 5; i++) {
      comments.push({
        id: i,
        annotationId,
        userId: i,
        userName: `User ${i}`,
        userAvatar: `assets/avatars/user_${i}.jpg`,
        content: `This is a comment ${i} for annotation ${annotationId}`,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        isEdited: false
      });
    }
    return comments;
  }

  private generateMockVotes(annotationId: number): Vote[] {
    const votes: Vote[] = [];
    const voteTypes: Array<'approve' | 'reject'> = ['approve', 'reject'];
    
    for (let i = 1; i <= 8; i++) {
      votes.push({
        id: i,
        annotationId,
        userId: i,
        userName: `User ${i}`,
        userAvatar: `assets/avatars/user_${i}.jpg`,
        vote: voteTypes[Math.floor(Math.random() * voteTypes.length)],
        confidence: Math.random() * 0.4 + 0.6,
        comment: Math.random() > 0.5 ? `Vote comment ${i}` : undefined,
        createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString()
      });
    }
    return votes;
  }

  private generateMockValidationStats(projectId?: number, collectionId?: number, datasetId?: number): ValidationStats {
    return {
      totalAnnotations: 150,
      pendingAnnotations: 45,
      validatedAnnotations: 75,
      rejectedAnnotations: 20,
      inProgressAnnotations: 10,
      consensusRate: 0.85,
      averageConfidence: 0.78,
      validationProgress: 0.63,
      lastValidationDate: new Date().toISOString()
    };
  }

  private generateMockBulkValidatedAnnotations(annotationIds: number[], status: 'validated' | 'rejected', userId: number): Annotation[] {
    return annotationIds.map(id => this.generateMockValidatedAnnotation(id, status, undefined, userId));
  }
}
