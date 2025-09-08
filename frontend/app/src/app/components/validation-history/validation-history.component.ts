import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil, BehaviorSubject, combineLatest, map } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../store/app.state';
import { NavigationActions } from '../../store';
import { 
  selectUser,
  selectUserId 
} from '../../store/auth/auth.selectors';
import { 
  selectNavigationProjectId 
} from '../../store/navigation/navigation.selectors';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
interface Annotation {
  id: number;
  libelle: string;
  etat: string;
  valeurPredite: string;
  modelcat: string;
  modelName: string; 
}

@Component({
  selector: 'app-validation-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, AsyncPipe],
  templateUrl: './validation-history.component.html',
  styleUrls: ['./validation-history.component.css']
})
export class ValidationHistoryComponent implements OnInit, OnDestroy {
  
  // UI State
  filterText: string = '';
  filterState: string = '';
  filterDate: string = '';
  sortField: keyof Annotation | null = null;
  isAscending: boolean = true;
  faSearch = faSearch;
  
  // NgRx Observables
  user$: Observable<any>;
  userId$: Observable<number | null>;
  projectId$: Observable<string | null>;
  
  // Local reactive state management
  private annotationsSubject = new BehaviorSubject<Annotation[]>([]);
  annotations$: Observable<Annotation[]> = this.annotationsSubject.asObservable();
  
  filteredAnnotations$: Observable<Annotation[]>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.user$ = this.store.select(selectUser);
    this.userId$ = this.store.select(selectUserId);
    this.projectId$ = this.store.select(selectNavigationProjectId);
    
    // Create reactive filtered annotations
    this.filteredAnnotations$ = combineLatest([
      this.annotations$,
      // We'll add filter observables later for real-time filtering
    ]).pipe(
      map(([annotations]) => this.filterAndSortAnnotations(annotations))
    );
  }

  ngOnInit(): void {
    // Load annotation history through NgRx pattern
    this.loadAnnotationHistory();
    
    // Subscribe to user changes for logging
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          console.log('Validation history loaded for user:', user.email);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnnotationHistory(): void {
    // Get dataset ID from route and user ID from store
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const datasetId = params.get('id');
        if (datasetId) {
          // Dispatch navigation action to set current dataset
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId }));
          
          // Get user ID and load annotation history
          this.userId$
            .pipe(takeUntil(this.destroy$))
            .subscribe(userId => {
              if (userId) {
                console.log('Loading annotation history for dataset:', datasetId, 'user:', userId);
                
                // For now, using mock data until we implement annotations store
                this.loadMockAnnotationHistory(userId, datasetId);
                
                // TODO: Dispatch action to load real annotation history
                // this.store.dispatch(AnnotationsActions.loadValidationHistory({ 
                //   userId, 
                //   datasetId 
                // }));
              }
            });
        }
      });
  }

  private loadMockAnnotationHistory(userId: number, datasetId: string): void {
    // Mock annotation data for demonstration
    const mockAnnotations: Annotation[] = [
      {
        id: 1,
        libelle: 'Leaf Shape Classification',
        etat: 'Validated',
        valeurPredite: 'Oval',
        modelcat: 'CNN',
        modelName: 'LeafNet v1.2'
      },
      {
        id: 2,
        libelle: 'Flower Color Detection',
        etat: 'Pending',
        valeurPredite: 'Red',
        modelcat: 'ResNet',
        modelName: 'FlowerIdentifier'
      },
      {
        id: 3,
        libelle: 'Plant Height Estimation',
        etat: 'Rejected',
        valeurPredite: '150cm',
        modelcat: 'Random Forest',
        modelName: 'HeightPredictor'
      },
      {
        id: 4,
        libelle: 'Bark Texture Analysis',
        etat: 'Validated',
        valeurPredite: 'Smooth',
        modelcat: 'CNN',
        modelName: 'BarkClassifier v2.0'
      }
    ];
    
    this.annotationsSubject.next(mockAnnotations);
    console.log('Loaded mock annotation history:', mockAnnotations.length, 'items');
  }



  filterAnnotations(): void {
    // Trigger re-filtering by updating the observable
    this.filteredAnnotations$ = combineLatest([
      this.annotations$,
    ]).pipe(
      map(([annotations]) => this.filterAndSortAnnotations(annotations))
    );
  }

  sortBy(field: keyof Annotation): void {
    if (this.sortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortField = field;
      this.isAscending = true;
    }

    // Trigger re-sorting by updating the observable
    this.filteredAnnotations$ = combineLatest([
      this.annotations$,
    ]).pipe(
      map(([annotations]) => this.filterAndSortAnnotations(annotations))
    );
    
    console.log('Sorted by:', field, 'ascending:', this.isAscending);
  }

  private filterAndSortAnnotations(annotations: Annotation[]): Annotation[] {
    // Apply filters
    let filtered = annotations.filter(annotation => 
      annotation.libelle.toLowerCase().includes(this.filterText.toLowerCase()) &&
      annotation.etat.toLowerCase().includes(this.filterState.toLowerCase())
    );

    // Apply sorting
    if (this.sortField) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[this.sortField!];
        const bValue = b[this.sortField!];
        
        return this.isAscending
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
    }

    return filtered;
  }

  onFilterTextChange(): void {
    this.filterAnnotations();
  }

  onFilterStateChange(): void {
    this.filterAnnotations();
  }

  onFilterDateChange(): void {
    // TODO: Implement date filtering when needed
    this.filterAnnotations();
  }

  trackByAnnotationId(index: number, annotation: Annotation): number {
    return annotation.id;
  }

  getSortIcon(field: keyof Annotation): string {
    if (this.sortField === field) {
      return this.isAscending ? '⬆' : '⬇';
    }
    return '⬆⬇';
  }

  getAnnotationStateClass(etat: string): string {
    return etat.toLowerCase();
  }
}
