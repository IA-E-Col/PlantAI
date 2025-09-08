import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, combineLatest, map } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewprojetComponent } from "../newprojet/newprojet.component";
import { MatDialog } from "@angular/material/dialog";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { AppState } from '../../store/app.state';
import { ProjectsActions } from '../../store';
import { 
  selectAllProjects, 
  selectProjectsLoading, 
  selectProjectsError,
  selectCurrentProject 
} from '../../store/projects/projects.selectors';
import { selectUserId } from '../../store/auth/auth.selectors';
import { Project } from '../../store/projects/projects.state';


@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    FontAwesomeModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css'
})
export class ProjetsComponent implements OnInit, OnDestroy {
  // UI State
  filterMenuActive: boolean = false;
  sortMenuActive: boolean = false;
  selectedOption: string = "all";
  faTrash = faTrash;
  faEdit = faEdit;
  
  // Pagination & Search
  p: number = 1;
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext: string = '';

  // NgRx Observables - Single Source of Truth!
  projects$: Observable<Project[]>;
  filteredProjects$: Observable<Project[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  userId$: Observable<number | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialog,
    private store: Store<AppState>,
    private router: Router
  ) {
    // Initialize observables from NgRx store
    this.projects$ = this.store.select(selectAllProjects);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    this.userId$ = this.store.select(selectUserId);

    // Create filtered projects observable
    this.filteredProjects$ = this.createFilteredProjectsObservable();
  }
  ngOnInit(): void {
    // Load projects using NgRx - much cleaner!
    this.userId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        if (userId) {
          this.store.dispatch(ProjectsActions.loadProjects({ userId }));
        }
      });

    // Listen for errors and show them
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', error, 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create reactive filtered projects observable
   * This replaces all the manual filtering chaos!
   */
  private createFilteredProjectsObservable(): Observable<Project[]> {
    return combineLatest([
      this.projects$,
      this.userId$
    ]).pipe(
      map(([projects, userId]) => {
        if (!projects || !userId) return [];

        let filtered = projects;

        // Apply filter by ownership type
        switch (this.selectedOption) {
          case 'my':
            filtered = projects.filter(p => p.createur?.id === userId);
            break;
          case 'collaborator':
            filtered = projects.filter(p => 
              p.collaborateurs?.some((collab: any) => collab.user?.id === userId) &&
              p.createur?.id !== userId
            );
            break;
          case 'all':
          default:
            // Show all projects where user is creator or collaborator
            filtered = projects.filter(p => 
              p.createur?.id === userId || 
              p.collaborateurs?.some((collab: any) => collab.user?.id === userId)
            );
            break;
        }

        // Apply search filter
        if (this.searchtext) {
          filtered = filtered.filter(p => 
            p.nomProjet?.toLowerCase().includes(this.searchtext.toLowerCase())
          );
        }

        // Apply sorting
        if (this.currentSortField) {
          filtered = this.sortProjects(filtered, this.currentSortField, this.isAscending);
        }

        return filtered;
      })
    );
  }



  /**
   * Open create project dialog - now with NgRx refresh!
   */
  func_ajout_Prj(): void {
    const dialogRef = this.dialogRef.open(NewprojetComponent, {
      width: '700px',
      height: '500px',
      data: { is_active: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh projects using NgRx - no manual API calls!
        this.userId$.pipe(
          takeUntil(this.destroy$)
        ).subscribe(userId => {
          if (userId) {
            this.store.dispatch(ProjectsActions.loadProjects({ userId }));
          }
        });
      }
    });
  }
  /**
   * Open project - using NgRx to load and set current project!
   */
  ouvrirProjet(id: number): void {
    // Dispatch action to load and set current project
    this.store.dispatch(ProjectsActions.loadProject({ projectId: id }));
    
    // Navigate to project page
    this.router.navigateByUrl(`/admin/projects/${id}`);
  }

  /**
   * Delete project - using NgRx with elegant error handling!
   */
  supprimerProjet(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this project. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete project',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch delete action - NgRx handles success/error!
        this.store.dispatch(ProjectsActions.deleteProject({ projectId: id }));
        
        // Listen for success (project removed from store automatically)
        // No need for manual ngOnInit() - reactive updates!
        Swal.fire('Success', 'Project deleted successfully', 'success');
      }
    });
  }

  /**
   * Pure sorting function - no side effects!
   */
  private sortProjects(projects: Project[], field: string, ascending: boolean): Project[] {
    return [...projects].sort((a, b) => {
      let aValue: any = field === 'creator' ? `${a.createur?.prenom} ${a.createur?.nom}` : (a as any)[field];
      let bValue: any = field === 'creator' ? `${b.createur?.prenom} ${b.createur?.nom}` : (b as any)[field];
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = aValue - bValue;
      }
      
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Reactive sorting - triggers filteredProjects$ update!
   */
  sortBy(field: string): void {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }
    
    // Trigger reactive update
    this.filteredProjects$ = this.createFilteredProjectsObservable();
  }

  toggleFilterMenu(): void {
    this.filterMenuActive = !this.filterMenuActive;
  }

  toggleSortMenu(): void {
    this.sortMenuActive = !this.sortMenuActive;
  }

  /**
   * Reactive filter update - no manual API calls needed!
   */
  applyFilter(): void {
    // Simply trigger the reactive observable update
    this.filteredProjects$ = this.createFilteredProjectsObservable();
  }

  /**
   * Reset all filters reactively
   */
  resetFilter(): void {
    this.selectedOption = 'all';
    this.searchtext = '';
    this.currentSortField = '';
    this.isAscending = true;
    
    // Trigger reactive update
    this.filteredProjects$ = this.createFilteredProjectsObservable();
  }

  /**
   * Handle search input changes reactively
   */
  onSearchChange(): void {
    this.filteredProjects$ = this.createFilteredProjectsObservable();
  }

  /**
   * Handle filter option changes reactively  
   */
  onFilterChange(): void {
    this.filteredProjects$ = this.createFilteredProjectsObservable();
  }

  /**
   * TrackBy function for performance optimization
   */
  trackByProjectId(index: number, project: Project): number {
    return project?.id || index;
  }

}
