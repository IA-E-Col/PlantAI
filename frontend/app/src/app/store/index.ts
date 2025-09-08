import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './auth/auth.reducer';
import { projectsReducer } from './projects/projects.reducer';
import { collectionsReducer } from './collections/collections.reducer';
import { modelsReducer } from './models/models.reducer';
import { navigationReducer } from './navigation/navigation.reducer';
import { annotationsReducer } from './annotations/annotations.reducer';
import { usersReducer } from './users/users.reducer';
import { errorReducer } from './error/error.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  projects: projectsReducer,
  collections: collectionsReducer,
  models: modelsReducer,
  navigation: navigationReducer,
  annotations: annotationsReducer,
  users: usersReducer,
  error: errorReducer,
};

// Export all selectors
export * from './auth/auth.selectors';
export * from './projects/projects.selectors';
export * from './collections/collections.selectors';
export * from './models/models.selectors';
export * from './navigation/navigation.selectors';
export * from './annotations/annotations.selectors';
export * from './users/users.selectors';
export * from './error/error.selectors';

// Export all actions
export * as AuthActions from './auth/auth.actions';
export * as ProjectsActions from './projects/projects.actions';
export * as CollectionsActions from './collections/collections.actions';
export * as ModelsActions from './models/models.actions';
export * as NavigationActions from './navigation/navigation.actions';
export * as AnnotationsActions from './annotations/annotations.actions';
export * as UsersActions from './users/users.actions';
export * as ErrorActions from './error/error.actions';
