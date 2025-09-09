import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgForOf, AsyncPipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import Swal from "sweetalert2";
import { CreeModeleComponent } from "../cree-modele/cree-modele.component";
import { Observable, Subject, takeUntil, combineLatest, map } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faEdit, faPlay, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { ModelsActions, NavigationActions } from '../../store';
import { 
  selectAllModels, 
  selectModelsLoading, 
  selectModelsError 
} from '../../store/models/models.selectors';

@Component({
  selector: 'app-modele',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    RouterLink,
    RouterOutlet,
    FormsModule,
    FontAwesomeModule,
    AsyncPipe
  ],
  templateUrl: './modele.component.html',
  styleUrl: './modele.component.css'
})
export class ModeleComponent implements OnInit, OnDestroy {
  
  // UI State
  p: number = 1;
  currentSortField: string = '';
  isAscending: boolean = true;
  searchtext: any;
  selectedOption: string = "all";
  
  // Font Awesome icons
  faCircleInfo = faCircleInfo;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  
  // NgRx Observables
  models$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  sortedFilteredModels$: Observable<any[]>;
  
  // Optimized template properties
  paginatedModels: any[] = [];
  shouldShowData: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.models$ = this.store.select(selectAllModels);
    this.isLoading$ = this.store.select(selectModelsLoading);
    this.error$ = this.store.select(selectModelsError);
    
    // Create reactive sorted and filtered models
    this.sortedFilteredModels$ = combineLatest([
      this.models$,
    ]).pipe(
      map(([models]) => this.sortModels(models))
    );
  }

  ngOnInit(): void {
    // Load models through NgRx
    this.store.dispatch(ModelsActions.loadModels());
    
    // Subscribe to error state for user feedback
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });

    // Subscribe to sorted and filtered models for optimized template rendering
    this.sortedFilteredModels$
      .pipe(takeUntil(this.destroy$))
      .subscribe(models => {
        this.paginatedModels = this.paginateModels(models, this.p, 5);
      });

    // Subscribe to loading and error states for optimized template rendering
    combineLatest([this.isLoading$, this.error$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isLoading, error]) => {
        this.shouldShowData = !isLoading && !error;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    document.querySelectorAll(".read-more").forEach(button => {
      button.addEventListener("click", (e: Event) => {
        e.preventDefault(); // Empêche la redirection par défaut
        const card = (button as HTMLElement).closest(".card");
        if (card) {
          card.classList.add("is-flipped");
        }
      });
    });

    document.querySelectorAll(".go-back").forEach(button => {
      button.addEventListener("click", (e: Event) => {
        e.preventDefault(); // Empêche la redirection par défaut
        const card = (button as HTMLElement).closest(".card");
        if (card) {
          card.classList.remove("is-flipped");
        }
      });
    });
  }

  func_inf_m(id: any): void {
    // Dispatch navigation action to update NgRx state
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: id.toString() }));
    
    // Navigate to model details
    this.router.navigateByUrl(`/admin/models/${id}/model-library`);
  }

  sortBy(field: string): void {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    // Update the sorted models observable
    this.sortedFilteredModels$ = combineLatest([
      this.models$,
    ]).pipe(
      map(([models]) => this.sortModels(models))
    );
  }

  private sortModels(models: any[]): any[] {
    if (!models || !this.currentSortField) {
      return models || [];
    }

    return [...models].sort((a, b) => {
      let comparison = 0;
      const valueA = a[this.currentSortField];
      const valueB = b[this.currentSortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        comparison = valueA - valueB;
      }
      return this.isAscending ? comparison : -comparison;
    });
  }

  applyFilter(): void {
    // Trigger re-filtering (will be enhanced later)
    this.sortedFilteredModels$ = combineLatest([
      this.models$,
    ]).pipe(
      map(([models]) => this.sortModels(models))
    );
  }

  func_ajout_Model(): void {
    const dialogRef = this.dialogRef.open(CreeModeleComponent, {
      width: '700px',
      height: '480px',
      data: { is_active: false }
    });
    
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // Refresh models list after dialog closes
          this.store.dispatch(ModelsActions.loadModels());
        }
      });
  }
  func_update_m(model: any): void {
    // Set current model in navigation state
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: model.id.toString() }));
    
    // Navigate to update model page
    this.router.navigateByUrl("/admin/UpdateMode");
  }

  func_delete_m(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this model. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#86A786',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete model',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting model with NgRx:', id);
        
        // Dispatch delete action through NgRx
        this.store.dispatch(ModelsActions.deleteModel({ modelId: id }));
        
        // Listen for successful deletion
        this.error$
          .pipe(takeUntil(this.destroy$))
          .subscribe(error => {
            if (!error) {
              // Success case - when no error and loading is false
              this.isLoading$
                .pipe(takeUntil(this.destroy$))
                .subscribe(isLoading => {
                  if (!isLoading) {
                    Swal.fire('Success', 'Model deleted successfully', 'success');
                  }
                });
            }
          });
      }
    });
  }

  trackByModelId(index: number, model: any): number {
    return model.id;
  }

  // Optimized pagination method
  private paginateModels(models: any[], currentPage: number, itemsPerPage: number): any[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return models.slice(startIndex, endIndex);
  }
}
