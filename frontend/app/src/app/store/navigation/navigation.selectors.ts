import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NavigationState } from './navigation.state';

// Feature selector
export const selectNavigationState = createFeatureSelector<NavigationState>('navigation');

// Basic selectors
export const selectActiveMenu = createSelector(
  selectNavigationState,
  (state) => state.activeMenu
);

export const selectActiveSubmenu = createSelector(
  selectNavigationState,
  (state) => state.activeSubmenu
);

export const selectCurrentRoute = createSelector(
  selectNavigationState,
  (state) => state.currentRoute
);

export const selectSidebarOpen = createSelector(
  selectNavigationState,
  (state) => state.sidebarOpen
);

// Current Item ID selectors
export const selectNavigationProjectId = createSelector(
  selectNavigationState,
  (state) => state.currentProjectId
);

export const selectNavigationCollectionId = createSelector(
  selectNavigationState,
  (state) => state.currentCollectionId
);

export const selectNavigationDatasetId = createSelector(
  selectNavigationState,
  (state) => state.currentDatasetId
);

export const selectNavigationModelId = createSelector(
  selectNavigationState,
  (state) => state.currentModelId
);

export const selectNavigationClassId = createSelector(
  selectNavigationState,
  (state) => state.currentClassId
);

// Complex selectors
export const selectCurrentItemId = createSelector(
  selectNavigationState,
  (state) => {
    // Return the current item ID based on active menu
    switch (state.activeMenu.toLowerCase()) {
      case 'projects':
        return state.currentProjectId;
      case 'corpus':
        return state.currentCollectionId;
      case 'datasets':
        return state.currentDatasetId;
      case 'models':
        return state.currentModelId;
      case 'classes':
        return state.currentClassId;
      default:
        return null;
    }
  }
);

export const selectMenuState = createSelector(
  selectNavigationState,
  (state) => ({
    activeMenu: state.activeMenu,
    activeSubmenu: state.activeSubmenu,
    currentItemId: state.currentProjectId || state.currentCollectionId || state.currentDatasetId || state.currentModelId || state.currentClassId
  })
);

export const selectNavigationLoading = createSelector(
  selectNavigationState,
  (state) => state.isLoading
);

export const selectNavigationError = createSelector(
  selectNavigationState,
  (state) => state.error
);

// Helper selectors for menu generation
export const selectShouldShowSubmenu = createSelector(
  selectActiveMenu,
  selectCurrentItemId,
  (activeMenu, currentItemId): boolean => {
    return !!(activeMenu && currentItemId && ['Corpus', 'Projects', 'Datasets', 'Models'].includes(activeMenu));
  }
);

export const selectRouteSegmentAfterAdmin = createSelector(
  selectCurrentRoute,
  (route) => {
    const parts = route.split('/').filter(Boolean);
    const adminIndex = parts.indexOf('admin');
    return adminIndex !== -1 && adminIndex + 1 < parts.length ? parts[adminIndex + 1] : null;
  }
);
