import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faLeaf, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from "../../services/login.service";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  firstName: string = "";
  userImage: string | null = null; // Stocker l'image de l'utilisateur

  faLeaf = faLeaf;
  faUserCircle = faUserCircle;
  faChevronDown = faChevronDown;

  isDropdownOpen: boolean = false;

  constructor(private loginServ: LoginService) {}

  ngOnInit() {
    // Récupérer les infos du user connecté
    const authUser : string | null = localStorage.getItem("authUser");
    if (authUser != null)
    {    
      const user = JSON.parse(authUser).user;
      if (user.id) {
        this.firstName = user.prenom || "User";
        this.loginServ.getUserImage(user.id).subscribe(image => {
          this.userImage = image; // Stocke l'image en Base64
        });
      
    }
      
    }
   


  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
