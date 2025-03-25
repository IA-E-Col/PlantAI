import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-template',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit {
  corpusId!: string;
  cheminLogo = "assets/IRD.png";
  cheminUser = "assets/user.png";
  username!: string;
  id: string = '';
  menuOpen = false;

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    // Récupère le nom complet depuis le service ou localStorage
    const username = localStorage.getItem('prenom') || '';
    const nom = localStorage.getItem('nom') || '';
  }
}
