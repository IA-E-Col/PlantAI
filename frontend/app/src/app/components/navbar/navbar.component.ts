import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faLeaf,faUserCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent {
  @Input()  username : String = "";
  faLeaf = faLeaf;
  faUserCircle = faUserCircle;
  faChevronDown = faChevronDown;
  isDropdownOpen : boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
