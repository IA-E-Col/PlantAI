import { createReducer, on } from '@ngrx/store';
import { AnnotationState, initialAnnotationState } from './annotations.state';
import * as AnnotationActions from './annotations.actions';

export const annotationsReducer = createReducer(
  initialAnnotationState,

  // Load Annotations
  on(AnnotationActions.loadAnnotations, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.loadAnnotationsSuccess, (state, { annotations, total, page, pageSize }) => ({
    ...state,
    annotations,
    pagination: {
      ...state.pagination,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.loadAnnotationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Single Annotation
  on(AnnotationActions.loadAnnotation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.loadAnnotationSuccess, (state, { annotation }) => ({
    ...state,
    currentAnnotation: annotation,
    loading: false,
    error: null
  })),

  on(AnnotationActions.loadAnnotationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Annotation
  on(AnnotationActions.createAnnotation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.createAnnotationSuccess, (state, { annotation }) => ({
    ...state,
    annotations: [annotation, ...state.annotations],
    pagination: {
      ...state.pagination,
      total: state.pagination.total + 1,
      totalPages: Math.ceil((state.pagination.total + 1) / state.pagination.pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.createAnnotationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Annotation
  on(AnnotationActions.updateAnnotation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.updateAnnotationSuccess, (state, { annotation }) => ({
    ...state,
    annotations: state.annotations.map(a => 
      a.id === annotation.id ? annotation : a
    ),
    currentAnnotation: state.currentAnnotation?.id === annotation.id ? annotation : state.currentAnnotation,
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.updateAnnotationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Annotation
  on(AnnotationActions.deleteAnnotation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.deleteAnnotationSuccess, (state, { annotationId }) => ({
    ...state,
    annotations: state.annotations.filter(a => a.id !== annotationId),
    currentAnnotation: state.currentAnnotation?.id === annotationId ? null : state.currentAnnotation,
    pagination: {
      ...state.pagination,
      total: state.pagination.total - 1,
      totalPages: Math.ceil((state.pagination.total - 1) / state.pagination.pageSize)
    },
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.deleteAnnotationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Validate Annotation
  on(AnnotationActions.validateAnnotation, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.validateAnnotationSuccess, (state, { annotation }) => ({
    ...state,
    annotations: state.annotations.map(a => 
      a.id === annotation.id ? annotation : a
    ),
    currentAnnotation: state.currentAnnotation?.id === annotation.id ? annotation : state.currentAnnotation,
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.validateAnnotationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Submit Vote
  on(AnnotationActions.submitVote, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.submitVoteSuccess, (state, { vote }) => ({
    ...state,
    votes: [...state.votes.filter(v => !(v.annotationId === vote.annotationId && v.userId === vote.userId)), vote],
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.submitVoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add Comment
  on(AnnotationActions.addComment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.addCommentSuccess, (state, { comment }) => ({
    ...state,
    comments: [comment, ...state.comments],
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.addCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Comment
  on(AnnotationActions.updateComment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.updateCommentSuccess, (state, { comment }) => ({
    ...state,
    comments: state.comments.map(c => 
      c.id === comment.id ? comment : c
    ),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.updateCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Comment
  on(AnnotationActions.deleteComment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.deleteCommentSuccess, (state, { commentId }) => ({
    ...state,
    comments: state.comments.filter(c => c.id !== commentId),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.deleteCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Comments
  on(AnnotationActions.loadComments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.loadCommentsSuccess, (state, { comments }) => ({
    ...state,
    comments,
    loading: false,
    error: null
  })),

  on(AnnotationActions.loadCommentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Votes
  on(AnnotationActions.loadVotes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.loadVotesSuccess, (state, { votes }) => ({
    ...state,
    votes,
    loading: false,
    error: null
  })),

  on(AnnotationActions.loadVotesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Validation Stats
  on(AnnotationActions.loadValidationStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.loadValidationStatsSuccess, (state, { stats }) => ({
    ...state,
    validationStats: stats,
    loading: false,
    error: null
  })),

  on(AnnotationActions.loadValidationStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filter and Sort Actions
  on(AnnotationActions.setAnnotationFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    pagination: {
      ...state.pagination,
      page: 1 // Reset to first page when filters change
    }
  })),

  on(AnnotationActions.clearAnnotationFilters, (state) => ({
    ...state,
    filters: {},
    pagination: {
      ...state.pagination,
      page: 1
    }
  })),

  on(AnnotationActions.setAnnotationSort, (state, { field, direction }) => ({
    ...state,
    sortBy: { field, direction },
    pagination: {
      ...state.pagination,
      page: 1 // Reset to first page when sort changes
    }
  })),

  on(AnnotationActions.setAnnotationPagination, (state, { page, pageSize }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      page,
      pageSize,
      totalPages: Math.ceil(state.pagination.total / pageSize)
    }
  })),

  // Bulk Actions
  on(AnnotationActions.bulkValidateAnnotations, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnotationActions.bulkValidateAnnotationsSuccess, (state, { annotations }) => ({
    ...state,
    annotations: state.annotations.map(annotation => {
      const updatedAnnotation = annotations.find(a => a.id === annotation.id);
      return updatedAnnotation || annotation;
    }),
    loading: false,
    error: null,
    lastUpdated: new Date().toISOString()
  })),

  on(AnnotationActions.bulkValidateAnnotationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Actions
  on(AnnotationActions.clearAnnotations, (state) => ({
    ...state,
    annotations: [],
    pagination: {
      ...state.pagination,
      total: 0,
      totalPages: 0
    }
  })),

  on(AnnotationActions.clearCurrentAnnotation, (state) => ({
    ...state,
    currentAnnotation: null,
    comments: [],
    votes: []
  })),

  on(AnnotationActions.clearAnnotationError, (state) => ({
    ...state,
    error: null
  }))
);
