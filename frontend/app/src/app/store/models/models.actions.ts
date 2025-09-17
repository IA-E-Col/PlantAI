import { createAction, props } from '@ngrx/store';
import { Model, ModelClass, Prediction, TrainingJob, ModelMetrics } from './models.state';

// Model Actions
export const loadModels = createAction('[Models] Load Models');

export const loadModelsSuccess = createAction(
  '[Models] Load Models Success',
  props<{ models: Model[] }>()
);

export const loadModelsFailure = createAction(
  '[Models] Load Models Failure',
  props<{ error: string }>()
);

export const loadModel = createAction(
  '[Models] Load Model',
  props<{ modelId: number }>()
);

export const loadModelSuccess = createAction(
  '[Models] Load Model Success',
  props<{ model: Model }>()
);

export const loadModelFailure = createAction(
  '[Models] Load Model Failure',
  props<{ error: string }>()
);

export const createModel = createAction(
  '[Models] Create Model',
  props<{ model: Omit<Model, 'id'> }>()
);

export const createModelSuccess = createAction(
  '[Models] Create Model Success',
  props<{ model: Model }>()
);

export const createModelFailure = createAction(
  '[Models] Create Model Failure',
  props<{ error: string }>()
);

export const updateModel = createAction(
  '[Models] Update Model',
  props<{ modelId: number; changes: Partial<Model> }>()
);

export const updateModelSuccess = createAction(
  '[Models] Update Model Success',
  props<{ model: Model }>()
);

export const updateModelFailure = createAction(
  '[Models] Update Model Failure',
  props<{ error: string }>()
);

export const deleteModel = createAction(
  '[Models] Delete Model',
  props<{ modelId: number }>()
);

export const deleteModelSuccess = createAction(
  '[Models] Delete Model Success',
  props<{ modelId: number }>()
);

export const deleteModelFailure = createAction(
  '[Models] Delete Model Failure',
  props<{ error: string }>()
);

// Model Class Actions
export const loadModelClasses = createAction(
  '[Models] Load Model Classes',
  props<{ modelId: number }>()
);

export const loadModelClassesSuccess = createAction(
  '[Models] Load Model Classes Success',
  props<{ classes: ModelClass[] }>()
);

export const loadModelClassesFailure = createAction(
  '[Models] Load Model Classes Failure',
  props<{ error: string }>()
);

export const createModelClass = createAction(
  '[Models] Create Model Class',
  props<{ modelId: number; class: Omit<ModelClass, 'id'> }>()
);

export const createModelClassSuccess = createAction(
  '[Models] Create Model Class Success',
  props<{ class: ModelClass }>()
);

export const createModelClassFailure = createAction(
  '[Models] Create Model Class Failure',
  props<{ error: string }>()
);

export const updateModelClass = createAction(
  '[Models] Update Model Class',
  props<{ classId: number; changes: Partial<ModelClass> }>()
);

export const updateModelClassSuccess = createAction(
  '[Models] Update Model Class Success',
  props<{ class: ModelClass }>()
);

export const updateModelClassFailure = createAction(
  '[Models] Update Model Class Failure',
  props<{ error: string }>()
);

export const deleteModelClass = createAction(
  '[Models] Delete Model Class',
  props<{ classId: number }>()
);

export const deleteModelClassSuccess = createAction(
  '[Models] Delete Model Class Success',
  props<{ classId: number }>()
);

export const deleteModelClassFailure = createAction(
  '[Models] Delete Model Class Failure',
  props<{ error: string }>()
);

// All Classes Management (not model-specific)
export const loadAllClasses = createAction(
  '[Models] Load All Classes'
);

export const loadAllClassesSuccess = createAction(
  '[Models] Load All Classes Success',
  props<{ classes: ModelClass[] }>()
);

export const loadAllClassesFailure = createAction(
  '[Models] Load All Classes Failure',
  props<{ error: string }>()
);

export const createClass = createAction(
  '[Models] Create Class',
  props<{ class: Omit<ModelClass, 'id'> }>()
);

