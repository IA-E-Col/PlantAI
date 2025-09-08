import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AnnotationState, Annotation, Comment, Vote, ValidationStats } from './annotations.state';
import { AppState } from '../app.state';

// Feature selector
export const selectAnnotationState = createFeatureSelector<AppState, AnnotationState>('annotations');

// Basic selectors
export const selectAllAnnotations = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.annotations
);

export const selectCurrentAnnotation = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.currentAnnotation
);

export const selectAnnotationsLoading = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.loading
);

export const selectAnnotationsError = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.error
);

export const selectAnnotationsLastUpdated = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.lastUpdated
);

export const selectAnnotationFilters = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.filters
);

export const selectAnnotationSort = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.sortBy
);

export const selectAnnotationPagination = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.pagination
);

// Comments and Votes selectors
export const selectAllComments = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.comments
);

export const selectAllVotes = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.votes
);

export const selectValidationStats = createSelector(
  selectAnnotationState,
  (state: AnnotationState) => state.validationStats
);

// Filtered annotations selector
export const selectFilteredAnnotations = createSelector(
  selectAllAnnotations,
  selectAnnotationFilters,
  (annotations: Annotation[], filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return annotations;
    }

    return annotations.filter(annotation => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(annotation.status)) {
          return false;
        }
      }

      // Model ID filter
      if (filters.modelId && annotation.modelId !== filters.modelId) {
        return false;
      }

      // Class ID filter
      if (filters.classId && annotation.classId !== filters.classId) {
        return false;
      }

      // User ID filter
      if (filters.userId && annotation.validatedBy !== filters.userId) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const annotationDate = new Date(annotation.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        if (annotationDate < startDate || annotationDate > endDate) {
          return false;
        }
      }

      // Confidence range filter
      if (filters.confidenceRange) {
        if (annotation.confidence < filters.confidenceRange.min || 
            annotation.confidence > filters.confidenceRange.max) {
          return false;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const searchableText = [
          annotation.prediction,
          annotation.imageUrl
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }
);

// Sorted annotations selector
export const selectSortedAnnotations = createSelector(
  selectFilteredAnnotations,
  selectAnnotationSort,
  (annotations: Annotation[], sortBy) => {
    if (!sortBy || !sortBy.field) {
      return annotations;
    }

    return [...annotations].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy.field) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'prediction':
          aValue = a.prediction;
          bValue = b.prediction;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'validatedAt':
          aValue = a.validatedAt ? new Date(a.validatedAt) : new Date(0);
          bValue = b.validatedAt ? new Date(b.validatedAt) : new Date(0);
          break;
        default:
          aValue = a[sortBy.field as keyof Annotation];
          bValue = b[sortBy.field as keyof Annotation];
      }

      if (aValue < bValue) {
        return sortBy.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortBy.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
);

// Paginated annotations selector
export const selectPaginatedAnnotations = createSelector(
  selectSortedAnnotations,
  selectAnnotationPagination,
  (annotations: Annotation[], pagination) => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return annotations.slice(startIndex, endIndex);
  }
);

// Status-based selectors
export const selectPendingAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.status === 'pending')
);

export const selectValidatedAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.status === 'validated')
);

export const selectRejectedAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.status === 'rejected')
);

export const selectInProgressAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.status === 'in_progress')
);

// Comments for current annotation
export const selectCommentsForCurrentAnnotation = createSelector(
  selectCurrentAnnotation,
  selectAllComments,
  (currentAnnotation: Annotation | null, comments: Comment[]) => {
    if (!currentAnnotation) {
      return [];
    }
    return comments.filter(comment => comment.annotationId === currentAnnotation.id);
  }
);

// Votes for current annotation
export const selectVotesForCurrentAnnotation = createSelector(
  selectCurrentAnnotation,
  selectAllVotes,
  (currentAnnotation: Annotation | null, votes: Vote[]) => {
    if (!currentAnnotation) {
      return [];
    }
    return votes.filter(vote => vote.annotationId === currentAnnotation.id);
  }
);

// Vote statistics for current annotation
export const selectVoteStatistics = createSelector(
  selectVotesForCurrentAnnotation,
  (votes: Vote[]) => {
    const totalVotes = votes.length;
    const approveVotes = votes.filter(v => v.vote === 'approve').length;
    const rejectVotes = votes.filter(v => v.vote === 'reject').length;
    const averageConfidence = votes.length > 0 
      ? votes.reduce((sum, v) => sum + v.confidence, 0) / votes.length 
      : 0;

    return {
      totalVotes,
      approveVotes,
      rejectVotes,
      approvePercentage: totalVotes > 0 ? (approveVotes / totalVotes) * 100 : 0,
      rejectPercentage: totalVotes > 0 ? (rejectVotes / totalVotes) * 100 : 0,
      averageConfidence,
      consensus: totalVotes > 0 ? (approveVotes > rejectVotes ? 'approve' : 'reject') : 'none'
    };
  }
);

// Annotation by ID selector
export const selectAnnotationById = (annotationId: number) => createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.find(a => a.id === annotationId)
);

// Annotations by model ID selector
export const selectAnnotationsByModelId = (modelId: number) => createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.modelId === modelId)
);

// Annotations by class ID selector
export const selectAnnotationsByClassId = (classId: number) => createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.classId === classId)
);

// Annotations by specimen ID selector
export const selectAnnotationsBySpecimenId = (specimenId: number) => createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.specimenId === specimenId)
);

// High confidence annotations selector
export const selectHighConfidenceAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.confidence >= 0.8)
);

// Low confidence annotations selector
export const selectLowConfidenceAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => annotations.filter(a => a.confidence < 0.6)
);

// Recent annotations selector
export const selectRecentAnnotations = createSelector(
  selectAllAnnotations,
  (annotations: Annotation[]) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return annotations.filter(a => new Date(a.createdAt) > oneWeekAgo);
  }
);

// Validation progress selector
export const selectValidationProgress = createSelector(
  selectValidationStats,
  (stats: ValidationStats | null) => {
    if (!stats) {
      return 0;
    }
    return stats.validationProgress;
  }
);

// Consensus rate selector
export const selectConsensusRate = createSelector(
  selectValidationStats,
  (stats: ValidationStats | null) => {
    if (!stats) {
      return 0;
    }
    return stats.consensusRate;
  }
);

// Average confidence selector
export const selectAverageConfidence = createSelector(
  selectValidationStats,
  (stats: ValidationStats | null) => {
    if (!stats) {
      return 0;
    }
    return stats.averageConfidence;
  }
);
