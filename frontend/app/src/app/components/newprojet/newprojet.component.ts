import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf, AsyncPipe } from "@angular/common";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { ProjectsActions, CollectionsActions } from '../../store';
import { 
  selectProjectsLoading, 
  selectProjectsError 
} from '../../store/projects/projects.selectors';
import { 
  selectAllCollections, 
  selectCollectionsLoading,
  selectCollectionsError
} from '../../store/collections/collections.selectors';
import { selectUserId } from '../../store/auth/auth.selectors';

interface Projet {
  nomProjet: string;
  description: string;
}

@Component({
  selector: 'app-newprojet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    RouterOutlet,
    CommonModule,
    AsyncPipe
  ],
  templateUrl: './newprojet.component.html',
  styleUrl: './newprojet.component.css'
})
export class NewprojetComponent implements OnInit, OnDestroy {

  projetFormGroup!: FormGroup;
  
  // NgRx Observables
  collections$: Observable<any[]>;
  isLoadingCollections$: Observable<boolean>;
  isLoadingProjects$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  projectsError$: Observable<string | null>;
  userId$: Observable<number | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<NewprojetComponent>,
    private route: ActivatedRoute, 
    private router: Router, 
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.collections$ = this.store.select(selectAllCollections);
    this.isLoadingCollections$ = this.store.select(selectCollectionsLoading);
    this.isLoadingProjects$ = this.store.select(selectProjectsLoading);
    this.collectionsError$ = this.store.select(selectCollectionsError);
    this.projectsError$ = this.store.select(selectProjectsError);
    this.userId$ = this.store.select(selectUserId);
  }
  ngOnInit() {
    // Load collections using NgRx
    this.store.dispatch(CollectionsActions.loadCollections());

    // Initialize reactive form
    this.projetFormGroup = this.fb.group({
      nomProjet: this.fb.control(null, [Validators.required]),
      description: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
      collection: this.fb.control(null, [Validators.required]),
    });

    // Subscribe to error states and show notifications
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collections: ${error}`, 'error');
        }
      });

    this.projectsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to create project: ${error}`, 'error');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ajout_prt() {
    if (this.projetFormGroup.valid) {
      const formValues = this.projetFormGroup.value;
      const collectionId = formValues.collection;
      
      const projectData = {
        nomProjet: formValues.nomProjet,
        description: formValues.description
      };

      console.log('Creating project with NgRx:', projectData, 'collectionId:', collectionId);
      
      // Dispatch create project action
      this.store.dispatch(ProjectsActions.createProject({ 
        project: projectData, 
        collectionId: collectionId 
      }));

      // Subscribe to project creation success
      this.store.select(selectProjectsLoading)
        .pipe(takeUntil(this.destroy$))
        .subscribe(isLoading => {
          if (!isLoading) {
            // Check if there's no error, which means success
            this.projectsError$
              .pipe(takeUntil(this.destroy$))
              .subscribe(error => {
                if (!error) {
                  Swal.fire('Success', 'Project added successfully', 'success').then(() => {
                    this.projetFormGroup.reset();
                    this.dialogRef.close();
                  });
                }
              });
          }
        });
    } else {
      console.log('Form is not valid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.projetFormGroup.controls).forEach(key => {
      const control = this.projetFormGroup.get(key);
      control?.markAsTouched();
    });
  }

  trackByCollectionId(index: number, collection: any): number {
    return collection.id;
  }

}
