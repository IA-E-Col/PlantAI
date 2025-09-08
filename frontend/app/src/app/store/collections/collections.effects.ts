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
      switchMap(({ collection }) =>
        this.http.post<any>(`${this.baseUrl}/collections`, collection).pipe(
          map((newCollection) => CollectionsActions.addCollectionSuccess({ collection: newCollection })),
          catchError((error) => of(CollectionsActions.addCollectionFailure({
            error: error.message || 'Failed to add collection'
          })))
        )
      )
    )
  );

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.deleteCollection),
      switchMap(({ collectionId }) =>
        this.http.delete(`${this.baseUrl}/collections/${collectionId}`).pipe(
          map(() => CollectionsActions.deleteCollectionSuccess({ collectionId })),
          catchError((error) => of(CollectionsActions.deleteCollectionFailure({
            error: error.message || 'Failed to delete collection'
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
        this.http.get<any[]>(`${this.baseUrl}/specimen/collection/${collectionId}`).pipe(
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
        this.http.get<any[]>(`${this.baseUrl}/Dataset/${datasetId}/specimen`).pipe(
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
      switchMap(() =>
        this.http.get<any[]>(`${this.baseUrl}/datasets`).pipe(
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
        this.http.get<any>(`${this.baseUrl}/dataset/${datasetId}`).pipe(
          map((dataset) => CollectionsActions.loadDatasetSuccess({ dataset })),
          catchError((error) => of(CollectionsActions.loadDatasetFailure({
            error: error.message || 'Failed to load dataset'
          })))
        )
      )
    )
  );

  addSpecimensToDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.addSpecimensToDataset),
      switchMap(({ datasetId, specimens }) =>
        this.http.post<any>(`${this.baseUrl}/dataset/${datasetId}/specimens`, { specimens }).pipe(
          map(() => CollectionsActions.addSpecimensToDatasetSuccess({ datasetId, specimens })),
          catchError((error) => of(CollectionsActions.addSpecimensToDatasetFailure({
            error: error.message || 'Failed to add specimens to dataset'
          })))
        )
      )
    )
  );
}
