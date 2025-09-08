import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf, NgForOf, AsyncPipe } from "@angular/common";
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from "../../filter.pipe";
import { Observable, Subject, takeUntil, filter, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { ProjectsActions, NavigationActions } from '../../store';
import { 
  selectProjectById,
  selectProjectsLoading,
  selectProjectsError
} from '../../store/projects/projects.selectors';
import {
  selectNavigationProjectId
} from '../../store/navigation/navigation.selectors';
import {
  selectUserId
} from '../../store/auth/auth.selectors';



@Component({
  selector: 'app-gererprojet',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    FilterPipe,
    NgxPaginationModule,
    AsyncPipe
  ],
  templateUrl: './gererprojet.component.html',
  styleUrl: './gererprojet.component.css'
})
export class GererprojetComponent implements OnInit, OnDestroy {

  // UI State
  p: number = 1;
  cheminPlus = "assets/plus.png";
  cheminDel = "assets/delet.png";
  cheminUser = "assets/user.png";
  projetFormGroup!: FormGroup;
  afficherLeFormulaire: boolean = true;

  // NgRx Observables
  projectId$: Observable<string | null>;
  project$: Observable<any>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  afficherFormulaire(afficher: boolean): void {
    this.afficherLeFormulaire = afficher;
  }
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    
    // Create reactive project observable based on route parameter
    this.project$ = this.route.parent!.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        // Dispatch navigation action to set current project
        this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId }));
        // Return the project from store
        return this.store.select(selectProjectById(parseInt(projectId)));
      })
    );
  }

  ngOnInit(): void {
    // Initialize the form
    this.projetFormGroup = this.fb.group({
      nomProjet: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      etat: ['']
    });

    // Load projects to ensure we have the latest data
    this.store.select(selectUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        if (userId) {
          this.store.dispatch(ProjectsActions.loadProjects({ userId }));
        }
      });

    // Subscribe to project data and populate form
    this.project$
      .pipe(
        filter(project => !!project),
        takeUntil(this.destroy$)
      )
      .subscribe(project => {
        if (project) {
          console.log('Loaded project for management:', project);
          
          // Update form with project data
          this.projetFormGroup.patchValue({
            nomProjet: project.nomProjet || '',
            description: project.description || '',
            etat: project.etat || ''
          });
        }
      });

    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load project: ${error}`, 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  modifier_prt(): void {
    if (this.projetFormGroup.valid) {
      const formValues = this.projetFormGroup.value;

      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to modify this project. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, modify project',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Get current project ID from route or store
          this.projectId$
            .pipe(takeUntil(this.destroy$))
            .subscribe(projectId => {
              if (projectId) {
                const updateData = {
                  nomProjet: formValues.nomProjet,
                  description: formValues.description,
                  etat: formValues.etat
                };

                console.log('Updating project with NgRx:', updateData);

                // Dispatch update action through NgRx
                this.store.dispatch(ProjectsActions.updateProject({ 
                  projectId: parseInt(projectId), 
                  updates: updateData 
                }));

                // Listen for successful update
                this.error$
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(error => {
                    if (!error) {
                      this.isLoading$
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(isLoading => {
                          if (!isLoading) {
                            Swal.fire('Success', 'Project modified successfully', 'success').then(() => {
                              this.router.navigateByUrl(`/admin/projects/${projectId}/details`);
                            });
                          }
                        });
                    }
                  });
              }
            });
        }
      });
    } else {
      Swal.fire('Error', 'Please fill all required fields correctly', 'error');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projetFormGroup.controls).forEach(key => {
      this.projetFormGroup.get(key)?.markAsTouched();
    });
  }


  ajouterCollaborateur(): void {
    this.projectId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectId => {
        if (projectId) {
          this.router.navigateByUrl(`/admin/projects/${projectId}/collaborators`);
        }
      });
  }

  supprimerCollaborateur(): void {
    this.projectId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectId => {
        if (projectId) {
          this.router.navigateByUrl(`/admin/projects/${projectId}/supprcollab/${projectId}`);
        }
      });
  }

  func_suppr_collab(username: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to remove this collaborator. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove collaborator',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectId$
          .pipe(takeUntil(this.destroy$))
          .subscribe(projectId => {
            if (projectId) {
              console.log('Removing collaborator with NgRx:', username, 'from project:', projectId);
              
              // For now, we'll need to implement collaborator management in the projects store
              // This could be a separate action or part of project update
              
              // Temporary navigation back to details
              Swal.fire('Info', 'Collaborator management will be implemented with NgRx', 'info').then(() => {
                this.router.navigateByUrl(`/admin/projects/${projectId}/details`);
              });
            }
          });
      }
    });
  }

  trackByCollaboratorId(index: number, collaborator: any): any {
    return collaborator.id || collaborator.username || index;
  }

}

