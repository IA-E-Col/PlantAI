import { createAction, props } from '@ngrx/store';

// Smart loading actions that check if data is already loaded
export const loadModelsIfNeeded = createAction(
  '[Shared] Load Models If Needed'
);

export const loadCollectionsIfNeeded = createAction(
  '[Shared] Load Collections If Needed'
);

export const loadProjectsIfNeeded = createAction(
  '[Shared] Load Projects If Needed',
  props<{ userId: string }>()
);

export const loadUsersIfNeeded = createAction(
  '[Shared] Load Users If Needed'
);

// Cache invalidation actions
export const invalidateModelsCache = createAction(
  '[Shared] Invalidate Models Cache'
);

export const invalidateCollectionsCache = createAction(
  '[Shared] Invalidate Collections Cache'
);

export const invalidateProjectsCache = createAction(
  '[Shared] Invalidate Projects Cache'
);

export const invalidateUsersCache = createAction(
  '[Shared] Invalidate Users Cache'
);

// Preload actions for better UX
export const preloadEssentialData = createAction(
  '[Shared] Preload Essential Data',
  props<{ userId: string }>()
);
