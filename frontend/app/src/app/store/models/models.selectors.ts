import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModelsState } from './models.state';

// Feature selector
export const selectModelsState = createFeatureSelector<ModelsState>('models');

// Basic selectors
export const selectAllModels = createSelector(
  selectModelsState,
  (state) => state.models
);

export const selectCurrentModel = createSelector(
  selectModelsState,
  (state) => state.currentModel
);

export const selectModelsLoading = createSelector(
  selectModelsState,
  (state) => state.isLoading
);

export const selectModelsError = createSelector(
  selectModelsState,
  (state) => state.error
);

// Model Classes
export const selectModelClasses = createSelector(
  selectModelsState,
  (state) => state.classes
);

export const selectCurrentClass = createSelector(
  selectModelsState,
  (state) => state.currentClass
);

export const selectClassesByModel = (modelId: number) => createSelector(
  selectModelsState,
  (state) => state.classes.filter(c => c.annotations?.some(a => a.id === modelId))
);

// Training
export const selectTrainingJobs = createSelector(
  selectModelsState,
  (state) => state.trainingJobs
);

export const selectCurrentTrainingJob = createSelector(
  selectModelsState,
  (state) => state.currentTrainingJob
);

export const selectActiveTrainingJobs = createSelector(
  selectTrainingJobs,
  (jobs) => jobs.filter(job => job.status === 'RUNNING' || job.status === 'PENDING')
);

export const selectTrainingJobById = (jobId: number) => createSelector(
  selectTrainingJobs,
  (jobs) => jobs.find(job => job.id === jobId)
);

// Predictions
export const selectAllPredictions = createSelector(
  selectModelsState,
  (state) => state.predictions
);

export const selectFilteredPredictions = createSelector(
  selectModelsState,
  (state) => state.filteredPredictions
);

export const selectPredictionsByModel = (modelId: number) => createSelector(
  selectAllPredictions,
  (predictions) => predictions.filter(p => p.modelId === modelId)
);

export const selectUnvalidatedPredictions = createSelector(
  selectAllPredictions,
  (predictions) => predictions.filter(p => !p.isValidated)
);

export const selectValidatedPredictions = createSelector(
  selectAllPredictions,
  (predictions) => predictions.filter(p => p.isValidated)
);

// Metrics
export const selectModelMetrics = createSelector(
  selectModelsState,
  (state) => state.modelMetrics
);

export const selectMetricsByModel = (modelId: number) => createSelector(
  selectModelMetrics,
  (metrics) => metrics[modelId]
);

// Filters
export const selectModelFilters = createSelector(
  selectModelsState,
  (state) => state.filters
);

// Advanced Selectors
export const selectModelById = (modelId: number) => createSelector(
  selectAllModels,
  (models) => models.find(model => model.id === modelId)
);

export const selectModelsByStatus = (status: string) => createSelector(
  selectAllModels,
  (models) => models.filter(model => model.status === status)
);

export const selectDeployedModels = createSelector(
  selectAllModels,
  (models) => models.filter(model => model.status === 'DEPLOYED')
);

export const selectTrainingModels = createSelector(
  selectAllModels,
  (models) => models.filter(model => model.status === 'TRAINING')
);

export const selectCompletedModels = createSelector(
  selectAllModels,
  (models) => models.filter(model => model.status === 'COMPLETED')
);

export const selectModelsByCreator = (creatorId: number) => createSelector(
  selectAllModels,
  (models) => models.filter(model => model.createur?.id === creatorId)
);

export const selectModelStats = createSelector(
  selectAllModels,
  (models) => {
    const stats = {
      total: models.length,
      training: 0,
      completed: 0,
      deployed: 0,
      failed: 0,
      averageAccuracy: 0
    };

    let totalAccuracy = 0;
    let modelsWithAccuracy = 0;

    models.forEach(model => {
      switch (model.status) {
        case 'TRAINING':
          stats.training++;
          break;
        case 'COMPLETED':
          stats.completed++;
          break;
        case 'DEPLOYED':
          stats.deployed++;
          break;
        case 'FAILED':
          stats.failed++;
          break;
      }

      if (model.accuracy) {
        totalAccuracy += model.accuracy;
        modelsWithAccuracy++;
      }
    });

    if (modelsWithAccuracy > 0) {
      stats.averageAccuracy = totalAccuracy / modelsWithAccuracy;
    }

    return stats;
  }
);

export const selectPredictionStats = createSelector(
  selectAllPredictions,
  (predictions) => {
    const stats = {
      total: predictions.length,
      validated: 0,
      unvalidated: 0,
      averageConfidence: 0
    };

    let totalConfidence = 0;

    predictions.forEach(prediction => {
      if (prediction.isValidated) {
        stats.validated++;
      } else {
        stats.unvalidated++;
      }
      totalConfidence += prediction.confidence;
    });

    if (predictions.length > 0) {
      stats.averageConfidence = totalConfidence / predictions.length;
    }

    return stats;
  }
);

// Complex filtered selectors
export const selectFilteredModels = createSelector(
  selectAllModels,
  selectModelFilters,
  (models, filters) => {
    return models.filter(model => {
      // Status filter
      if (filters.status && model.status !== filters.status) {
        return false;
      }

      // Accuracy range filter
      if (filters.minAccuracy && model.accuracy && model.accuracy < filters.minAccuracy) {
        return false;
      }
      if (filters.maxAccuracy && model.accuracy && model.accuracy > filters.maxAccuracy) {
        return false;
      }

      // Creator filter
      if (filters.createdBy && model.createur?.id !== filters.createdBy) {
        return false;
      }

      // Search text filter
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        return (
          model.nom.toLowerCase().includes(searchText) ||
          model.description.toLowerCase().includes(searchText) ||
          model.createur?.nom.toLowerCase().includes(searchText) ||
          model.createur?.prenom.toLowerCase().includes(searchText)
        );
      }

      return true;
    });
  }
);

export const selectHasActiveTraining = createSelector(
  selectActiveTrainingJobs,
  (jobs) => jobs.length > 0
);

export const selectTrainingProgress = createSelector(
  selectCurrentTrainingJob,
  (job) => job?.progress || 0
);
