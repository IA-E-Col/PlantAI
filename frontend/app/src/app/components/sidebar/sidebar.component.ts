import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faTachometerAlt, faGear, faDatabase, faMicrochip, faBars, faDiagramProject, faFile, faInfoCircle, faImage, faUserCircle, faRobot, faBrain, faHistory, faNetworkWired, faBook } from '@fortawesome/free-solid-svg-icons';
import { filter, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { SharedServiceService } from '../../services/shared-service.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy, OnInit{
  currentRoute: string = '';
  corpusId : string | null = null;
  private routerSubscription: Subscription;
  constructor(private router: Router,private route: ActivatedRoute,private sharedServiceService: SharedServiceService) {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)) 
      .subscribe((event: any) => {
        const currentRoute = this.route.firstChild;  
      if (currentRoute) {
        this.currentRoute = event.urlAfterRedirects;
        this.getRouteMatcher();

        currentRoute.paramMap.subscribe(params => {
           this.itemId = params.get('id');  // Get the 'id' parameter from the route
          if (this.itemId == null)
            this.itemId = params.get('Id');
            console.log('Current ID in Sidebar:', this.itemId);
        });
        this.submenus = {
          corpus : [
            { name: 'Details', icon: faCircleInfo, path: `/admin/corpus/${this.itemId}/details`  },
            { name: 'Images', icon: faImage, path: `/admin/corpus/${this.itemId}/images` },
            { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/corpus/${this.itemId}/dashboard` },
            { name: 'Settings', icon: faGear, path: `/admin/corpus/${this.itemId}/edit`  }
          ],
          projects :  [
            { name: 'Details', icon: faUserCircle, path: `/admin/projects/${this.itemId}/details`},
            { name: 'Datasets', icon: faDatabase, path: `/admin/projects/${this.itemId}/datasets` },
            { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/projects/${this.itemId}/dashboard` },
            { name: 'Collaborators', icon: faUserCircle, path: `/admin/projects/${this.itemId}/collaborators`},
            { name: 'Validation History', icon: faHistory, path: `/admin/projects/${this.itemId}/validation-history`},
            { name: 'Settings', icon: faGear, path: `/admin/projects/${this.itemId}/edit`},
          ],
          models :  [
            { name: 'Model Library', icon: faBook, path: `/admin/models/${this.itemId}/model-library`},
            { name: 'Settings', icon: faGear, path: `/admin/models/${this.itemId}/edit`},
            { name: 'Collaborative Validation', icon: faBrain, path: `/admin/annotation_validation`},
          ],
          datasets : [
            { name: 'Details', icon: faUserCircle, path: `/admin/datasets/${this.itemId}/details`},
            { name: 'Images', icon: faImage, path: `/admin/datasets/${this.itemId}/images` },
            { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/datasets/${this.itemId}/dashboard` },
            { name: 'Models', icon: faMicrochip, path: `/admin/datasets/${this.itemId}/models`},
            { name: 'Validation History', icon: faHistory, path: `/admin/datasets/${this.itemId}/validation_history`},
            { name: 'Settings', icon: faGear, path: `/admin/datasets/${this.itemId}/edit`},
          ]
          
        }
      }
        console.log('Current Route:', this.currentRoute);
      });
  }
  ngOnInit(): void {
    console.log(this.submenus)
    this.sharedServiceService.corpusId$.subscribe(id => {
      if (id){
      this.itemId = id
      console.log(id);
      this.submenus = {
        corpus : [
          { name: 'Details', icon: faCircleInfo, path: `/admin/corpus/${id}/details`  },
          { name: 'Images', icon: faImage, path: `/admin/corpus/${id}/images` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/corpus/${id}/dashboard` },
          { name: 'Settings', icon: faGear, path: `/admin/corpus/${id}/edit`  }
        ]
      }
    }
    console.log(this.currentRoute.includes(this.submenus.routeMatcher))

    });
    this.sharedServiceService.projectId$.subscribe(id => {
      if (id){
      this.itemId = id;
      this.submenus = {
        projects :  [
          { name: 'Details', icon: faUserCircle, path: `/admin/projects/${id}/details`},
          { name: 'Datasets', icon: faDatabase, path: `/admin/projects/${id}/datasets` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/projects/${id}/dashboard` },
          { name: 'Collaborators', icon: faUserCircle, path: `/admin/projects/${id}/collaborators`},
          { name: 'Settings', icon: faGear, path: `/admin/projects/${id}/edit}`},

        ]
      }
    }
    });
    this.sharedServiceService.datasetId$.subscribe(id => {
      if (id){
      this.itemId = id
      this.submenus = {
        datasets :  []
    }
      console.log(id);
  }
    });
    this.sharedServiceService.modelId$.subscribe(id => {
      if (id){
      this.itemId = id
      this.submenus = {
        models :  [
        { name: 'Model Library', icon: faBook, path: `/admin/models/${id}/model-library`},
        { name: 'Settings', icon: faGear, path: `/admin/models/${id}/edit`},
        { name: 'Collaborative Validation', icon: faBrain, path: `/admin/annotation_validation`},
      ]
    }
  }
    });
    this.sharedServiceService.classeId$.subscribe(id => {
      if (id){
      this.itemId = id
      console.log(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  active : String = 'Projects';
  isOpen = true;
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
  itemId : string | null = null;
  menuItems : any = [
    { name: 'Corpus', icon: faFile, path: '/admin/corpus'},
    { name: 'Projects', icon: faDiagramProject, path : '/admin/projects' },
    { name: 'Datasets', icon: faDatabase, path : '/admin/datasets' },
    { name: 'Models', icon: faMicrochip, path: '/admin/models' },
    { name: 'Classes', icon: faNetworkWired, path: '/admin/classes' }, 
  ];
  submenus : any = [
    
  ];

  getCurrentRouteMatcher(selectedMenu : string) : string{
    return this.menuItems.map((menuItem:any) => menuItem.name == selectedMenu).routeMatcher;

  }

 getFirstSegmentAfterAdmin(url : string) : string | null{
    const parts = url.split('/').filter(Boolean); // Remove empty parts
    const adminIndex = parts.indexOf('admin');
    return adminIndex !== -1 && adminIndex + 1 < parts.length ? parts[adminIndex + 1] : null;
}

  getRouteMatcher() : void{
    if (this.getFirstSegmentAfterAdmin(this.currentRoute) == 'corpus')
      this.setActive('Corpus');
    else if (this.getFirstSegmentAfterAdmin(this.currentRoute) == 'models')
       this.setActive('Models');
    else if (this.getFirstSegmentAfterAdmin(this.currentRoute) == 'projects')
       this.setActive('Projects');
    else if (this.getFirstSegmentAfterAdmin(this.currentRoute) == 'datasets')
       this.setActive('Datasets');
  }
  activeSub : string = '';

  setActive(name: string) {
    this.active = name;
  }
  setActiveSub(name: string){
    this.activeSub = name; 
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
