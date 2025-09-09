import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, AsyncPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfo, faInfoCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, takeUntil, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { NavigationActions } from '../../store';
import { selectNavigationDatasetId } from '../../store/navigation/navigation.selectors';
import { SharedDataService } from '../../services/shared-data.service';


@Component({
  selector: 'app-image-inf',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    AsyncPipe
  ],
  templateUrl: './image-inf.component.html',
  styleUrls: ['./image-inf.component.css']
})
export class ImageInfComponent implements OnInit, OnDestroy, AfterViewChecked {
  isOpenPreview: boolean = false;

  currentStep: number = 1;
  currentStep1: number = 0;
  plante: any;
  plantes: any;
  imageUrl!: string;
  scale: number = 1;
  initialScale: number = 1;
  isModalOpen: boolean = false;  // Déclaration de la variable
  panning: boolean = false;
  pointX: number = 0;
  pointY: number = 0;
  start: { x: number; y: number } = { x: 0, y: 0 };
  zoomElement!: HTMLElement;
  cnt: number = 0;
  searchtext: any;
  // NgRx Observables
  models$: Observable<any[]>;
  modelsLoading$: Observable<boolean>;
  modelsError$: Observable<string | null>;
  datasetId$: Observable<string | null>;
  
  // Component data
  modeles!: Array<any>;
  m: number = 1;
  m1: number = 1;
  planteId!: string | null;
  datasetId!: string | null;
  faPlay = faPlay;
  faInfoCircle = faInfoCircle
  originalWidth: number = 0;
  originalHeight: number = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<AppState>,
    private sharedDataService: SharedDataService
  ) {
    // Initialize NgRx observables using shared service
    this.models$ = this.sharedDataService.getModels();
    this.modelsLoading$ = this.sharedDataService.getModelsLoading();
    this.modelsError$ = this.sharedDataService.getModelsError();
    this.datasetId$ = this.store.select(selectNavigationDatasetId);
  }

  ngOnInit(): void {
    // Load models using smart loading (only if not already loaded)
    this.sharedDataService.loadModelsIfNeeded();
    
    // Subscribe to models for local use
    this.models$
      .pipe(takeUntil(this.destroy$))
      .subscribe(models => {
        this.modeles = models;
        console.log("Models loaded via NgRx:", models);
      });
    
    // Subscribe to errors for user feedback
    this.modelsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          Swal.fire('Error', `Failed to load models: ${error}`, 'error');
        }
      });
    
    // Handle route parameters
    this.route.parent?.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const datasetId = params.get('id');
        this.datasetId = datasetId;
        if (datasetId) {
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId }));
        }
      });
    
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.planteId = params.get('catalogueCode');
        const navigation = window.history.state;
        
        // Load specimen data - for now using mock data
        this.loadSpecimenData(this.planteId);
        
        this.plantes = navigation.plantes;
        console.log('Specimen ID:', this.planteId);
      });
    
    console.log('Image info component initialized with NgRx');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSpecimenData(specimenId: string | null): void {
    if (!specimenId) return;
    
    // Mock specimen data for demonstration
    this.plante = {
      id: specimenId,
      catalogueCode: specimenId,
      nomScientifique: 'Rosa gallica L.',
      genre: 'Rosa',
      famille: 'Rosaceae',
      pays: 'France',
      ville: 'Paris',
      dateCreation: '2023-01-15',
      description: 'Beautiful red rose specimen',
      image: {
        image_url: 'assets/uploads/rose-specimen.jpg'
      }
    };
    
    this.imageUrl = this.plante.image.image_url;
    console.log('Mock specimen loaded:', this.plante);
    
    // TODO: Replace with proper NgRx specimen loading
    // this.store.dispatch(SpecimensActions.loadSpecimen({ specimenId }));
  }
  activeTab: string = 'metadata';

  // Méthode pour changer d'onglet
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  closePreview(): void {
    this.isOpenPreview = false;
    document.body.classList.remove('no-scroll'); 
  }

  showPreview(): void {
    this.isOpenPreview = true;
    document.body.classList.add('no-scroll'); 
  }

  ngAfterViewChecked() {
    if (this.isOpenPreview && !this.zoomElement) {
      // Wait for the element to be rendered and then access it
      setTimeout(() => {
        this.zoomElement = document.getElementById('zoom') as HTMLElement;
        if (this.zoomElement) {
          this.originalWidth = this.zoomElement.offsetWidth;
          this.originalHeight = this.zoomElement.offsetHeight;
          this.scale = this.initialScale;
        }
      }, 0);  // Executes after the view is updated
    }
  }

  setTransform(): void {
    if (this.zoomElement) {
      this.zoomElement.style.width = `${this.scale * this.originalWidth}px`;
      this.zoomElement.style.height = `${this.scale * this.originalHeight}px`;
      this.zoomElement.style.transform = `translate(${this.pointX}px, ${this.pointY}px)`;
    }
  }
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetZoom();  // Réinitialiser le zoom à la fermeture
  }

  zoomIn(): void {
    this.scale *= 1.1;
    this.setTransform();
  }

  zoomOut(): void {
    if (this.scale > this.initialScale) {
      this.scale /= 1.1;
      this.setTransform();
    }
  }

  zoomInModal(): void {
    this.scale *= 1.1;
    this.setTransform();
  }

  zoomOutModal(): void {
    if (this.scale > this.initialScale) {
      this.scale /= 1.1;
      this.setTransform();
    }
  }

  resetZoom(): void {
    this.scale = 1;
    this.setTransform();
  }

  openImageInNewWindow(): void {
    window.open(this.imageUrl, '_blank');
  }

  doPrediction(modeleId: any): void {
    console.log("Starting prediction with model:", modeleId);
    
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: modeleId.toString() }));
    
    this.router.navigate([`admin/datasets/${this.datasetId}/images/${this.planteId}/models/${modeleId}/annotation-validation`]);
  }

  chng_img(plante: any, plantes: any): void {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: plantes }
    });
  }

  info_model(id: any): void {
    // Update navigation state
    this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: id.toString() }));
    
    this.router.navigateByUrl(`/admin/models/${id}/model-library`);
  }

  goto(pg: number): void {
    this.currentStep = pg;
  }

  goto1(pg: number): void {
    this.currentStep1 = pg;
  }

  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => {
      if (word.includes('.') || word.endsWith('.') || word === '&') {
        return word;
      } else {
        return `<i>${word}</i>`;
      }
    }).join(' ');
  }

  updateArrowVisibility(): void {
    const wrapper = document.querySelector('.wrapper') as HTMLElement | null;
    if (wrapper) {
      const leftArrow = document.querySelector('.scroll-arrow.left') as HTMLElement | null;
      const rightArrow = document.querySelector('.scroll-arrow.right') as HTMLElement | null;

      if (leftArrow && rightArrow) {
        leftArrow.style.opacity = wrapper.scrollLeft > 0 ? '1' : '0';
        rightArrow.style.opacity = wrapper.scrollLeft + wrapper.clientWidth < wrapper.scrollWidth ? '1' : '0';
      }
    }
  }
  scrollLeft() {
    const wrapper = document.querySelector('.wrapper') as HTMLElement | null;
    if (wrapper) {
      wrapper.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }
  
  scrollRight() {
    const wrapper = document.querySelector('.wrapper') as HTMLElement | null;
    if (wrapper) {
      wrapper.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}  