import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AppState } from '../../store/app.state';
import { selectSidebarOpen } from '../../store/navigation/navigation.selectors';
import { selectUser, selectUserName } from '../../store/auth/auth.selectors';
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
    SidebarComponent,
    AsyncPipe
  ],
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit, OnDestroy {
  
  // Asset paths
  cheminLogo = "assets/IRD.png";
  cheminUser = "assets/user.png";
  
  // NgRx Observables
  sidebarOpen$: Observable<boolean>;
  user$: Observable<any>;
  userName$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    // Initialize observables from NgRx store
    this.sidebarOpen$ = this.store.select(selectSidebarOpen);
    this.user$ = this.store.select(selectUser);
    this.userName$ = this.store.select(selectUserName);
  }

  ngOnInit(): void {
    // Subscribe to user data for any additional setup if needed
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          console.log('Admin template initialized for user:', user.email);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
