import { createReducer, on } from '@ngrx/store';
import { NavigationState, initialNavigationState } from './navigation.state';
import * as NavigationActions from './navigation.actions';

export const navigationReducer = createReducer(
  initialNavigationState,

  // Menu Actions
  on(NavigationActions.setActiveMenu, (state, { menu }) => ({
    ...state,
    activeMenu: menu,
    activeSubmenu: '' // Clear submenu when changing main menu
  })),

  on(NavigationActions.setActiveSubmenu, (state, { submenu }) => ({
    ...state,
    activeSubmenu: submenu
  })),

  on(NavigationActions.setCurrentRoute, (state, { route }) => ({
    ...state,
    currentRoute: route
  })),

  // Current Item ID Actions
  on(NavigationActions.setCurrentProjectId, (state, { projectId }) => ({
    ...state,
    currentProjectId: projectId
  })),

  on(NavigationActions.setCurrentCollectionId, (state, { collectionId }) => ({
    ...state,
    currentCollectionId: collectionId
  })),

  on(NavigationActions.setCurrentDatasetId, (state, { datasetId }) => ({
    ...state,
    currentDatasetId: datasetId
  })),

  on(NavigationActions.setCurrentModelId, (state, { modelId }) => ({
    ...state,
    currentModelId: modelId
  })),

  on(NavigationActions.setCurrentClassId, (state, { classId }) => ({
    ...state,
    currentClassId: classId
  })),

  // Sidebar Actions
  on(NavigationActions.toggleSidebar, (state) => ({
    ...state,
    sidebarOpen: !state.sidebarOpen
  })),

  on(NavigationActions.setSidebarOpen, (state, { isOpen }) => ({
    ...state,
    sidebarOpen: isOpen
  })),

  // Route Actions
  on(NavigationActions.updateRouteParams, (state, action) => ({
    ...state,
    currentRoute: action.route,
    currentProjectId: action.projectId !== undefined ? action.projectId : state.currentProjectId,
    currentCollectionId: action.collectionId !== undefined ? action.collectionId : state.currentCollectionId,
    currentDatasetId: action.datasetId !== undefined ? action.datasetId : state.currentDatasetId,
    currentModelId: action.modelId !== undefined ? action.modelId : state.currentModelId,
    currentClassId: action.classId !== undefined ? action.classId : state.currentClassId,
  })),

  // Auto-detect menu from route
  on(NavigationActions.detectMenuFromRoute, (state, { route }) => {
    const routeParts = route.split('/').filter(Boolean);
    const adminIndex = routeParts.indexOf('admin');
    
    if (adminIndex !== -1 && adminIndex + 1 < routeParts.length) {
      const segment = routeParts[adminIndex + 1];
      let activeMenu = state.activeMenu;
      
      switch (segment) {
        case 'corpus':
          activeMenu = 'Corpus';
          break;
        case 'projects':
          activeMenu = 'Projects';
          break;
        case 'datasets':
          activeMenu = 'Datasets';
          break;
        case 'models':
          activeMenu = 'Models';
          break;
        case 'classes':
          activeMenu = 'Classes';
          break;
        default:
          activeMenu = state.activeMenu;
      }
      
      return {
        ...state,
        currentRoute: route,
        activeMenu,
        activeSubmenu: '' // Clear submenu when route changes
      };
    }
    
    return {
      ...state,
      currentRoute: route
    };
  }),

  on(NavigationActions.clearNavigation, () => initialNavigationState)
);
