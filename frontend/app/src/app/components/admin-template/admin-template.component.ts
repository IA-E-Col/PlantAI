import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ProjetService} from "../../services/projet.service";
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
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent implements OnInit{
  cheminLogo = "assets/IRD.png";
  cheminUser = "assets/user.png";
  username! : string
  id: string = '';
  constructor(private projetService: ProjetService) {
  }
  menuOpen = false;

  ngOnInit() {
    this.username = this.projetService.func_get_username();
  }
}