export const createClassSuccess = createAction(
  '[Models] Create Class Success',
  props<{ class: ModelClass }>()
);

export const createClassFailure = createAction(
  '[Models] Create Class Failure',
  props<{ error: string }>()
);

export const deleteClass = createAction(
  '[Models] Delete Class',
  props<{ classId: number }>()
);

export const deleteClassSuccess = createAction(
  '[Models] Delete Class Success',
  props<{ classId: number }>()
);

export const deleteClassFailure = createAction(
  '[Models] Delete Class Failure',
  props<{ error: string }>()
);

// Training Actions
export const startTraining = createAction(
  '[Models] Start Training',
  props<{ modelId: number; trainingConfig?: any }>()
);

export const startTrainingSuccess = createAction(
  '[Models] Start Training Success',
  props<{ trainingJob: TrainingJob }>()
);

export const startTrainingFailure = createAction(
  '[Models] Start Training Failure',
  props<{ error: string }>()
);

export const updateTrainingProgress = createAction(
  '[Models] Update Training Progress',
  props<{ jobId: number; progress: number; logs?: string[] }>()
);

export const trainingCompleted = createAction(
  '[Models] Training Completed',
  props<{ jobId: number; model: Model; metrics: ModelMetrics }>()
);

export const trainingFailed = createAction(
  '[Models] Training Failed',
  props<{ jobId: number; error: string }>()
);

export const stopTraining = createAction(
  '[Models] Stop Training',
  props<{ jobId: number }>()
);

export const stopTrainingSuccess = createAction(
  '[Models] Stop Training Success',
  props<{ jobId: number }>()
);

export const stopTrainingFailure = createAction(
  '[Models] Stop Training Failure',
  props<{ error: string }>()
);

// Prediction Actions
export const loadPredictions = createAction(
  '[Models] Load Predictions',
  props<{ modelId?: number; datasetId?: number }>()
);

export const loadPredictionsSuccess = createAction(
  '[Models] Load Predictions Success',
  props<{ predictions: Prediction[] }>()
);

export const loadPredictionsFailure = createAction(
  '[Models] Load Predictions Failure',
  props<{ error: string }>()
);

export const runPrediction = createAction(
  '[Models] Run Prediction',
  props<{ modelId: number; specimenId?: number; datasetId?: number }>()
);

export const runPredictionSuccess = createAction(
  '[Models] Run Prediction Success',
  props<{ predictions: Prediction[] }>()
);

export const runPredictionFailure = createAction(
  '[Models] Run Prediction Failure',
  props<{ error: string }>()
);

export const validatePrediction = createAction(
  '[Models] Validate Prediction',
  props<{ predictionId: number; isCorrect: boolean; correctedClass?: string }>()
);

export const validatePredictionSuccess = createAction(
  '[Models] Validate Prediction Success',
  props<{ prediction: Prediction }>()
);

export const validatePredictionFailure = createAction(
  '[Models] Validate Prediction Failure',
  props<{ error: string }>()
);

// Metrics Actions
export const loadModelMetrics = createAction(
  '[Models] Load Model Metrics',
  props<{ modelId: number }>()
);

export const loadModelMetricsSuccess = createAction(
  '[Models] Load Model Metrics Success',
  props<{ modelId: number; metrics: ModelMetrics }>()
);

export const loadModelMetricsFailure = createAction(
  '[Models] Load Model Metrics Failure',
  props<{ error: string }>()
);

// Filter Actions
export const setModelFilters = createAction(
  '[Models] Set Model Filters',
  props<{ filters: any }>()
);

export const clearModelFilters = createAction(
  '[Models] Clear Model Filters'
);

// UI Actions
export const setCurrentModel = createAction(
  '[Models] Set Current Model',
  props<{ model: Model }>()
);

export const setCurrentClass = createAction(
  '[Models] Set Current Class',
  props<{ class: ModelClass }>()
);

export const clearError = createAction(
  '[Models] Clear Error'
);
