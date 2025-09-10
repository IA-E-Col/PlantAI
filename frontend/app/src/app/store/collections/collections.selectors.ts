import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionsState } from './collections.state';

export const selectCollectionsState = createFeatureSelector<CollectionsState>('collections');

// Collection Selectors
export const selectAllCollections = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.collections
);

export const selectCurrentCollection = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.currentCollection
);

export const selectCollectionById = (collectionId: number) => createSelector(
  selectAllCollections,
  (collections) => collections.find(collection => collection.id === collectionId)
);

// Specimen Selectors
export const selectAllSpecimens = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.specimens
);

export const selectFilteredSpecimens = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.filteredSpecimens
);

export const selectCurrentSpecimen = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.currentSpecimen
);

export const selectSpecimenById = (specimenId: number) => createSelector(
  selectAllSpecimens,
  (specimens) => specimens.find(specimen => specimen.id === specimenId)
);

export const selectSpecimensByFamily = (famille: string) => createSelector(
  selectAllSpecimens,
  (specimens) => specimens.filter(specimen => specimen.famille === famille)
);

export const selectSpecimensByGenus = (genre: string) => createSelector(
  selectAllSpecimens,
  (specimens) => specimens.filter(specimen => specimen.genre === genre)
);

// Dataset Selectors
export const selectAllDatasets = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.datasets
);

export const selectCurrentDataset = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.currentDataset
);

export const selectDatasetById = (datasetId: number) => createSelector(
  selectAllDatasets,
  (datasets) => datasets.find(dataset => dataset.id === datasetId)
);

// UI State Selectors
export const selectCollectionsLoading = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.isLoading
);

export const selectCollectionsError = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.error
);

// Filter Selectors
export const selectCurrentFilters = createSelector(
  selectCollectionsState,
  (state: CollectionsState) => state.filters
);

export const selectFilteredSpecimensCount = createSelector(
  selectFilteredSpecimens,
  (specimens) => specimens.length
);

export const selectSpecimensCount = createSelector(
  selectAllSpecimens,
  (specimens) => specimens.length
);

// Complex Selectors
export const selectCollectionWithSpecimens = (collectionId: number) => createSelector(
  selectCollectionById(collectionId),
  selectAllSpecimens,
  (collection, specimens) => {
    if (!collection) return null;
    const collectionSpecimens = specimens.filter(specimen => specimen.collection?.id === collectionId);
    return {
      ...collection,
      specimens: collectionSpecimens,
    };
  }
);

export const selectUniqueSpecimenFamilies = createSelector(
  selectAllSpecimens,
  (specimens) => [...new Set(specimens.map(s => s.famille).filter(Boolean))].sort()
);

export const selectUniqueSpecimenGenera = createSelector(
  selectAllSpecimens,
  (specimens) => [...new Set(specimens.map(s => s.genre).filter(Boolean))].sort()
);

export const selectUniqueSpecimenCountries = createSelector(
  selectAllSpecimens,
  (specimens) => [...new Set(specimens.map(s => s.pays).filter(Boolean))].sort()
);

export const selectSpecimenStats = createSelector(
  selectFilteredSpecimens,
  (specimens) => ({
    total: specimens.length,
    withImages: specimens.filter(s => s.image || (s.medias && s.medias.length > 0)).length,
    familyCount: new Set(specimens.map(s => s.famille).filter(Boolean)).size,
    genusCount: new Set(specimens.map(s => s.genre).filter(Boolean)).size,
    countryCount: new Set(specimens.map(s => s.pays).filter(Boolean)).size,
  })
);

export const selectSpecimensByDataset = (datasetId: string) => createSelector(
  selectAllSpecimens,
  (specimens) => specimens.filter(specimen => specimen.collection?.id === parseInt(datasetId))
);
