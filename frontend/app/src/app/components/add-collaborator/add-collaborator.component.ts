import { Component, Inject, Optional, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
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
  selector: 'app-add-collaborator',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, AsyncPipe],
  templateUrl: './add-collaborator.component.html',
  styleUrl: './add-collaborator.component.css'
})
export class AddCollaboratorComponent implements OnInit, OnDestroy {
  is_active: boolean = true;
  collectionFormGroup!: FormGroup;
  selectedExpertiseId!: number | null;
  file!: File;
  
  // NgRx Observables
  project$: Observable<any> = new Observable();
  projectId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Reactive state management
  private collaboratorsSubject = new BehaviorSubject<any[]>([]);
  collaborators$: Observable<any[]> = this.collaboratorsSubject.asObservable();
  private expertisesSubject = new BehaviorSubject<any[]>([]);
  expertises$: Observable<any[]> = this.expertisesSubject.asObservable();
  
  collaborators: any;
  expertises: any;
  projectId!: number;
  selectedCollaboratorId!: number | null;
  
  private destroy$ = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<AddCollaboratorComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize NgRx observables
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    
    if (data) {
      this.is_active = data.is_active;
      this.projectId = data.id;
      
      // Update navigation state
      this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: this.projectId.toString() }));
      
      console.log('Add collaborator dialog opened for project:', this.projectId);
    }
  }

  ngOnInit(): void {
    if (this.projectId) {
      this.loadPossibleCollaborators();
      this.loadExpertises();
    }
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load data: ${error}`, 'error');
        }
      });
    
    console.log('Add collaborator component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPossibleCollaborators(): void {
    console.log('Loading possible collaborators for project:', this.projectId);
    
    // Generate mock possible collaborators
    const mockCollaborators = this.generateMockPossibleCollaborators();
    this.collaborators = mockCollaborators;
    this.collaboratorsSubject.next(mockCollaborators);
    
    console.log('Mock possible collaborators loaded:', mockCollaborators.length, 'items');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(ProjectsActions.loadPossibleCollaborators({ projectId: this.projectId }));
  }

  private loadExpertises(): void {
    console.log('Loading expertises');
    
    // Generate mock expertises
    const mockExpertises = this.generateMockExpertises();
    this.expertises = mockExpertises;
    this.expertisesSubject.next(mockExpertises);
    
    console.log('Mock expertises loaded:', mockExpertises.length, 'items');
    
    // TODO: Replace with proper NgRx action
    // this.store.dispatch(ProjectsActions.loadExpertises());
  }

  private generateMockPossibleCollaborators(): any[] {
    return [
      {
        id: 1,
        nom: 'Pierre Durand',
        prenom: 'Pierre',
        email: 'pierre.durand@example.com',
        expertise: 'Botanique',
        niveau: 'EXPERT'
      },
      {
        id: 2,
        nom: 'Claire Moreau',
        prenom: 'Claire',
        email: 'claire.moreau@example.com',
        expertise: 'Taxonomie',
        niveau: 'AVANCE'
      },
      {
        id: 3,
        nom: 'Thomas Bernard',
        prenom: 'Thomas',
        email: 'thomas.bernard@example.com',
        expertise: 'Écologie',
        niveau: 'INTERMEDIAIRE'
      }
    ];
  }

  private generateMockExpertises(): any[] {
    return [
      {
        id: 1,
        nom: 'Botanique',
        description: 'Étude des plantes et de leur classification'
      },
      {
        id: 2,
        nom: 'Taxonomie',
        description: 'Classification et nomenclature des organismes'
      },
      {
        id: 3,
        nom: 'Écologie',
        description: 'Étude des relations entre les organismes et leur environnement'
      },
      {
        id: 4,
        nom: 'Génétique',
        description: 'Étude de l\'hérédité et de la variation'
      }
    ];
  }


  addCollaborator(): void {
    if (!this.selectedCollaboratorId || !this.selectedExpertiseId) {
      Swal.fire('Error', 'Please select both a collaborator and an expertise', 'error');
      return;
    }
    
    const collaborator = this.collaborators.find((c: any) => c.id === this.selectedCollaboratorId);
    const expertise = this.expertises.find((e: any) => e.id === this.selectedExpertiseId);
    
    console.log('Adding collaborator:', {
      projectId: this.projectId,
      collaboratorId: this.selectedCollaboratorId,
      expertiseId: this.selectedExpertiseId,
      collaborator: collaborator?.prenom + ' ' + collaborator?.nom,
      expertise: expertise?.nom
    });
    
    // Show loading
    Swal.fire({
      title: 'Adding Collaborator',
      text: `Adding ${collaborator?.prenom} ${collaborator?.nom} to the project...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Simulate addition process
    setTimeout(() => {
      Swal.fire({
        title: 'Collaborator Added!',
        text: `${collaborator?.prenom} ${collaborator?.nom} has been successfully added to the project.`,
        icon: 'success',
        timer: 2000
      }).then(() => {
        this.dialogRef.close(true); // Return true to indicate success
      });
      
      console.log('Mock collaborator addition completed');
      
      // TODO: Replace with proper NgRx action
      // this.store.dispatch(ProjectsActions.addProjectCollaborator({ 
      //   projectId: this.projectId, 
      //   collaboratorId: this.selectedCollaboratorId,
      //   expertiseId: this.selectedExpertiseId 
      // }));
    }, 2000);
  }
  goBack(): void {
    this.selectedCollaboratorId = null;
    this.selectedExpertiseId = null;
    this.dialogRef.close(false); // Return false to indicate cancellation
  }

  // UI Helper methods
  trackByCollaboratorId(index: number, collaborator: any): number {
    return collaborator.id;
  }

  trackByExpertiseId(index: number, expertise: any): number {
    return expertise.id;
  }

  getCollaboratorDisplayName(collaborator: any): string {
    return `${collaborator.prenom} ${collaborator.nom} (${collaborator.expertise})`;
  }

  getExpertiseDisplayName(expertise: any): string {
    return `${expertise.nom} - ${expertise.description}`;
  }

  isFormValid(): boolean {
    return !!(this.selectedCollaboratorId && this.selectedExpertiseId);
  }

}
