
import { Component, OnInit, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjetService } from "../../services/projet.service";
import Swal from "sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-image-inf',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './image-inf.component.html',
  styleUrl: './image-inf.component.css'
})
export class ImageInfComponent {
  currentStep: number = 1;
  currentStep1: number = 0;
  plante: any;
  plantes: any;
  imageUrl!: string;
  scale: number = 1;
  initialScale: number = 1;
  panning: boolean = false;
  pointX: number = 0;
  pointY: number = 0;
  start: { x: number; y: number } = { x: 0, y: 0 };
  zoomElement!: HTMLElement;
  cnt: number = 0;
  searchtext: any;
  modeles!: Array<any>
  m: number = 1;
  m1: number = 1;



  constructor(private route: ActivatedRoute, private router: Router, private projetservice: ProjetService)
  {} /*, private el: ElementRef*/

  /*
  cards!: NodeListOf<Element>;

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  onEvent(): void {
    this.isCardVisible();
  }

  isElementInViewport(el: Element): boolean {
    const rect: DOMRect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Vérifie si l'élément est entièrement visible dans la fenêtre
    const fullyVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= windowHeight && rect.right <= windowWidth;

    // Vérifie si l'élément est partiellement visible dans la fenêtre
    const partiallyVisible = rect.top < windowHeight && rect.bottom >= 0 && rect.left < windowWidth && rect.right >= 0;

    // Retourne vrai si l'élément est entièrement ou partiellement visible
    return fullyVisible || partiallyVisible;
  }

  isCardVisible(): void {
    this.cards.forEach(card => {
      if (this.isElementInViewport(card)) {
        card.classList.add('isVisible');
      } else {
        card.classList.remove('isVisible');
      }
    });
  }*/

  ngOnInit() {

    this.projetservice.func_get_All_models().subscribe({
      next: (data) => {
        this.modeles=data;
        console.log("all models",data)
        },

      error: (err) => {
        Swal.fire('Error', 'Failed to load models', 'error');
        console.error(err);
      }
    });

    this.route.paramMap.subscribe(params => {
      const catalogueCode = params.get('catalogueCode');


      const navigation = window.history.state;
      this.projetservice.func_get_Specimen(navigation.plante.id).subscribe({next: (data) => {
          this.plante =data;
          console.log("specimen",data)
          this.imageUrl = this.plante.image.image_url;
        },

        error: (err) => {
          Swal.fire('Error', 'Failed to load models', 'error');
          console.error(err);
        }
      });
      this.plantes = navigation.plantes;
     // this.imageUrl = this.plante.image.image_url;
      console.log('tswira', this.plante);
    });
    console.log('Annotations', this.plantes);
  }

  ngAfterViewInit() {
    this.zoomElement = document.getElementById('zoom') as HTMLElement;
    this.initialScale = this.scale;

    /*this.cards = this.el.nativeElement.querySelectorAll('.card');
    this.isCardVisible();*/
  }

  setTransform() {
    if (this.zoomElement) {
      this.zoomElement.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
    }
  }

  zoomIn() {
    this.scale *= 1.09;
    this.pointX += 25 + this.cnt * 2;
    this.pointY += 25 + this.cnt * 2;
    this.cnt += 2.5;
    this.setTransform();
  }

  zoomOut() {
    if (this.scale > this.initialScale) {
      this.scale /= 1.09;
      this.cnt -= 2.5;
      this.pointX -= 25 + this.cnt * 2;
      this.pointY -= 25 + this.cnt * 2;
      this.setTransform();
    }
  }

  doPrediction(plante: any, modeleId: any) {
    console.log("the model that will be send",modeleId)
    this.router.navigate(['/admin/AnnotationDetail'], { state: { plante: plante, modeleId: modeleId } });
  }

  chng_img(plante: any, plantes: any){
    this.router.navigate(['/admin/image-inf', plante.catalogueCode], {
      state: { plante: plante, plantes: plantes }
    });
  }

  openImageInNewWindow() {
    window.open(this.imageUrl, '_blank');
  }

  info_model(id: any){
    this.router.navigateByUrl(`/admin/model_inf/${id}`);
  }

  goto(pg: number) {
    this.currentStep = pg;
  }

  goto1(pg: number) {
    this.currentStep1 = pg;
  }

  formatNomScientifique(nom: string): string {
    return nom.split(' ').map(word => {
      // Check if the word contains a period or ends with a period, or is '&'
      if (word.includes('.') || word.endsWith('.') || word === '&') {
        return word; // Return word as is
      } else {
        return `<i>${word}</i>`; // Italicize other words
      }
    }).join(' '); // Join words back into a string
  }  

}