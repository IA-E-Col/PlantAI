import { createAction, props } from '@ngrx/store';
import { Annotation, Comment, Vote, ValidationStats, AnnotationFilters } from './annotations.state';

// Load Annotations Actions
export const loadAnnotations = createAction(
  '[Annotations] Load Annotations',
  props<{ 
    projectId?: number; 
    collectionId?: number; 
    datasetId?: number;
    filters?: AnnotationFilters;
    page?: number;
    pageSize?: number;
  }>()
);

export const loadAnnotationsSuccess = createAction(
  '[Annotations] Load Annotations Success',
  props<{ 
    annotations: Annotation[]; 
    total: number;
    page: number;
    pageSize: number;
  }>()
);

export const loadAnnotationsFailure = createAction(
  '[Annotations] Load Annotations Failure',
  props<{ error: string }>()
);

// Load Single Annotation Actions
export const loadAnnotation = createAction(
  '[Annotations] Load Annotation',
  props<{ annotationId: number }>()
);

export const loadAnnotationSuccess = createAction(
  '[Annotations] Load Annotation Success',
  props<{ annotation: Annotation }>()
);

export const loadAnnotationFailure = createAction(
  '[Annotations] Load Annotation Failure',
  props<{ error: string }>()
);

// Create Annotation Actions
export const createAnnotation = createAction(
  '[Annotations] Create Annotation',
  props<{ 
    annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'votes'>;
    specimenId: number;
    modelId: number;
  }>()
);

export const createAnnotationSuccess = createAction(
  '[Annotations] Create Annotation Success',
  props<{ annotation: Annotation }>()
);

export const createAnnotationFailure = createAction(
  '[Annotations] Create Annotation Failure',
  props<{ error: string }>()
);

// Update Annotation Actions
export const updateAnnotation = createAction(
  '[Annotations] Update Annotation',
  props<{ 
    annotationId: number; 
    updates: Partial<Annotation> 
  }>()
);

export const updateAnnotationSuccess = createAction(
  '[Annotations] Update Annotation Success',
  props<{ annotation: Annotation }>()
);

export const updateAnnotationFailure = createAction(
  '[Annotations] Update Annotation Failure',
  props<{ error: string }>()
);

// Delete Annotation Actions
export const deleteAnnotation = createAction(
  '[Annotations] Delete Annotation',
  props<{ annotationId: number }>()
);

export const deleteAnnotationSuccess = createAction(
  '[Annotations] Delete Annotation Success',
  props<{ annotationId: number }>()
);

export const deleteAnnotationFailure = createAction(
  '[Annotations] Delete Annotation Failure',
  props<{ error: string }>()
);

// Validation Actions
export const validateAnnotation = createAction(
  '[Annotations] Validate Annotation',
  props<{ 
    annotationId: number; 
    status: 'validated' | 'rejected';
    comment?: string;
    userId: number;
  }>()
);

export const validateAnnotationSuccess = createAction(
  '[Annotations] Validate Annotation Success',
  props<{ annotation: Annotation }>()
);

export const validateAnnotationFailure = createAction(
  '[Annotations] Validate Annotation Failure',
  props<{ error: string }>()
);

// Vote Actions
export const submitVote = createAction(
  '[Annotations] Submit Vote',
  props<{ 
    annotationId: number; 
    vote: 'approve' | 'reject';
    confidence: number;
    comment?: string;
    userId: number;
  }>()
);

export const submitVoteSuccess = createAction(
  '[Annotations] Submit Vote Success',
  props<{ vote: Vote }>()
);

export const submitVoteFailure = createAction(
  '[Annotations] Submit Vote Failure',
  props<{ error: string }>()
);

// Comment Actions
export const addComment = createAction(
  '[Annotations] Add Comment',
  props<{ 
    annotationId: number; 
    content: string;
    userId: number;
  }>()
);

export const addCommentSuccess = createAction(
  '[Annotations] Add Comment Success',
  props<{ comment: Comment }>()
);

export const addCommentFailure = createAction(
  '[Annotations] Add Comment Failure',
  props<{ error: string }>()
);

export const updateComment = createAction(
  '[Annotations] Update Comment',
  props<{ 
    commentId: number; 
    content: string;
    userId: number;
  }>()
);

export const updateCommentSuccess = createAction(
  '[Annotations] Update Comment Success',
  props<{ comment: Comment }>()
);

export const updateCommentFailure = createAction(
  '[Annotations] Update Comment Failure',
  props<{ error: string }>()
);

export const deleteComment = createAction(
  '[Annotations] Delete Comment',
  props<{ commentId: number; userId: number }>()
);

export const deleteCommentSuccess = createAction(
  '[Annotations] Delete Comment Success',
  props<{ commentId: number }>()
);

export const deleteCommentFailure = createAction(
  '[Annotations] Delete Comment Failure',
  props<{ error: string }>()
);

// Load Comments Actions
export const loadComments = createAction(
  '[Annotations] Load Comments',
  props<{ annotationId: number }>()
);

export const loadCommentsSuccess = createAction(
  '[Annotations] Load Comments Success',
  props<{ comments: Comment[] }>()
);

export const loadCommentsFailure = createAction(
  '[Annotations] Load Comments Failure',
  props<{ error: string }>()
);

// Load Votes Actions
export const loadVotes = createAction(
  '[Annotations] Load Votes',
  props<{ annotationId: number }>()
);

export const loadVotesSuccess = createAction(
  '[Annotations] Load Votes Success',
  props<{ votes: Vote[] }>()
);

export const loadVotesFailure = createAction(
  '[Annotations] Load Votes Failure',
  props<{ error: string }>()
);

// Validation Stats Actions
export const loadValidationStats = createAction(
  '[Annotations] Load Validation Stats',
  props<{ 
    projectId?: number; 
    collectionId?: number; 
    datasetId?: number;
  }>()
);

export const loadValidationStatsSuccess = createAction(
  '[Annotations] Load Validation Stats Success',
  props<{ stats: ValidationStats }>()
);

export const loadValidationStatsFailure = createAction(
  '[Annotations] Load Validation Stats Failure',
  props<{ error: string }>()
);

// Filter and Sort Actions
export const setAnnotationFilters = createAction(
  '[Annotations] Set Filters',
  props<{ filters: AnnotationFilters }>()
);

export const clearAnnotationFilters = createAction(
  '[Annotations] Clear Filters'
);

export const setAnnotationSort = createAction(
  '[Annotations] Set Sort',
  props<{ field: string; direction: 'asc' | 'desc' }>()
);

export const setAnnotationPagination = createAction(
  '[Annotations] Set Pagination',
  props<{ page: number; pageSize: number }>()
);

// Bulk Actions
export const bulkValidateAnnotations = createAction(
  '[Annotations] Bulk Validate Annotations',
  props<{ 
    annotationIds: number[]; 
    status: 'validated' | 'rejected';
    userId: number;
  }>()
);

export const bulkValidateAnnotationsSuccess = createAction(
  '[Annotations] Bulk Validate Annotations Success',
  props<{ annotations: Annotation[] }>()
);

export const bulkValidateAnnotationsFailure = createAction(
  '[Annotations] Bulk Validate Annotations Failure',
  props<{ error: string }>()
);

// Clear Actions
export const clearAnnotations = createAction(
  '[Annotations] Clear Annotations'
);

export const clearCurrentAnnotation = createAction(
  '[Annotations] Clear Current Annotation'
);

export const clearAnnotationError = createAction(
  '[Annotations] Clear Error'
);
