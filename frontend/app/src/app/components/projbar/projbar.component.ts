import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, NavigationEnd } from "@angular/router";
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, filter, map } from 'rxjs';

import { AppState } from '../../store/app.state';
import { NavigationActions } from '../../store';
import { 
  selectNavigationProjectId,
  selectCurrentRoute 
} from '../../store/navigation/navigation.selectors';



@Component({
  selector: 'app-projbar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './projbar.component.html',
  styleUrl: './projbar.component.scss'
})
export class ProjbarComponent implements OnInit, OnDestroy {

  // Asset paths
  cheminInfo = "assets/info.png";
  cheminCol = "assets/col.jpg";
  cheminGer = "assets/ger.png";

  // NgRx Observables
  projectId$: Observable<string | null>;
  currentRoute$: Observable<string | null>;
  
  // Navigation menu items
  menuItems = [
    { 
      label: 'Information', 
      route: 'details', 
      icon: 'bi-file-earmark-text-fill',
      width: '107px'
    },
    { 
      label: 'Datasets', 
      route: 'datasets', 
      icon: 'bi-collection-fill',
      width: '85px'
    },
    { 
      label: 'Dashboard', 
      route: 'dashboard', 
      icon: 'bi-pie-chart-fill',
      width: '97px'
    },
    { 
      label: 'Manage', 
      route: 'edit', 
      icon: 'bi-gear-wide-connected',
      width: '80px'
    },
    { 
      label: 'Validation History', 
      route: 'validation-history', 
      icon: 'bi-clock-history',
      width: '120px'
    }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.projectId$ = this.store.select(selectNavigationProjectId);
    this.currentRoute$ = this.store.select(selectCurrentRoute);
  }

  ngOnInit(): void {
    // Listen to route parameter changes and update NgRx state
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const projectId = params['id'];
        if (projectId) {
          console.log('Projbar detected project ID:', projectId);
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId }));
        }
      });

    // Listen to route changes to update current route in store
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        const route = (event as NavigationEnd).urlAfterRedirects;
        this.store.dispatch(NavigationActions.detectMenuFromRoute({ route }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if a menu item is currently active
   */
  isMenuItemActive(route: string): Observable<boolean> {
    return this.currentRoute$.pipe(
      map(currentRoute => currentRoute?.includes(route) || false)
    );
  }

  /**
   * Track function for menu items
   */
  trackByMenuItem(index: number, item: any): string {
    return item.route;
  }



}


