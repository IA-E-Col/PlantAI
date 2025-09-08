import { createAction, props } from '@ngrx/store';
import { Project } from './projects.state';

// Load Projects
export const loadProjects = createAction(
  '[Projects] Load Projects',
  props<{ userId: number }>()
);

export const loadProjectsSuccess = createAction(
  '[Projects] Load Projects Success',
  props<{ projects: Project[] }>()
);

export const loadProjectsFailure = createAction(
  '[Projects] Load Projects Failure',
  props<{ error: string }>()
);

// Load Single Project
export const loadProject = createAction(
  '[Projects] Load Project',
  props<{ projectId: number }>()
);

export const loadProjectSuccess = createAction(
  '[Projects] Load Project Success',
  props<{ project: Project }>()
);

export const loadProjectFailure = createAction(
  '[Projects] Load Project Failure',
  props<{ error: string }>()
);

// Set Current Project
export const setCurrentProject = createAction(
  '[Projects] Set Current Project',
  props<{ project: Project }>()
);

export const clearCurrentProject = createAction(
  '[Projects] Clear Current Project'
);

// Create Project
export const createProject = createAction(
  '[Projects] Create Project',
  props<{ project: { nomProjet: string; description: string }; collectionId: number }>()
);

export const createProjectSuccess = createAction(
  '[Projects] Create Project Success',
  props<{ project: Project }>()
);

export const createProjectFailure = createAction(
  '[Projects] Create Project Failure',
  props<{ error: string }>()
);

// Update Project
export const updateProject = createAction(
  '[Projects] Update Project',
  props<{ projectId: number; updates: Partial<Project> }>()
);

export const updateProjectSuccess = createAction(
  '[Projects] Update Project Success',
  props<{ project: Project }>()
);

export const updateProjectFailure = createAction(
  '[Projects] Update Project Failure',
  props<{ error: string }>()
);

// Delete Project
export const deleteProject = createAction(
  '[Projects] Delete Project',
  props<{ projectId: number }>()
);

export const deleteProjectSuccess = createAction(
  '[Projects] Delete Project Success',
  props<{ projectId: number }>()
);

export const deleteProjectFailure = createAction(
  '[Projects] Delete Project Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearError = createAction('[Projects] Clear Error');
