import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faLeaf, faUserCircle } from '@fortawesome/free-solid-svg-icons';

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

  faChevronDown = faChevronDown
  // Image de profil par défaut
  userImageUrl: string = 'assets/user.png';

  // Dimensions pour l'affichage de l'image
  imageWidth: number = 40;
  imageHeight: number = 40;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupérer l'objet utilisateur stocké dans localStorage sous "authUser"
    const storedProfile = localStorage.getItem('authUser');
    if (storedProfile) {
      const userProfile = JSON.parse(storedProfile);
      this.userImageUrl = (userProfile.profileImageUrl && userProfile.profileImageUrl.trim() !== '')
        ? 'data:image/jpeg;base64, ' + userProfile.profileImageUrl
        : 'assets/user.png';

      // Si le username n'est pas déjà défini, le composer à partir de prenom et nom
      if (!this.username || this.username.trim() === '') {
        const prenom = userProfile.prenom || '';
        const nom = userProfile.nom || '';
        this.username = `${prenom} ${nom}`.trim();
      }
    } else {
      this.userImageUrl = 'assets/user.png';
    }

    console.log('Image utilisateur chargée :', this.userImageUrl);
  }

  // Redirige vers la page de profil
  navigateToProfile(): void {
    this.router.navigate(['admin/profile']);
  }

  // Déconnexion : suppression des informations stockées et redirection vers la page de connexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    this.router.navigate(['login']);
  }
}
