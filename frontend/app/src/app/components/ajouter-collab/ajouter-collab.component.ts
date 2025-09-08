import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';
import { Observable, Subject, takeUntil, BehaviorSubject, switchMap } from 'rxjs';
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

@Component({
  selector: 'app-ajouter-collab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxPaginationModule,
    AsyncPipe
  ],
  templateUrl: './ajouter-collab.component.html',
  styleUrls: ['./ajouter-collab.component.css']
})
export class AjouterCollabComponent implements OnInit, OnDestroy {
  // UI State
  faTrash = faTrash;
  faEdit = faEdit;
  p: number = 1;
  searchtext: any;
  faCircleInfo = faCircleInfo;
  projetFormGroup!: FormGroup;
  projectId!: string;
  errorMessage!: string;
  
  // NgRx Observables
  project$: Observable<any>;
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Reactive state management
  private collaboratorsSubject = new BehaviorSubject<any[]>([]);
  collaborators$: Observable<any[]> = this.collaboratorsSubject.asObservable();
  
  users: any[] = []; // Liste des utilisateurs
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    this.project$ = this.route.parent?.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        if (projectId) {
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId }));
          return this.store.select(selectProjectById(parseInt(projectId)));
        }
        return this.store.select(selectProjectById(0));
      })
    ) || this.store.select(selectProjectById(0));
  }
  ngOnInit() {
    // Handle route parameters
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.projectId = params['id'];
        this.loadCollaborators();
      });
    
    // Subscribe to project data
    this.project$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        if (project) {
          console.log('Project loaded via NgRx:', project);
        }
      });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collaborators: ${error}`, 'error');
        }
      });
    
    this.projetFormGroup = this.fb.group({
      collaborateur: [null, Validators.required],
      role: ['null', Validators.required],
    });
    
    console.log('Add collaborators component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCollaborators(): void {
    if (this.projectId) {
      console.log('Loading collaborators for project:', this.projectId);
      
      // Generate mock collaborators for demonstration
      const mockCollaborators = this.generateMockCollaborators();
      this.users = mockCollaborators;
      this.collaboratorsSubject.next(mockCollaborators);
      
      console.log('Mock collaborators loaded:', mockCollaborators.length, 'items');
      
      // TODO: Replace with proper NgRx collaborators loading
      // this.store.dispatch(ProjectsActions.loadProjectCollaborators({ projectId: this.projectId }));
    }
  }

  private generateMockCollaborators(): any[] {
    return [
      {
        id: 1,
        nom: 'Marie Dubois',
        prenom: 'Marie',
        email: 'marie.dubois@example.com',
        role: 'EXPERT',
        expertise: 'Botanique',
        dateAjout: '2023-01-15',
        statut: 'active'
      },
      {
        id: 2,
        nom: 'Jean Martin',
        prenom: 'Jean',
        email: 'jean.martin@example.com',
        role: 'AVANCE',
        expertise: 'Taxonomie',
        dateAjout: '2023-01-20',
        statut: 'active'
      },
      {
        id: 3,
        nom: 'Sophie Laurent',
        prenom: 'Sophie',
        email: 'sophie.laurent@example.com',
        role: 'INTERMEDIAIRE',
        expertise: 'Écologie',
        dateAjout: '2023-02-01',
        statut: 'active'
      }
    ];
  }


  modifer_infomation(): void {
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: this.projectId }));
    
    this.router.navigateByUrl(`/admin/projects/${this.projectId}/edit`);
  }

  delete_collaborator(collaboratorId: number): void {
    const collaborator = this.users.find(u => u.id === collaboratorId);
    
    Swal.fire({
      title: 'Remove Collaborator',
      text: `Are you sure you want to remove ${collaborator?.prenom} ${collaborator?.nom} from this project?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove collaborator',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Removing collaborator:', collaboratorId, 'from project:', this.projectId);
        
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
          // Remove from local state
          this.users = this.users.filter(user => user.id !== collaboratorId);
          this.collaboratorsSubject.next([...this.users]);
          
          Swal.fire({
            title: 'Collaborator Removed!',
            text: `${collaborator?.prenom} ${collaborator?.nom} has been removed from the project.`,
            icon: 'success',
            timer: 2000
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
  add_collaborator(): void {
    console.log('Opening add collaborator dialog for project:', this.projectId);
    
    const dialogRef = this.dialogRef.open(AddCollaboratorComponent, {
      width: '700px',
      height: '380px',
      data: { is_active: false, id: this.projectId }
    });
    
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          console.log('Add collaborator dialog closed with result:', result);
          
          // Refresh collaborators list
          this.loadCollaborators();
          
          // TODO: Replace with proper NgRx action
          // this.store.dispatch(ProjectsActions.loadProjectCollaborators({ projectId: this.projectId }));
        }
      });
  }

  // UI Helper methods
  trackByCollaboratorId(index: number, collaborator: any): number {
    return collaborator.id;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'EXPERT': return 'badge-danger';
      case 'AVANCE': return 'badge-warning';
      case 'INTERMEDIAIRE': return 'badge-info';
      case 'DEBUTANT': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'badge-success' : 'badge-secondary';
  }
}
