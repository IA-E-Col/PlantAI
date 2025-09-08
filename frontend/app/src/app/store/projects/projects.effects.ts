import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjetService } from '../../services/projet.service';
import * as ProjectsActions from './projects.actions';

@Injectable()
export class ProjectsEffects {
  
  constructor(
    private actions$: Actions,
    private projetService: ProjetService
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.loadProjects),
      switchMap(({ userId }) =>
        this.projetService.funcS_get_All().pipe(
          map((projects) => ProjectsActions.loadProjectsSuccess({ projects })),
          catchError((error) => of(ProjectsActions.loadProjectsFailure({ 
            error: error.message || 'Failed to load projects' 
          })))
        )
      )
    )
  );

  loadProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.loadProject),
      switchMap(({ projectId }) =>
        this.projetService.func_get_Id(projectId).pipe(
          map((project) => ProjectsActions.loadProjectSuccess({ project })),
          catchError((error) => of(ProjectsActions.loadProjectFailure({ 
            error: error.message || 'Failed to load project' 
          })))
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.createProject),
      switchMap(({ project, collectionId }) =>
        this.projetService.func_ajout_proj(project, { id: collectionId }).pipe(
          map((newProject) => ProjectsActions.createProjectSuccess({ project: newProject })),
          catchError((error) => of(ProjectsActions.createProjectFailure({ 
            error: error.message || 'Failed to create project' 
          })))
        )
      )
    )
  );

  updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.updateProject),
      switchMap(({ projectId, updates }) =>
        this.projetService.func_modif_proj(updates, updates, projectId).pipe(
          map((project) => ProjectsActions.updateProjectSuccess({ project })),
          catchError((error) => of(ProjectsActions.updateProjectFailure({ 
            error: error.message || 'Failed to update project' 
          })))
        )
      )
    )
  );

  deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.deleteProject),
      switchMap(({ projectId }) =>
        this.projetService.func_supp_prj(projectId).pipe(
          map(() => ProjectsActions.deleteProjectSuccess({ projectId })),
          catchError((error) => of(ProjectsActions.deleteProjectFailure({ 
            error: error.message || 'Failed to delete project' 
          })))
        )
      )
    )
  );
}
