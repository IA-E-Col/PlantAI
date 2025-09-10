import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../filter.pipe';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { CollectionsActions, NavigationActions } from '../../store';
import { 
  selectCollectionById,
  selectCollectionsLoading,
  selectCollectionsError 
} from '../../store/collections/collections.selectors';
import { 
  selectNavigationCollectionId
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-gerer-collection',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './gerer-collection.component.html',
  styleUrl: './gerer-collection.component.css'
})
export class GererCollectionComponent implements OnInit, OnDestroy {

  afficherLeFormulaire: boolean = true;
  collectionId: any;
  
  // NgRx Observables
  collection$: Observable<any> = new Observable();
  collectionId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  collection: any;
  errorMessage!: string;
  collectionFormGroup!: FormGroup;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.collectionId$ = this.store.select(selectNavigationCollectionId);
    this.isLoading$ = this.store.select(selectCollectionsLoading);
    this.error$ = this.store.select(selectCollectionsError);
    
    this.collectionFormGroup = this.fb.group({
      nomCollection: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit(): void {
    // Handle route parameters
    if (this.route.parent) {
      this.route.parent.paramMap
        .pipe(takeUntil(this.destroy$))
        .subscribe(params => {
          this.collectionId = params.get('id');
          console.log('Collection ID:', this.collectionId);
          
          if (this.collectionId) {
            this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: this.collectionId }));
            this.loadCollection();
          }
        });
    }
    
    // Subscribe to collection data
    this.collection$ = this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const collectionId = params.get('id');
        if (collectionId) {
          return this.store.select(selectCollectionById(parseInt(collectionId)));
        }
        return this.store.select(selectCollectionById(0));
      })
    ) || this.store.select(selectCollectionById(0));
    
    this.collection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collection => {
        if (collection) {
          this.collection = collection;
          this.collectionFormGroup.patchValue({
            nomCollection: collection.nom,
            description: collection.description
          });
          console.log('Collection loaded via NgRx:', collection);
        }
      });
    
    // Subscribe to errors
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load collection: ${error}`, 'error');
        }
      });
    
    console.log('Manage collection component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCollection(): void {
    if (this.collectionId) {
      console.log('Loading collection:', this.collectionId);
      
      // Load real collection data via NgRx
      this.store.dispatch(CollectionsActions.loadCollections());
      
      console.log('Collection loading initiated via NgRx');
    }
  }


  afficherFormulaire(afficher: boolean): void {
    this.afficherLeFormulaire = afficher;
    console.log('Form display toggled:', afficher);
  }

  modifier_prt(): void {
    if (!this.collectionFormGroup.valid) {
      Swal.fire('Error', 'Please fill in all required fields correctly', 'error');
      return;
    }
    
    const collectionData = this.collectionFormGroup.value;
    
    console.log('Modifying collection:', {
      collectionId: this.collectionId,
      data: collectionData
    });
    
    Swal.fire({
      title: 'Modify Collection',
      text: 'Are you sure you want to modify this collection?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, modify collection',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Modifying Collection',
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Dispatch real update action with complete collection data
        const updatedCollection = {
          ...this.collection,
          nom: collectionData.nomCollection,
          description: collectionData.description
        };
        
        this.store.dispatch(CollectionsActions.updateCollection({ 
          collectionId: parseInt(this.collectionId), 
          changes: updatedCollection
        }));
        
        // Subscribe to update success/failure
        this.store.select(selectCollectionsLoading)
          .pipe(takeUntil(this.destroy$))
          .subscribe(isLoading => {
            if (!isLoading) {
              // Check if there's an error
              this.store.select(selectCollectionsError)
                .pipe(takeUntil(this.destroy$))
                .subscribe(error => {
                  if (!error) {
                    // Success - show success message
                    Swal.fire({
                      title: 'Collection Modified!',
                      text: 'The collection has been successfully updated.',
                      icon: 'success',
                      timer: 2000
                    }).then(() => {
                      this.router.navigateByUrl(`/admin/corpus/${this.collectionId}/details`);
                    });
                    console.log('Collection modification completed successfully');
                  } else {
                    // Error - show error message
                    Swal.fire('Error', `Failed to modify collection: ${error}`, 'error');
                    console.error('Failed to modify collection:', error);
                  }
                });
            }
          });
      }
    });
  }

  // UI Helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.collectionFormGroup.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.collectionFormGroup.get(fieldName);
    if (field?.errors?.['required']) {
      return `${fieldName} is required`;
    }
    if (field?.errors?.['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }


}
