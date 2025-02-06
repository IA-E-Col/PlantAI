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
            { name: 'Details', icon: faCircleInfo, path: `/admin/explore-details/${this.itemId}/collectionInf/${this.itemId}`  },
            { name: 'Images', icon: faImage, path: `/admin/explore-details/${this.itemId}/collectionImg/${this.itemId}` },
            { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/explore-details/${this.itemId}/collectionDashboard/${this.itemId}` },
            { name: 'Settings', icon: faGear, path: `/admin/explore-details/${this.itemId}/gerercollection/${this.itemId}`  }
          ],
          projects :  [
            { name: 'Details', icon: faUserCircle, path: `/admin/projbar/${this.itemId}/projetInf/${this.itemId}`},
            { name: 'Datasets', icon: faDatabase, path: `/admin/projbar/${this.itemId}/collection/${this.itemId}` },
            { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/projbar/${this.itemId}/dashboard/${this.itemId}` },
            { name: 'Collaborators', icon: faUserCircle, path: `/admin/projbar/${this.itemId}/ajoutercollab/${this.itemId}`},
            { name: 'Settings', icon: faGear, path: `/admin/projbar/${this.itemId}/gererprojet/${this.itemId}`},
          ],
          models :  [
            { name: 'Validation History', icon: faHistory, path :"#" },
            { name: 'Model Library', icon: faBook, path: `/admin/model_inf/${this.itemId}`},
            { name: 'Collaborative Validation', icon: faBrain, path: "/admin/annotation_validation" },
          ],
          
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
          { name: 'Details', icon: faCircleInfo, path: `/admin/explore-details/${id}/collectionInf/${id}`  },
          { name: 'Images', icon: faImage, path: `/admin/explore-details/${id}/collectionImg/${id}` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/explore-details/${id}/collectionDashboard/${id}` },
          { name: 'Settings', icon: faGear, path: `/admin/explore-details/${id}/gerercollection/${id}`  }
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
          { name: 'Details', icon: faUserCircle, path: `/admin/projbar/${id}/projetInf/${id}`},
          { name: 'Datasets', icon: faDatabase, path: `/admin/projbar/${id}/collection/${id}` },
          { name: 'Dashboard', icon: faTachometerAlt, path: `/admin/projbar/${id}/dashboard/${id}` },
          { name: 'Collaborators', icon: faUserCircle, path: `/admin/projbar/${id}/ajoutercollab/${id}`},
          { name: 'Settings', icon: faGear, path: `/admin/projbar/${id}/gererprojet/${id}`},

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
        { name: 'Validation History', icon: faHistory, path :null },
        { name: 'Model Library', icon: faBook, path: `/admin/model_inf/${id}`},
        { name: 'Collaborative Validation', icon: faBrain },
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
    { name: 'Corpus', icon: faFile, path: '/admin/explorer'},
    { name: 'Projects', icon: faDiagramProject, path : '/admin/projets' },
    { name: 'Datasets', icon: faDatabase, path : '/admin/collection/total' },
    { name: 'Models', icon: faMicrochip, path: '/admin/models' },
    { name: 'Classes', icon: faNetworkWired, path: '/admin/classes' }, 
  ];
  submenus : any = [
    
  ];

  getCurrentRouteMatcher(selectedMenu : string) : string{
    return this.menuItems.map((menuItem:any) => menuItem.name == selectedMenu).routeMatcher;

  }
  getRouteMatcher() : void{
    if (this.currentRoute.includes('explore-details') || this.currentRoute.includes("collectionInf"))
      this.setActive('Corpus');
    else if (this.currentRoute.includes('UpdateModel') || this.currentRoute.includes('model_inf'))
       this.setActive('Models');
    else if (this.currentRoute.includes('image-inf') || this.currentRoute.includes('projbar') || this.currentRoute.includes('projets'))
       this.setActive('Projects');
    else if (this.currentRoute.includes('collection-inf'))
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
