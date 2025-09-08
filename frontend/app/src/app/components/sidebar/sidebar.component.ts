import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faTachometerAlt, faGear, faDatabase, faMicrochip, faBars, faDiagramProject, faFile, faInfoCircle, faImage, faUserCircle, faRobot, faBrain, faHistory, faNetworkWired, faBook, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { filter, Subject, takeUntil, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { NavigationActions } from '../../store';
import { 
  selectActiveMenu, 
  selectActiveSubmenu, 
  selectCurrentRoute,
  selectCurrentItemId,
  selectSidebarOpen,
  selectShouldShowSubmenu
} from '../../store/navigation/navigation.selectors';
import { MenuItem, SubmenuItem } from '../../store/navigation/navigation.state';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy, OnInit {
  
  // NgRx Observables
  activeMenu$: Observable<string>;
  activeSubmenu$: Observable<string>;
  currentRoute$: Observable<string>;
  currentItemId$: Observable<string | null>;
  sidebarOpen$: Observable<boolean>;
  shouldShowSubmenu$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.activeMenu$ = this.store.select(selectActiveMenu);
    this.activeSubmenu$ = this.store.select(selectActiveSubmenu);
    this.currentRoute$ = this.store.select(selectCurrentRoute);
    this.currentItemId$ = this.store.select(selectCurrentItemId);
    this.sidebarOpen$ = this.store.select(selectSidebarOpen);
    this.shouldShowSubmenu$ = this.store.select(selectShouldShowSubmenu);
    
    // Listen to router events and update NgRx state
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        const route = (event as NavigationEnd).urlAfterRedirects;
        console.log('Router navigation detected:', route);
        
        // Update route in NgRx store and detect menu
        this.store.dispatch(NavigationActions.detectMenuFromRoute({ route }));
        
        // Extract route parameters and update NgRx state
        this.extractRouteParams(route);
      });
  }

  private extractRouteParams(route: string): void {
    const routeParts = route.split('/').filter(Boolean);
    const adminIndex = routeParts.indexOf('admin');
    
    if (adminIndex !== -1 && adminIndex + 1 < routeParts.length) {
      const entityType = routeParts[adminIndex + 1];
      const entityId = routeParts[adminIndex + 2] || null;
      
      console.log('Extracted route params:', { entityType, entityId });
      
      // Update the appropriate ID in NgRx state
      switch (entityType) {
        case 'projects':
          this.store.dispatch(NavigationActions.setCurrentProjectId({ projectId: entityId }));
          break;
        case 'corpus':
          this.store.dispatch(NavigationActions.setCurrentCollectionId({ collectionId: entityId }));
          break;
        case 'datasets':
          this.store.dispatch(NavigationActions.setCurrentDatasetId({ datasetId: entityId }));
          break;
        case 'models':
          this.store.dispatch(NavigationActions.setCurrentModelId({ modelId: entityId }));
          break;
        case 'classes':
          this.store.dispatch(NavigationActions.setCurrentClassId({ classId: entityId }));
          break;
      }
    }
  }
  ngOnInit(): void {
    // Initialize current route from URL
    const currentRoute = this.router.url;
    this.store.dispatch(NavigationActions.detectMenuFromRoute({ route: currentRoute }));
    this.extractRouteParams(currentRoute);
    
    console.log('Sidebar component initialized with NgRx state');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // FontAwesome icons
  faBars = faBars;
  faFile = faFile;
  faBook = faBook;
  faRobot = faRobot;
  faCircleInfo = faCircleInfo;
  faTachometerAlt = faTachometerAlt;
  faGear = faGear;
  faImage = faImage;
  faInfoCircle = faInfoCircle;
  faDatabase = faDatabase;
  faDiagramProject = faDiagramProject;
  faMicrochip = faMicrochip;
  faUserCircle = faUserCircle;
  faBrain = faBrain;
  faHistory = faHistory;
  faNetworkWired = faNetworkWired;
  faFileImport = faFileImport;

  // Static menu items
  menuItems: MenuItem[] = [
    { name: 'Corpus', icon: faFile, path: '/admin/corpus' },
    { name: 'Projects', icon: faDiagramProject, path: '/admin/projects' },
    { name: 'Datasets', icon: faDatabase, path: '/admin/datasets' },
    { name: 'Models', icon: faMicrochip, path: '/admin/models' },
    { name: 'Classes', icon: faNetworkWired, path: '/admin/classes' },
  ];

  // Method to get submenus based on current state
  getSubmenus(activeMenu: string, itemId: string | null): SubmenuItem[] {
    if (!itemId || !activeMenu) return [];
    
    const menuKey = activeMenu.toLowerCase();
    
    switch (menuKey) {
      case 'corpus':
        return [
          { name: 'Details', icon: faCircleInfo, path: `/admin/corpus/${itemId}/details` },
          { name: 'Images', icon: faImage, path: `/admin/corpus/${itemId}/images` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/corpus/${itemId}/dashboard` },
          { name: 'Settings', icon: faGear, path: `/admin/corpus/${itemId}/edit` }
        ];
      case 'projects':
        return [
          { name: 'Details', icon: faUserCircle, path: `/admin/projects/${itemId}/details` },
          { name: 'Datasets', icon: faDatabase, path: `/admin/projects/${itemId}/datasets` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/projects/${itemId}/dashboard` },
          { name: 'Collaborators', icon: faUserCircle, path: `/admin/projects/${itemId}/collaborators` },
          { name: 'Settings', icon: faGear, path: `/admin/projects/${itemId}/edit` }
        ];
      case 'models':
        return [
          { name: 'Model Library', icon: faBook, path: `/admin/models/${itemId}/model-library` },
          { name: 'Settings', icon: faGear, path: `/admin/models/${itemId}/edit` },
          { name: 'Collaborative Validation', icon: faBrain, path: `/admin/annotation_validation` }
        ];
      case 'datasets':
        return [
          { name: 'Details', icon: faUserCircle, path: `/admin/datasets/${itemId}/details` },
          { name: 'Images', icon: faImage, path: `/admin/datasets/${itemId}/images` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/datasets/${itemId}/dashboard` },
          { name: 'Models', icon: faMicrochip, path: `/admin/datasets/${itemId}/models` },
          { name: 'Validation History', icon: faHistory, path: `/admin/datasets/${itemId}/validation_history` },
          { name: 'Import/Export Annotations', icon: faFileImport, path: `/admin/datasets/${itemId}/import_export_annotation` },
          { name: 'Settings', icon: faGear, path: `/admin/datasets/${itemId}/edit` }
        ];
      default:
        return [];
    }
  }

  // NgRx action methods
  setActive(name: string): void {
    this.store.dispatch(NavigationActions.setActiveMenu({ menu: name }));
  }

  setActiveSub(name: string): void {
    this.store.dispatch(NavigationActions.setActiveSubmenu({ submenu: name }));
  }

  toggleSidebar(): void {
    this.store.dispatch(NavigationActions.toggleSidebar());
  }

  // Utility method to track menu items in *ngFor
  trackByMenuItem(index: number, item: MenuItem): string {
    return item.name;
  }

  // Utility method to track submenu items in *ngFor
  trackBySubmenuItem(index: number, item: SubmenuItem): string {
    return item.name;
  }
}
