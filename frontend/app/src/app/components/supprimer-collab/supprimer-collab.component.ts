import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

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

@Component({
  selector: 'app-supprimer-collab',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './supprimer-collab.component.html',
  styleUrl: './supprimer-collab.component.css'
})
export class SupprimerCollabComponent implements OnInit, OnDestroy {



  projetFormGroup!: FormGroup;
  projectId!: string;
  test!: string;
  
  // NgRx Observables
  project$: Observable<any>;
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    this.project$ = this.route.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        if (projectId) {
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId }));
          return this.store.select(selectProjectById(parseInt(projectId)));
        }
        return this.store.select(selectProjectById(0));
      })
    );
  }

  ngOnInit() {
    // Handle route parameters
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.projectId = params['id'];
        console.log('Remove collaborator component initialized for project:', this.projectId);
      });
    
    // Subscribe to project data
    this.project$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        if (project) {
          this.test = project.nomProjet; // Use project name from NgRx
          console.log('Project loaded via NgRx:', project);
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
    
    this.projetFormGroup = this.fb.group({
      collaborateur: this.fb.control(null, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  func_suppr_collab(): void {
    if (!this.projetFormGroup.valid) {
      Swal.fire('Error', 'Please select a collaborator to remove', 'error');
      return;
    }
    
    const collab = this.projetFormGroup.value;
    const collaboratorId = collab.collaborateur;
    
    console.log('Removing collaborator:', collaboratorId, 'from project:', this.projectId);
    
    Swal.fire({
      title: 'Remove Collaborator',
      text: 'Are you sure you want to remove this collaborator from the project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove collaborator',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Removing Collaborator',
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Simulate removal process
        setTimeout(() => {
          Swal.fire({
            title: 'Collaborator Removed!',
            text: 'The collaborator has been successfully removed from the project.',
            icon: 'success',
            timer: 2000
          }).then(() => {
            this.router.navigateByUrl(`/admin/projects/${this.projectId}/details`);
          });
          
          console.log('Mock collaborator removal completed');
          
          // TODO: Replace with proper NgRx action
          // this.store.dispatch(ProjectsActions.removeProjectCollaborator({ 
          //   projectId: this.projectId, 
          //   collaboratorId 
          // }));
        }, 1500);
      }
    });
  }

  modifer_infomation(): void {
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: this.projectId }));
    
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/edit`);
  }

  ajouterCollaborateur(): void {
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: this.projectId }));
    
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/collaborators`);
  }
}
