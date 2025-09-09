import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgForOf, AsyncPipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import Swal from "sweetalert2";
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NewclasseComponent } from '../newclasse/newclasse.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CreeCollectionComponent } from '../cree-collection/cree-collection.component';
import { CreeModeleComponent } from '../cree-modele/cree-modele.component';
import { faEdit, faEye, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { NavigationActions, CollectionsActions, ModelsActions } from '../../store';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-classe',
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
    MatDialogModule,
    FontAwesomeModule,
    AsyncPipe
  ],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit, OnDestroy {
  
  // UI State
  p: number = 1;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  searchtext: any;
  searchtext1: any;
  searchtext2: any;
  searchtext3: any;
  isAscending: boolean = true;
  currentSortField: string = '';
  currentStep: number = 2;
  
  // Font Awesome icons
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faSearch = faSearch;
  
  // NgRx Observables
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  
  collections$: Observable<any[]>;
  collectionsLoading$: Observable<boolean>;
  collectionsError$: Observable<string | null>;
  
  // Mock data for classes (will be enhanced later)
  Classes: Array<{ name: string, identifier: string }> = [
    { name: 'Leaf Shape', identifier: 'leaf_shape' },
    { name: 'Flower Color', identifier: 'flower_color' },
    { name: 'Plant Height', identifier: 'plant_height' },
    { name: 'Bark Texture', identifier: 'bark_texture' },
    { name: 'Root Type', identifier: 'root_type' }
  ];
  
  // Mock users data
  users: any[] = [
    { name: 'User1', prenom: 'Prenom1', email: 'user1@example.com', id: 'ID1' },
    { name: 'User2', prenom: 'Prenom2', email: 'user2@example.com', id: 'ID2' },
    { name: 'User3', prenom: 'Prenom3', email: 'user3@example.com', id: 'ID3' },
    { name: 'User4', prenom: 'Prenom4', email: 'user4@example.com', id: 'ID4' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialog,
    private router: Router,
    private store: Store<AppState>,
    private sharedDataService: SharedDataService
  ) {
    // Initialize observables using shared service
    this.models$ = this.sharedDataService.getModels();
    this.modelsLoading$ = this.sharedDataService.getModelsLoading();
    this.modelsError$ = this.sharedDataService.getModelsError();
    
    this.collections$ = this.sharedDataService.getCollections();
    this.collectionsLoading$ = this.sharedDataService.getCollectionsLoading();
    this.collectionsError$ = this.sharedDataService.getCollectionsError();
  }

  ngOnInit(): void {
    // Load data using smart loading (only if not already loaded)
    this.sharedDataService.loadCollectionsIfNeeded();
    this.sharedDataService.loadModelsIfNeeded();
    
    // Subscribe to errors for user feedback
    this.collectionsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collections: ${error}`, 'error');
        }
      });
      
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });
    
    console.log('Classes component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  func_ajout_Classe(): void {
    const dialogRefa = this.dialogRef.open(NewclasseComponent);

    dialogRefa.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          console.log('Class created successfully');
          // Refresh the classes list - for now using mock data
          // TODO: Implement classes store refresh
        }
      });
  }

  func_update_c(classe: any): void {
    console.log('Update class:', classe);
    // TODO: Implement class update functionality
    Swal.fire('Info', 'Class update functionality will be implemented soon', 'info');
  }

  func_delete_c(classe: any): void {
    console.log('Delete class:', classe);
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the class "${classe.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement class deletion through NgRx
        Swal.fire('Deleted!', 'Class has been deleted.', 'success');
      }
    });
  }

  func_ajout_Col(): void {
    const dialogRefa = this.dialogRef.open(CreeCollectionComponent, {
      width: '900px',
      height: '550px',
      data: { is_active: false }
    });
    
    dialogRefa.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // Refresh collections through NgRx
          this.store.dispatch(CollectionsActions.loadCollections());
        }
      });
  }

  ouvrirCol(id: any): void {
    this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: id.toString() }));
    this.router.navigateByUrl(`/admin/corpus/${id}`);
  }

  supprimerCol(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this collection?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(CollectionsActions.deleteCollection({ collectionId: id }));
      }
    });
  }

  func_inf_m(id: any): void {
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: id.toString() }));
    this.router.navigateByUrl(`/admin/models/${id}/model-library`);
  }

  func_update_m(model: any): void {
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: model.id.toString() }));
    this.router.navigateByUrl("/admin/UpdateMode");
  }

  func_delete_m(model: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the model "${model.nom}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(ModelsActions.deleteModel({ modelId: model.id }));
      }
    });
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
          // Refresh models through NgRx
          this.store.dispatch(ModelsActions.loadModels());
        }
      });
  }

  func_ajout_User(): void {
    console.log('Add user functionality');
    // TODO: Implement user addition functionality
    Swal.fire('Info', 'User management functionality will be implemented with the users store', 'info');
  }

  func_inf_u(id: any): void {
    console.log('View user info:', id);
    // TODO: Navigate to user details
  }

  func_update_u(user: any): void {
    console.log('Update user:', user);
    // TODO: Implement user update functionality
  }

  func_delete_u(user: any): void {
    console.log('Delete user:', user);
    // TODO: Implement user deletion functionality
  }

  sortBy(field: string): void {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.Classes.sort((a, b) => {
      let aValue = this.getFieldValue(a, field);
      let bValue = this.getFieldValue(b, field);

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue - bValue;
      }
      return this.isAscending ? comparison : -comparison;
    });
    
    console.log('Sorted classes by:', field, 'ascending:', this.isAscending);
  }

  getFieldValue(object: any, field: string): any {
    return field.split('.').reduce((o, i) => o[i], object);
  }

  goToStep(step: number): void {
    this.currentStep = step;
    console.log('Switched to step:', step);
  }

  // TrackBy functions for performance optimization
  trackByCollectionId(index: number, collection: any): any {
    return collection.id || index;
  }

  trackByModelId(index: number, model: any): any {
    return model.id || index;
  }

  trackByUserId(index: number, user: any): any {
    return user.id || index;
  }

  trackByClassId(index: number, classe: any): any {
    return classe.identifier || classe.name || index;
  }

  // Utility methods
  getSortIcon(field: string): string {
    if (this.currentSortField === field) {
      return this.isAscending ? '⬆' : '⬇';
    }
    return '⬆⬇';
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }
}
