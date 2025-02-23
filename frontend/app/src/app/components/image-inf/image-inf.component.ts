import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';


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
export class ImageInfComponent implements OnInit, AfterViewChecked {
  currentStep: number = 1;
  currentStep1: number = 0;
  datasetId : number = 0;
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
  isOpenPreview: boolean = false;
  originalWidth: number = 0;
  originalHeight: number = 0;
  faClose = faClose;
  constructor(private route: ActivatedRoute, private router: Router, private projetservice: ProjetService) { }
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

    this.route.paramMap.subscribe(params => {
      const catalogueCode = params.get('catalogueCode');
      const navigation = window.history.state;
      this.projetservice.func_get_Specimen(navigation.plante.id).subscribe({
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


  setTransform(): void {
    if (this.zoomElement) {
      this.zoomElement.style.width = `${this.scale * this.originalWidth}px`;
      this.zoomElement.style.height = `${this.scale * this.originalHeight}px`;
      this.zoomElement.style.transform = `translate(${this.pointX}px, ${this.pointY}px)`;
    }
  }

  showPreview(){
    this.isOpenPreview = true;
    document.body.classList.add('no-scroll'); 
  }

  closePreview(){
    this.isOpenPreview = false;
    document.body.classList.remove('no-scroll'); 
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

  doPrediction(plante: any, modeleId: any): void {
    console.log("the model that will be send", modeleId);
    this.router.navigate(['/admin/AnnotationDetail'], { state: { plante: plante, modeleId: modeleId } });
  }

  chng_img(plante: any, plantes: any): void {
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: plantes }
    });
  }

  info_model(id: any): void {
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
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

  scrollLeft(): void {
    const wrapper = document.querySelector('.wrapper') as HTMLElement | null;
    if (wrapper) {
      wrapper.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(() => this.updateArrowVisibility(), 300);
    }
  }

  scrollRight(): void {
    const wrapper = document.querySelector('.wrapper') as HTMLElement | null;
    if (wrapper) {
      wrapper.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(() => this.updateArrowVisibility(), 300);
    }
  }
}
