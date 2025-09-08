import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { DatePipe, NgForOf, NgIf, NgStyle, AsyncPipe } from "@angular/common";

import { AppState } from '../../store/app.state';
import { ProjectsActions } from '../../store';
import { 
  selectCurrentProject,
  selectProjectsLoading,
  selectProjectsError 
} from '../../store/projects/projects.selectors';
import { Project } from '../../store/projects/projects.state';

@Component({
  selector: 'app-projet-inf',
  standalone: true,
  imports: [
    RouterOutlet,
    DatePipe,
    NgIf,
    NgForOf,
    NgStyle,
    AsyncPipe,
  ],
  templateUrl: './projet-inf.component.html',
  styleUrl: './projet-inf.component.css'
})
export class ProjetInfComponent implements OnInit, OnDestroy {
  // NgRx Observables - Single Source of Truth!
  currentProject$: Observable<Project | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // UI State
  etatDuProjet: string = 'enCours';
  cheminUser = "assets/user.png";
  cheminDtl = "assets/INFO1.png";
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.currentProject$ = this.store.select(selectCurrentProject);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
  }


  ngOnInit(): void {
    // React to route changes and load project via NgRx!
    this.route.parent?.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const projectId = +params['id'];
          // Dispatch action to load project
          this.store.dispatch(ProjectsActions.loadProject({ projectId }));
          return this.currentProject$;
        })
      )
      .subscribe({
        next: (project) => {
          if (project) {
            console.log('Project loaded via NgRx:', project);
          }
        },
        error: (err) => {
          console.error('Error loading project:', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * TrackBy function for performance optimization
   */
  trackByCollaboratorId(index: number, collaborator: any): number {
    return collaborator?.user?.id || index;
  }
}
