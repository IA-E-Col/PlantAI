import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfo, faInfoCircle, faPlay } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-image-inf',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './image-inf.component.html',
  styleUrls: ['./image-inf.component.css']
})
export class ImageInfComponent implements OnInit, AfterViewInit {
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
  modeles!: Array<any>;
  m: number = 1;
  m1: number = 1;
  planteId!: string | null;
  datasetId!: string | null;
  faPlay = faPlay;
  faInfoCircle = faInfoCircle
  constructor(private route: ActivatedRoute, private router: Router, private projetservice: ProjetService) { }

  ngOnInit(): void {

    this.projetservice.func_get_All_models().subscribe({
      next: (data) => {
        this.modeles = data;
        console.log("all models", data);
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to load models', 'error');
        console.error(err);
      }
    });
    this.route.parent?.paramMap.subscribe(params => {
      this.datasetId = params.get('id');
    })
    this.route.paramMap.subscribe(params => {
      this.planteId = params.get('catalogueCode');
      const navigation = window.history.state;
      this.projetservice.func_get_Specimen(this.planteId).subscribe({
        next: (data) => {
          this.plante = data;
          console.log("specimen", data);
          this.imageUrl = this.plante.image.image_url;
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to load specimen', 'error');
          console.error(err);
        }
      });
      this.plantes = navigation.plantes;
      console.log('tswira', this.plante);
    });
    console.log('Annotations', this.plantes);
  }
  activeTab: string = 'metadata';

  // Méthode pour changer d'onglet
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  closePreview(): void {
    // Implémentez la logique de fermeture ici
    this.isOpenPreview = false;
  }

  // Méthode pour afficher la preview
  showPreview(): void {
    // Implémentez la logique d'affichage ici
    this.isOpenPreview = true;
  }

  ngAfterViewInit(): void {
    this.zoomElement = document.getElementById('zoom') as HTMLElement;
    this.initialScale = this.scale;
  }

  setTransform(): void {
    if (this.zoomElement) {
      this.zoomElement.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
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
    console.log("the model that will be send", modeleId);
    this.router.navigate([`admin/datasets/${this.datasetId}/images/${this.planteId}/models/${modeleId}/annotation-validation`]);
  }

  chng_img(plante: any, plantes: any): void {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: plantes }
    });
  }

  info_model(id: any): void {
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