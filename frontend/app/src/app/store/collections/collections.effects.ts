import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CollectionsActions from './collections.actions';

@Injectable()
export class CollectionsEffects {
  private baseUrl = 'http://localhost:8080/api';

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  // Collection Effects
  loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadCollections),
      switchMap(() =>
        this.http.get<any[]>(`${this.baseUrl}/collections/list`).pipe(
          map((collections) => CollectionsActions.loadCollectionsSuccess({ collections })),
          catchError((error) => of(CollectionsActions.loadCollectionsFailure({
            error: error.message || 'Failed to load collections'
          })))
        )
      )
    )
  );

  loadCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadCollection),
      switchMap(({ collectionId }) =>
        this.http.get<any>(`${this.baseUrl}/collections/${collectionId}`).pipe(
          map((collection) => CollectionsActions.loadCollectionSuccess({ collection })),
          catchError((error) => of(CollectionsActions.loadCollectionFailure({
            error: error.message || 'Failed to load collection'
          })))
        )
      )
    )
  );

  addCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.addCollection),
      switchMap(({ collection }) => {
        const formData = new FormData();
        formData.append('nom', collection.nom);
        formData.append('Description', collection.description);
        
        return this.http.post<any>(`${this.baseUrl}/collections/addCollection`, formData).pipe(
          map((newCollection) => CollectionsActions.addCollectionSuccess({ collection: newCollection })),
          catchError((error) => of(CollectionsActions.addCollectionFailure({
            error: error.message || 'Failed to add collection'
          })))
        );
      })
    )
  );

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.deleteCollection),
      switchMap(({ collectionId }) =>
        this.http.delete(`${this.baseUrl}/collections/delete/${collectionId}`).pipe(
          map(() => CollectionsActions.deleteCollectionSuccess({ collectionId })),
          catchError((error) => of(CollectionsActions.deleteCollectionFailure({
            error: error.message || 'Failed to delete collection'
          })))
        )
      )
    )
  );

  updateCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.updateCollection),
      switchMap(({ collectionId, changes }) =>
        this.http.put<any>(`${this.baseUrl}/collections/update`, changes).pipe(
          map((updatedCollection) => CollectionsActions.updateCollectionSuccess({ collection: updatedCollection })),
          catchError((error) => of(CollectionsActions.updateCollectionFailure({
            error: error.message || 'Failed to update collection'
          })))
        )
      )
    )
  );

  // Specimen Effects
  loadSpecimensByCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadSpecimensByCollection),
      switchMap(({ collectionId }) =>
        this.http.get<any[]>(`${this.baseUrl}/collections/${collectionId}/specimen`).pipe(
          map((specimens) => CollectionsActions.loadSpecimensByCollectionSuccess({ specimens })),
          catchError((error) => of(CollectionsActions.loadSpecimensByCollectionFailure({
            error: error.message || 'Failed to load specimens'
          })))
        )
      )
    )
  );

  loadSpecimensByDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadSpecimensByDataset),
      switchMap(({ datasetId }) =>
        this.http.get<any[]>(`${this.baseUrl}/collections/Dataset/${datasetId}/specimen`).pipe(
          map((specimens) => CollectionsActions.loadSpecimensByDatasetSuccess({ specimens })),
          catchError((error) => of(CollectionsActions.loadSpecimensByDatasetFailure({
            error: error.message || 'Failed to load dataset specimens'
          })))
        )
      )
    )
  );

  loadFilteredSpecimens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadFilteredSpecimens),
      switchMap(({ filters, projectId }) =>
        this.http.post<any[]>(`${this.baseUrl}/specimen/MR/${projectId}`, filters).pipe(
          map((specimens) => CollectionsActions.loadFilteredSpecimensSuccess({ specimens })),
          catchError((error) => of(CollectionsActions.loadFilteredSpecimensFailure({
            error: error.message || 'Failed to load filtered specimens'
          })))
        )
      )
    )
  );

  // Dataset Effects
  loadDatasets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadDatasets),
      switchMap(({ projectId }) =>
        this.http.get<any[]>(`${this.baseUrl}/projets/${projectId}/Datasets`).pipe(
          map((datasets) => CollectionsActions.loadDatasetsSuccess({ datasets })),
          catchError((error) => of(CollectionsActions.loadDatasetsFailure({
            error: error.message || 'Failed to load datasets'
          })))
        )
      )
    )
  );

  loadDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadDataset),
      switchMap(({ datasetId }) =>
        this.http.get<any>(`${this.baseUrl}/collections/dataset/${datasetId}`).pipe(
          map((dataset) => CollectionsActions.loadDatasetSuccess({ dataset })),
          catchError((error) => {
            let errorMessage = 'Failed to load dataset';
            if (error.status === 404) {
              errorMessage = `Dataset with ID ${datasetId} not found. This collection may not have any datasets yet.`;
            } else if (error.status === 500) {
              errorMessage = 'Server error while loading dataset';
            } else if (error.message) {
              errorMessage = error.message;
            }
            return of(CollectionsActions.loadDatasetFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  addSpecimensToDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.addSpecimensToDataset),
      switchMap(({ datasetId, specimenIds }) =>
        this.http.post<any>(`${this.baseUrl}/collections/addSpecimensToDataset/${datasetId}`, specimenIds).pipe(
          map((dataset) => CollectionsActions.addSpecimensToDatasetSuccess({ dataset })),
          catchError((error) => of(CollectionsActions.addSpecimensToDatasetFailure({
            error: error.message || 'Failed to add specimens to dataset'
          })))
        )
      )
    )
  );

  // CSV Import Effects
  importCsv$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.importCsv),
      switchMap(({ collectionId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.http.post<number>(`${this.baseUrl}/import/import-csv/${collectionId}`, formData).pipe(
          map((specimenCount) => CollectionsActions.importCsvSuccess({ collectionId, specimenCount })),
          catchError((error) => of(CollectionsActions.importCsvFailure({
            error: error.message || 'Failed to import CSV'
          })))
        );
      })
    )
  );

  // Annotation Import Effects
  importAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.importAnnotations),
      switchMap(({ file, format, datasetId }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('datasetId', datasetId.toString());
        
        return this.http.post<any[]>(`${this.baseUrl}/import/import-annotations`, formData).pipe(
          map((annotations) => CollectionsActions.importAnnotationsSuccess({ annotations })),
          catchError((error) => of(CollectionsActions.importAnnotationsFailure({
            error: error.message || 'Failed to import annotations'
          })))
        );
      })
    )
  );

  // Dataset Creation Effects
  createDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.createDataset),
      switchMap(({ projectId, dataset }) =>
        this.http.post<any>(`${this.baseUrl}/collections/addDataset/${projectId}`, dataset).pipe(
          map((createdDataset) => CollectionsActions.createDatasetSuccess({ dataset: createdDataset })),
          catchError((error) => {
            let errorMessage = 'Failed to create dataset';
            if (error.status === 404) {
              errorMessage = `Project with ID ${projectId} not found`;
            } else if (error.status === 500) {
              errorMessage = 'Server error while creating dataset';
            } else if (error.message) {
              errorMessage = error.message;
            }
            return of(CollectionsActions.createDatasetFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Dataset Update Effects
  updateDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.updateDataset),
      switchMap(({ datasetId, changes }) =>
        this.http.put<any>(`${this.baseUrl}/collections/updateDataset/${datasetId}`, changes).pipe(
          map((updatedDataset) => CollectionsActions.updateDatasetSuccess({ dataset: updatedDataset })),
          catchError((error) => {
            let errorMessage = 'Failed to update dataset';
            if (error.status === 404) {
              errorMessage = `Dataset with ID ${datasetId} not found`;
            } else if (error.status === 500) {
              errorMessage = 'Server error while updating dataset';
            } else if (error.message) {
              errorMessage = error.message;
            }
            return of(CollectionsActions.updateDatasetFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Dataset Delete Effects
  deleteDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.deleteDataset),
      switchMap(({ datasetId }) =>
        this.http.delete<any>(`${this.baseUrl}/collections/deleteDataset/${datasetId}`).pipe(
          map(() => CollectionsActions.deleteDatasetSuccess({ datasetId })),
          catchError((error) => {
            let errorMessage = 'Failed to delete dataset';
            if (error.status === 404) {
              errorMessage = `Dataset with ID ${datasetId} not found`;
            } else if (error.status === 500) {
              errorMessage = 'Server error while deleting dataset';
            } else if (error.message) {
              errorMessage = error.message;
            }
            return of(CollectionsActions.deleteDatasetFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
}
