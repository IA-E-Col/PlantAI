import { createReducer, on } from '@ngrx/store';
import { ModelsState, initialModelsState } from './models.state';
import * as ModelsActions from './models.actions';

export const modelsReducer = createReducer(
  initialModelsState,

  // Load Models
  on(ModelsActions.loadModels, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.loadModelsSuccess, (state, { models }) => ({
    ...state,
    models,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.loadModelsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Single Model
  on(ModelsActions.loadModel, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.loadModelSuccess, (state, { model }) => ({
    ...state,
    currentModel: model,
    models: state.models.map(m => m.id === model.id ? model : m),
    isLoading: false,
    error: null
  })),

  on(ModelsActions.loadModelFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create Model
  on(ModelsActions.createModel, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.createModelSuccess, (state, { model }) => ({
    ...state,
    models: [...state.models, model],
    currentModel: model,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.createModelFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Model
  on(ModelsActions.updateModel, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.updateModelSuccess, (state, { model }) => ({
    ...state,
    models: state.models.map(m => m.id === model.id ? model : m),
    currentModel: state.currentModel?.id === model.id ? model : state.currentModel,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.updateModelFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete Model
  on(ModelsActions.deleteModel, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.deleteModelSuccess, (state, { modelId }) => ({
    ...state,
    models: state.models.filter(m => m.id !== modelId),
    currentModel: state.currentModel?.id === modelId ? null : state.currentModel,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.deleteModelFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Model Classes
  on(ModelsActions.loadModelClasses, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.loadModelClassesSuccess, (state, { classes }) => ({
    ...state,
    classes,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.loadModelClassesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(ModelsActions.createModelClassSuccess, (state, { class: newClass }) => ({
    ...state,
    classes: [...state.classes, newClass],
    isLoading: false,
    error: null
  })),

  on(ModelsActions.updateModelClassSuccess, (state, { class: updatedClass }) => ({
    ...state,
    classes: state.classes.map(c => c.id === updatedClass.id ? updatedClass : c),
    currentClass: state.currentClass?.id === updatedClass.id ? updatedClass : state.currentClass,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.deleteModelClassSuccess, (state, { classId }) => ({
    ...state,
    classes: state.classes.filter(c => c.id !== classId),
    currentClass: state.currentClass?.id === classId ? null : state.currentClass,
    isLoading: false,
    error: null
  })),

  // Training
  on(ModelsActions.startTraining, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.startTrainingSuccess, (state, { trainingJob }) => ({
    ...state,
    trainingJobs: [...state.trainingJobs, trainingJob],
    currentTrainingJob: trainingJob,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.startTrainingFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(ModelsActions.updateTrainingProgress, (state, { jobId, progress, logs }) => ({
    ...state,
    trainingJobs: state.trainingJobs.map(job => 
      job.id === jobId 
        ? { ...job, progress, logs: logs ? [...(job.logs || []), ...logs] : job.logs }
        : job
    ),
    currentTrainingJob: state.currentTrainingJob?.id === jobId 
      ? { 
          ...state.currentTrainingJob, 
          progress, 
          logs: logs ? [...(state.currentTrainingJob.logs || []), ...logs] : state.currentTrainingJob.logs 
        }
      : state.currentTrainingJob
  })),

  on(ModelsActions.trainingCompleted, (state, { jobId, model, metrics }) => ({
    ...state,
    trainingJobs: state.trainingJobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'COMPLETED' as const, progress: 100, completedAt: new Date().toISOString() }
        : job
    ),
    models: state.models.map(m => m.id === model.id ? model : m),
    currentModel: state.currentModel?.id === model.id ? model : state.currentModel,
    modelMetrics: { ...state.modelMetrics, [model.id]: metrics },
    currentTrainingJob: state.currentTrainingJob?.id === jobId ? null : state.currentTrainingJob
  })),

  on(ModelsActions.trainingFailed, (state, { jobId, error }) => ({
    ...state,
    trainingJobs: state.trainingJobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'FAILED' as const, errorMessage: error, completedAt: new Date().toISOString() }
        : job
    ),
    currentTrainingJob: state.currentTrainingJob?.id === jobId ? null : state.currentTrainingJob,
    error
  })),

  on(ModelsActions.stopTrainingSuccess, (state, { jobId }) => ({
    ...state,
    trainingJobs: state.trainingJobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'FAILED' as const, errorMessage: 'Training stopped by user', completedAt: new Date().toISOString() }
        : job
    ),
    currentTrainingJob: state.currentTrainingJob?.id === jobId ? null : state.currentTrainingJob,
    isLoading: false
  })),

  // Predictions
  on(ModelsActions.loadPredictions, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.loadPredictionsSuccess, (state, { predictions }) => ({
    ...state,
    predictions,
    filteredPredictions: predictions,
    isLoading: false,
    error: null
  })),

  on(ModelsActions.loadPredictionsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(ModelsActions.runPrediction, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ModelsActions.runPredictionSuccess, (state, { predictions }) => ({
    ...state,
    predictions: [...state.predictions, ...predictions],
    filteredPredictions: [...state.filteredPredictions, ...predictions],
    isLoading: false,
    error: null
  })),

  on(ModelsActions.runPredictionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(ModelsActions.validatePredictionSuccess, (state, { prediction }) => ({
    ...state,
    predictions: state.predictions.map(p => p.id === prediction.id ? prediction : p),
    filteredPredictions: state.filteredPredictions.map(p => p.id === prediction.id ? prediction : p),
    isLoading: false,
    error: null
  })),

  // Metrics
  on(ModelsActions.loadModelMetricsSuccess, (state, { modelId, metrics }) => ({
    ...state,
    modelMetrics: { ...state.modelMetrics, [modelId]: metrics },
    isLoading: false,
    error: null
  })),

  // Filters
  on(ModelsActions.setModelFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  })),

  on(ModelsActions.clearModelFilters, (state) => ({
    ...state,
    filters: {},
    filteredPredictions: state.predictions
  })),

  // UI Actions
  on(ModelsActions.setCurrentModel, (state, { model }) => ({
    ...state,
    currentModel: model
  })),

  on(ModelsActions.setCurrentClass, (state, { class: modelClass }) => ({
    ...state,
    currentClass: modelClass
  })),

  on(ModelsActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
