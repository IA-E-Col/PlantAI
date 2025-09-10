import { createReducer, on } from '@ngrx/store';
import * as CollectionsActions from './collections.actions';
import { initialCollectionsState } from './collections.state';

export const collectionsReducer = createReducer(
  initialCollectionsState,

  // Collection reducers
  on(CollectionsActions.loadCollections, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadCollectionsSuccess, (state, { collections }) => ({
    ...state,
    collections,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadCollectionsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.loadCollection, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadCollectionSuccess, (state, { collection }) => ({
    ...state,
    currentCollection: collection,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadCollectionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.addCollection, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.addCollectionSuccess, (state, { collection }) => ({
    ...state,
    collections: [...state.collections, collection],
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.addCollectionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.updateCollection, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.updateCollectionSuccess, (state, { collection }) => ({
    ...state,
    collections: state.collections.map(c => c.id === collection.id ? collection : c),
    currentCollection: state.currentCollection?.id === collection.id ? collection : state.currentCollection,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.updateCollectionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.deleteCollection, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.deleteCollectionSuccess, (state, { collectionId }) => ({
    ...state,
    collections: state.collections.filter(c => c.id !== collectionId),
    currentCollection: state.currentCollection?.id === collectionId ? null : state.currentCollection,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.deleteCollectionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Specimen reducers
  on(CollectionsActions.loadSpecimensByCollection, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadSpecimensByCollectionSuccess, (state, { specimens }) => ({
    ...state,
    specimens,
    filteredSpecimens: specimens,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadSpecimensByCollectionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.loadSpecimensByDataset, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadSpecimensByDatasetSuccess, (state, { specimens }) => ({
    ...state,
    specimens,
    filteredSpecimens: specimens,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadSpecimensByDatasetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.loadFilteredSpecimens, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadFilteredSpecimensSuccess, (state, { specimens }) => ({
    ...state,
    specimens,
    filteredSpecimens: specimens,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadFilteredSpecimensFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.setCurrentSpecimen, (state, { specimen }) => ({
    ...state,
    currentSpecimen: specimen,
  })),

  // Dataset reducers
  on(CollectionsActions.loadDatasets, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadDatasetsSuccess, (state, { datasets }) => ({
    ...state,
    datasets,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadDatasetsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.loadDataset, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.loadDatasetSuccess, (state, { dataset }) => ({
    ...state,
    currentDataset: dataset,
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.loadDatasetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CollectionsActions.addSpecimensToDataset, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.addSpecimensToDatasetSuccess, (state, { datasetId, specimens }) => ({
    ...state,
    datasets: state.datasets.map(dataset =>
      dataset.id === datasetId
        ? { ...dataset, specimens: [...dataset.specimens, ...specimens] }
        : dataset
    ),
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.addSpecimensToDatasetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Dataset Creation Actions
  on(CollectionsActions.createDataset, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CollectionsActions.createDatasetSuccess, (state, { dataset }) => ({
    ...state,
    datasets: [...state.datasets, dataset],
    isLoading: false,
    error: null,
  })),

  on(CollectionsActions.createDatasetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Filter reducers
  on(CollectionsActions.setFilters, (state, { filters }) => {
    const filteredSpecimens = state.specimens.filter(specimen => {
      return (!filters.famille || specimen.famille?.toLowerCase().includes(filters.famille.toLowerCase())) &&
             (!filters.genre || specimen.genre?.toLowerCase().includes(filters.genre.toLowerCase())) &&
             (!filters.espece || specimen.epitheteSpecifique?.toLowerCase().includes(filters.espece.toLowerCase())) &&
             (!filters.paysRecolte || specimen.pays?.toLowerCase().includes(filters.paysRecolte.toLowerCase())) &&
             (!filters.searchText || 
              specimen.nomScientifique?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
              specimen.famille?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
              specimen.genre?.toLowerCase().includes(filters.searchText.toLowerCase()));
    });

    return {
      ...state,
      filters,
      filteredSpecimens,
    };
  }),

  on(CollectionsActions.clearFilters, (state) => ({
    ...state,
    filters: {},
    filteredSpecimens: state.specimens,
  })),

  // UI reducers
  on(CollectionsActions.setCurrentCollection, (state, { collection }) => ({
    ...state,
    currentCollection: collection,
  })),

  on(CollectionsActions.setCurrentDataset, (state, { dataset }) => ({
    ...state,
    currentDataset: dataset,
  })),

  on(CollectionsActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
