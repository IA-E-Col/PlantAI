import { createAction, props } from '@ngrx/store';

// Navigation Actions
export const setActiveMenu = createAction(
  '[Navigation] Set Active Menu',
  props<{ menu: string }>()
);

export const setActiveSubmenu = createAction(
  '[Navigation] Set Active Submenu',
  props<{ submenu: string }>()
);

export const setCurrentRoute = createAction(
  '[Navigation] Set Current Route',
  props<{ route: string }>()
);

// Current Item ID Actions
export const setCurrentProjectId = createAction(
  '[Navigation] Set Current Project ID',
  props<{ projectId: string | null }>()
);

export const setCurrentCollectionId = createAction(
  '[Navigation] Set Current Collection ID',
  props<{ collectionId: string | null }>()
);

export const setCurrentDatasetId = createAction(
  '[Navigation] Set Current Dataset ID',
  props<{ datasetId: string | null }>()
);

export const setCurrentModelId = createAction(
  '[Navigation] Set Current Model ID',
  props<{ modelId: string | null }>()
);

export const setCurrentClassId = createAction(
  '[Navigation] Set Current Class ID',
  props<{ classId: string | null }>()
);

// Sidebar Actions
export const toggleSidebar = createAction('[Navigation] Toggle Sidebar');

export const setSidebarOpen = createAction(
  '[Navigation] Set Sidebar Open',
  props<{ isOpen: boolean }>()
);

// Route Navigation Actions
export const navigateToRoute = createAction(
  '[Navigation] Navigate To Route',
  props<{ route: string }>()
);

export const updateRouteParams = createAction(
  '[Navigation] Update Route Params',
  props<{ 
    route: string;
    projectId?: string | null;
    collectionId?: string | null;
    datasetId?: string | null;
    modelId?: string | null;
    classId?: string | null;
  }>()
);

// Auto-detect menu from route
export const detectMenuFromRoute = createAction(
  '[Navigation] Detect Menu From Route',
  props<{ route: string }>()
);

export const clearNavigation = createAction('[Navigation] Clear Navigation');
