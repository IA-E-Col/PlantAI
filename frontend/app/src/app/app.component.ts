import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./components/login/login.component";
import {HttpClientModule} from "@angular/common/http";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet ,RouterLink, RouterLinkActive, ReactiveFormsModule, LoginComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'app';
}
