import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faLeaf, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

import { AppState } from '../../store/app.state';
import { AuthActions } from '../../store';
import { 
  selectUser, 
  selectUserName, 
  selectIsAuthenticated 
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  // NgRx Observables - Single Source of Truth!
  user$: Observable<any>;
  userName$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;

  faLeaf = faLeaf;
  faUserCircle = faUserCircle;
  faChevronDown = faChevronDown;

  // Default image
  userImageUrl: string = 'assets/user.png';
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize NgRx observables
    this.user$ = this.store.select(selectUser);
    this.userName$ = this.store.select(selectUserName);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // React to user changes from NgRx store!
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user?.profileImageUrl) {
          this.userImageUrl = user.profileImageUrl.includes('data:image/') 
            ? user.profileImageUrl
            : `data:image/jpeg;base64,${user.profileImageUrl}`;
        } else {
          this.userImageUrl = 'assets/user.png';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Navigate to profile page
   */
  navigateToProfile(): void {
    this.router.navigate(['admin/profile']);
  }

  /**
   * Logout using NgRx - clean and centralized!
   */
  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['login']);
  }
}
