import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLeaf, faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() username: string = "";
  
  faLeaf = faLeaf;
  faUserCircle = faUserCircle;

  imageWidth: number = 80;        // Largeur initiale de l'image
  imageHeight: number = 80;       // Hauteur initiale de l'image
  imageMarginLeft: number = -100; // Marge gauche initiale

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    this.router.navigate(['login']);
  }
}
