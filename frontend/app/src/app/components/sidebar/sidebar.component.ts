import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faInfo, faImage, faTachometerAlt, faCogs, faDatabase, faLayerGroup, faMicrochip, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  active = 'Details';
  isOpen = true;
  faBars = faBars;
  faHome = faHome;
  faInfo = faInfo;
  faTachometerAlt = faTachometerAlt;
  faCogs = faCogs;
  faDatabase = faDatabase;
  faLayerGroup = faLayerGroup;
  faMicrochip = faMicrochip;
  menuItems = [
    { name: 'Corpus', icon: faHome },
    { name: 'Details', icon: faInfo },
    { name: 'Images', icon: faImage },
    { name: 'Dashboard', icon: faTachometerAlt },
    { name: 'Settings', icon: faCogs },
    { name: 'Projects', icon: faLayerGroup },
    { name: 'Datasets', icon: faDatabase },
    { name: 'Models', icon: faMicrochip },
    { name: 'Settings', icon: faCogs },
  ];

  setActive(name: string) {
    this.active = name;
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
