import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './projects.state';

export const selectProjectsState = createFeatureSelector<ProjectsState>('projects');

export const selectAllProjects = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.projects
);

export const selectCurrentProject = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.currentProject
);

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.isLoading
);

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.error
);

export const selectProjectById = (projectId: number) => createSelector(
  selectAllProjects,
  (projects) => projects.find(project => project.id === projectId)
);

export const selectCurrentProjectId = createSelector(
  selectCurrentProject,
  (project) => project?.id || null
);

export const selectCurrentProjectCollection = createSelector(
  selectCurrentProject,
  (project) => project?.collection || null
);

export const selectProjectsCount = createSelector(
  selectAllProjects,
  (projects) => projects.length
);

export const selectUserProjects = (userId: number) => createSelector(
  selectAllProjects,
  (projects) => projects.filter(project => 
    project.createur?.id === userId || 
    project.collaborateurs.some(collab => collab.user?.id === userId)
  )
);
