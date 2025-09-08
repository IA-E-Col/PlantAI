import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as ModelsActions from './models.actions';
import { Model, ModelClass, Prediction, TrainingJob, ModelMetrics } from './models.state';

@Injectable()
export class ModelsEffects {
  private apiUrl = 'http://localhost:8080/api';
  private predictionUrl = 'http://127.0.0.1:8000'; // Python prediction server

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  // Load Models Effects
  loadModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.loadModels),
      switchMap(() =>
        this.http.get<Model[]>(`${this.apiUrl}/models`).pipe(
          map(models => ModelsActions.loadModelsSuccess({ models })),
          catchError(error => of(ModelsActions.loadModelsFailure({ 
            error: error.message || 'Failed to load models' 
          })))
        )
      )
    )
  );

  loadModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.loadModel),
      switchMap(action =>
        this.http.get<Model>(`${this.apiUrl}/models/${action.modelId}`).pipe(
          map(model => ModelsActions.loadModelSuccess({ model })),
          catchError(error => of(ModelsActions.loadModelFailure({ 
            error: error.message || 'Failed to load model' 
          })))
        )
      )
    )
  );

  // Create Model Effects
  createModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.createModel),
      switchMap(action =>
        this.http.post<Model>(`${this.apiUrl}/models`, action.model).pipe(
          map(model => ModelsActions.createModelSuccess({ model })),
          catchError(error => of(ModelsActions.createModelFailure({ 
            error: error.message || 'Failed to create model' 
          })))
        )
      )
    )
  );

  // Update Model Effects
  updateModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.updateModel),
      switchMap(action =>
        this.http.put<Model>(`${this.apiUrl}/models/${action.modelId}`, action.changes).pipe(
          map(model => ModelsActions.updateModelSuccess({ model })),
          catchError(error => of(ModelsActions.updateModelFailure({ 
            error: error.message || 'Failed to update model' 
          })))
        )
      )
    )
  );

  // Delete Model Effects
  deleteModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.deleteModel),
      switchMap(action =>
        this.http.delete(`${this.apiUrl}/models/${action.modelId}`).pipe(
          map(() => ModelsActions.deleteModelSuccess({ modelId: action.modelId })),
          catchError(error => of(ModelsActions.deleteModelFailure({ 
            error: error.message || 'Failed to delete model' 
          })))
        )
      )
    )
  );

  // Model Classes Effects
  loadModelClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.loadModelClasses),
      switchMap(action =>
        this.http.get<ModelClass[]>(`${this.apiUrl}/models/${action.modelId}/classes`).pipe(
          map(classes => ModelsActions.loadModelClassesSuccess({ classes })),
          catchError(error => of(ModelsActions.loadModelClassesFailure({ 
            error: error.message || 'Failed to load model classes' 
          })))
        )
      )
    )
  );

  createModelClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.createModelClass),
      switchMap(action =>
        this.http.post<ModelClass>(`${this.apiUrl}/models/${action.modelId}/classes`, action.class).pipe(
          map(modelClass => ModelsActions.createModelClassSuccess({ class: modelClass })),
          catchError(error => of(ModelsActions.createModelClassFailure({ 
            error: error.message || 'Failed to create model class' 
          })))
        )
      )
    )
  );

  updateModelClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.updateModelClass),
      switchMap(action =>
        this.http.put<ModelClass>(`${this.apiUrl}/classes/${action.classId}`, action.changes).pipe(
          map(modelClass => ModelsActions.updateModelClassSuccess({ class: modelClass })),
          catchError(error => of(ModelsActions.updateModelClassFailure({ 
            error: error.message || 'Failed to update model class' 
          })))
        )
      )
    )
  );

  deleteModelClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.deleteModelClass),
      switchMap(action =>
        this.http.delete(`${this.apiUrl}/classes/${action.classId}`).pipe(
          map(() => ModelsActions.deleteModelClassSuccess({ classId: action.classId })),
          catchError(error => of(ModelsActions.deleteModelClassFailure({ 
            error: error.message || 'Failed to delete model class' 
          })))
        )
      )
    )
  );

  // Training Effects
  startTraining$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.startTraining),
      switchMap(action =>
        this.http.post<TrainingJob>(`${this.apiUrl}/models/${action.modelId}/train`, action.trainingConfig || {}).pipe(
          map(trainingJob => ModelsActions.startTrainingSuccess({ trainingJob })),
          catchError(error => of(ModelsActions.startTrainingFailure({ 
            error: error.message || 'Failed to start training' 
          })))
        )
      )
    )
  );

  stopTraining$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.stopTraining),
      switchMap(action =>
        this.http.post(`${this.apiUrl}/training-jobs/${action.jobId}/stop`, {}).pipe(
          map(() => ModelsActions.stopTrainingSuccess({ jobId: action.jobId })),
          catchError(error => of(ModelsActions.stopTrainingFailure({ 
            error: error.message || 'Failed to stop training' 
          })))
        )
      )
    )
  );

  // Prediction Effects
  loadPredictions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.loadPredictions),
      switchMap(action => {
        let params = new HttpParams();
        if (action.modelId) {
          params = params.set('modelId', action.modelId.toString());
        }
        if (action.datasetId) {
          params = params.set('datasetId', action.datasetId.toString());
        }

        return this.http.get<Prediction[]>(`${this.apiUrl}/predictions`, { params }).pipe(
          map(predictions => ModelsActions.loadPredictionsSuccess({ predictions })),
          catchError(error => of(ModelsActions.loadPredictionsFailure({ 
            error: error.message || 'Failed to load predictions' 
          })))
        );
      })
    )
  );

  runPrediction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.runPrediction),
      switchMap(action => {
        // Determine the API endpoint based on whether we're predicting single specimen or dataset
        let url: string;
        if (action.specimenId) {
          // Single specimen prediction
          url = `${this.apiUrl}/models/predict/${action.datasetId || 'default'}/${action.specimenId}/${action.modelId}`;
        } else if (action.datasetId) {
          // Dataset prediction
          url = `${this.apiUrl}/models/predict-dataset/${action.datasetId}/${action.modelId}`;
        } else {
          return of(ModelsActions.runPredictionFailure({ 
            error: 'Either specimenId or datasetId must be provided' 
          }));
        }

        return this.http.post<Prediction[]>(url, {}).pipe(
          map(predictions => ModelsActions.runPredictionSuccess({ predictions })),
          catchError(error => of(ModelsActions.runPredictionFailure({ 
            error: error.message || 'Failed to run prediction' 
          })))
        );
      })
    )
  );

  validatePrediction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.validatePrediction),
      switchMap(action =>
        this.http.put<Prediction>(`${this.apiUrl}/predictions/${action.predictionId}/validate`, {
          isCorrect: action.isCorrect,
          correctedClass: action.correctedClass
        }).pipe(
          map(prediction => ModelsActions.validatePredictionSuccess({ prediction })),
          catchError(error => of(ModelsActions.validatePredictionFailure({ 
            error: error.message || 'Failed to validate prediction' 
          })))
        )
      )
    )
  );

  // Metrics Effects
  loadModelMetrics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.loadModelMetrics),
      switchMap(action =>
        this.http.get<ModelMetrics>(`${this.apiUrl}/models/${action.modelId}/metrics`).pipe(
          map(metrics => ModelsActions.loadModelMetricsSuccess({ 
            modelId: action.modelId, 
            metrics 
          })),
          catchError(error => of(ModelsActions.loadModelMetricsFailure({ 
            error: error.message || 'Failed to load model metrics' 
          })))
        )
      )
    )
  );

  // Navigation Effects
  createModelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.createModelSuccess),
      tap(action => {
        // Navigate to the new model's detail page
        this.router.navigate(['/admin/models', action.model.id]);
      })
    ), { dispatch: false }
  );

  startTrainingSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.startTrainingSuccess),
      tap(action => {
        console.log(`Training started for model: ${action.trainingJob.modelId}`);
        // You could show a notification here
      })
    ), { dispatch: false }
  );

  trainingCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.trainingCompleted),
      tap(action => {
        console.log(`Training completed for model: ${action.model.id}`);
        // You could show a success notification here
      })
    ), { dispatch: false }
  );

  trainingFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelsActions.trainingFailed),
      tap(action => {
        console.error(`Training failed: ${action.error}`);
        // You could show an error notification here
      })
    ), { dispatch: false }
  );
}
