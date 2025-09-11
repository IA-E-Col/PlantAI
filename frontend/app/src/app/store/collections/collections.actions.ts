import { createAction, props } from '@ngrx/store';
import { Collection, Specimen, Dataset } from './collections.state';

// Collection Actions
export const loadCollections = createAction('[Collections] Load Collections');

export const loadCollectionsSuccess = createAction(
  '[Collections] Load Collections Success',
  props<{ collections: Collection[] }>()
);

export const loadCollectionsFailure = createAction(
  '[Collections] Load Collections Failure',
  props<{ error: string }>()
);

export const loadCollection = createAction(
  '[Collections] Load Collection',
  props<{ collectionId: number }>()
);

export const loadCollectionSuccess = createAction(
  '[Collections] Load Collection Success',
  props<{ collection: Collection }>()
);

export const loadCollectionFailure = createAction(
  '[Collections] Load Collection Failure',
  props<{ error: string }>()
);

export const addCollection = createAction(
  '[Collections] Add Collection',
  props<{ collection: Omit<Collection, 'id'> }>()
);

export const addCollectionSuccess = createAction(
  '[Collections] Add Collection Success',
  props<{ collection: Collection }>()
);

export const addCollectionFailure = createAction(
  '[Collections] Add Collection Failure',
  props<{ error: string }>()
);

export const updateCollection = createAction(
  '[Collections] Update Collection',
  props<{ collectionId: number; changes: Collection }>()
);

export const updateCollectionSuccess = createAction(
  '[Collections] Update Collection Success',
  props<{ collection: Collection }>()
);

export const updateCollectionFailure = createAction(
  '[Collections] Update Collection Failure',
  props<{ error: string }>()
);

export const deleteCollection = createAction(
  '[Collections] Delete Collection',
  props<{ collectionId: number }>()
);

export const deleteCollectionSuccess = createAction(
  '[Collections] Delete Collection Success',
  props<{ collectionId: number }>()
);

export const deleteCollectionFailure = createAction(
  '[Collections] Delete Collection Failure',
  props<{ error: string }>()
);

// Specimen Actions
export const loadSpecimens = createAction(
  '[Collections] Load Specimens'
);

export const loadSpecimensByCollection = createAction(
  '[Collections] Load Specimens By Collection',
  props<{ collectionId: number }>()
);

export const loadSpecimensByCollectionSuccess = createAction(
  '[Collections] Load Specimens By Collection Success',
  props<{ specimens: Specimen[] }>()
);

export const loadSpecimensByCollectionFailure = createAction(
  '[Collections] Load Specimens By Collection Failure',
  props<{ error: string }>()
);

export const loadSpecimensByDataset = createAction(
  '[Collections] Load Specimens By Dataset',
  props<{ datasetId: number }>()
);

export const loadSpecimensByDatasetSuccess = createAction(
  '[Collections] Load Specimens By Dataset Success',
  props<{ specimens: Specimen[] }>()
);

export const loadSpecimensByDatasetFailure = createAction(
  '[Collections] Load Specimens By Dataset Failure',
  props<{ error: string }>()
);

export const addSpecimensToDataset = createAction(
  '[Collections] Add Specimens To Dataset',
  props<{ datasetId: number; specimenIds: number[] }>()
);

export const addSpecimensToDatasetSuccess = createAction(
  '[Collections] Add Specimens To Dataset Success',
  props<{ dataset: any }>()
);

export const addSpecimensToDatasetFailure = createAction(
  '[Collections] Add Specimens To Dataset Failure',
  props<{ error: string }>()
);

export const loadFilteredSpecimens = createAction(
  '[Collections] Load Filtered Specimens',
  props<{ filters: any; projectId: number }>()
);

export const loadFilteredSpecimensSuccess = createAction(
  '[Collections] Load Filtered Specimens Success',
  props<{ specimens: Specimen[] }>()
);

export const loadFilteredSpecimensFailure = createAction(
  '[Collections] Load Filtered Specimens Failure',
  props<{ error: string }>()
);

export const setCurrentSpecimen = createAction(
  '[Collections] Set Current Specimen',
  props<{ specimen: Specimen }>()
);

// Dataset Actions
export const loadDatasets = createAction(
  '[Collections] Load Datasets',
  props<{ projectId: number }>()
);

export const loadDatasetsSuccess = createAction(
  '[Collections] Load Datasets Success',
  props<{ datasets: Dataset[] }>()
);

export const loadDatasetsFailure = createAction(
  '[Collections] Load Datasets Failure',
  props<{ error: string }>()
);

export const loadDataset = createAction(
  '[Collections] Load Dataset',
  props<{ datasetId: number }>()
);

export const loadDatasetSuccess = createAction(
  '[Collections] Load Dataset Success',
  props<{ dataset: Dataset }>()
);

export const loadDatasetFailure = createAction(
  '[Collections] Load Dataset Failure',
  props<{ error: string }>()
);


// Dataset Creation Actions
export const createDataset = createAction(
  '[Collections] Create Dataset',
  props<{ projectId: number; dataset: Omit<Dataset, 'id'> }>()
);

export const createDatasetSuccess = createAction(
  '[Collections] Create Dataset Success',
  props<{ dataset: Dataset }>()
);

export const createDatasetFailure = createAction(
  '[Collections] Create Dataset Failure',
  props<{ error: string }>()
);

// Dataset Update Actions
export const updateDataset = createAction(
  '[Collections] Update Dataset',
  props<{ datasetId: number; changes: Partial<Dataset> }>()
);

export const updateDatasetSuccess = createAction(
  '[Collections] Update Dataset Success',
  props<{ dataset: Dataset }>()
);

export const updateDatasetFailure = createAction(
  '[Collections] Update Dataset Failure',
  props<{ error: string }>()
);

// Dataset Delete Actions
export const deleteDataset = createAction(
  '[Collections] Delete Dataset',
  props<{ datasetId: number }>()
);

export const deleteDatasetSuccess = createAction(
  '[Collections] Delete Dataset Success',
  props<{ datasetId: number }>()
);

export const deleteDatasetFailure = createAction(
  '[Collections] Delete Dataset Failure',
  props<{ error: string }>()
);

// Filter Actions
export const setFilters = createAction(
  '[Collections] Set Filters',
  props<{ filters: any }>()
);

export const clearFilters = createAction(
  '[Collections] Clear Filters'
);

// UI Actions
export const setCurrentCollection = createAction(
  '[Collections] Set Current Collection',
  props<{ collection: Collection }>()
);

export const setCurrentDataset = createAction(
  '[Collections] Set Current Dataset',
  props<{ dataset: Dataset }>()
);

export const clearError = createAction(
  '[Collections] Clear Error'
);

// CSV Import Actions
export const importCsv = createAction(
  '[Collections] Import CSV',
  props<{ collectionId: number; file: File }>()
);

export const importCsvSuccess = createAction(
  '[Collections] Import CSV Success',
  props<{ collectionId: number; specimenCount: number }>()
);

export const importCsvFailure = createAction(
  '[Collections] Import CSV Failure',
  props<{ error: string }>()
);

// Annotation Import Actions
export const importAnnotations = createAction(
  '[Collections] Import Annotations',
  props<{ file: File; format: string; datasetId: number }>()
);

export const importAnnotationsSuccess = createAction(
  '[Collections] Import Annotations Success',
  props<{ annotations: any[] }>()
);

export const importAnnotationsFailure = createAction(
  '[Collections] Import Annotations Failure',
  props<{ error: string }>()
);

