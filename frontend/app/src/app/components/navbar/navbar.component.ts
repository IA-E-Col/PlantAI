import { Component, OnInit, Input } from '@angular/core';
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
export class NavbarComponent implements OnInit {

  @Input() username: string = '';  // Nom complet (prénom + nom)

  faLeaf = faLeaf;
  faUserCircle = faUserCircle;

  // Image de profil par défaut
  userImageUrl: string = 'assets/user.png';

  // Dimensions pour l'affichage de l'image
  imageWidth: number = 40;
  imageHeight: number = 40;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupération de l'image de profil depuis le localStorage
    const storedImage = localStorage.getItem('profileImageUrl');
    this.userImageUrl = storedImage ? storedImage : 'assets/user.png';
    console.log('Image utilisateur chargée :', this.userImageUrl);

    // Récupération du prénom et du nom depuis le localStorage, si la propriété username n'est pas déjà passée
    if (!this.username || this.username.trim() === '') {
      const prenom = localStorage.getItem('prenom') || '';
      const nom = localStorage.getItem('nom') || '';
      this.username = `${prenom} ${nom}`.trim();
    }
  }

  // Redirige vers le profil
  navigateToProfile(): void {
    this.router.navigate(['admin/profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('profileImageUrl');
    localStorage.removeItem('prenom');
    localStorage.removeItem('nom');
    this.router.navigate(['login']);
  }
}
