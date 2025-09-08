import { createReducer, on } from '@ngrx/store';
import { ProjectsState } from './projects.state';
import * as ProjectsActions from './projects.actions';

export const initialProjectsState: ProjectsState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null
};

export const projectsReducer = createReducer(
  initialProjectsState,

  // Load Projects
  on(ProjectsActions.loadProjects, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ProjectsActions.loadProjectsSuccess, (state, { projects }) => ({
    ...state,
    projects,
    isLoading: false,
    error: null
  })),

  on(ProjectsActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Single Project
  on(ProjectsActions.loadProject, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ProjectsActions.loadProjectSuccess, (state, { project }) => ({
    ...state,
    currentProject: project,
    isLoading: false,
    error: null,
    // Update in projects list if it exists
    projects: state.projects.map(p => p.id === project.id ? project : p)
  })),

  on(ProjectsActions.loadProjectFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Set Current Project
  on(ProjectsActions.setCurrentProject, (state, { project }) => ({
    ...state,
    currentProject: project
  })),

  on(ProjectsActions.clearCurrentProject, (state) => ({
    ...state,
    currentProject: null
  })),

  // Create Project
  on(ProjectsActions.createProject, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ProjectsActions.createProjectSuccess, (state, { project }) => ({
    ...state,
    projects: [...state.projects, project],
    isLoading: false,
    error: null
  })),

  on(ProjectsActions.createProjectFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Project
  on(ProjectsActions.updateProject, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ProjectsActions.updateProjectSuccess, (state, { project }) => ({
    ...state,
    projects: state.projects.map(p => p.id === project.id ? project : p),
    currentProject: state.currentProject?.id === project.id ? project : state.currentProject,
    isLoading: false,
    error: null
  })),

  on(ProjectsActions.updateProjectFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete Project
  on(ProjectsActions.deleteProject, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ProjectsActions.deleteProjectSuccess, (state, { projectId }) => ({
    ...state,
    projects: state.projects.filter(p => p.id !== projectId),
    currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
    isLoading: false,
    error: null
  })),

  on(ProjectsActions.deleteProjectFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Clear Error
  on(ProjectsActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
