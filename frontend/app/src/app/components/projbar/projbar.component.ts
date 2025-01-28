import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";



@Component({
  selector: 'app-projbar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './projbar.component.html',
  styleUrl: './projbar.component.scss'
})
export class ProjbarComponent implements OnInit{

  cheminInfo = "assets/info.png";
  cheminCol = "assets/col.jpg";
  cheminGer = "assets/ger.png";
  projectId!: string
  collection!: Array<any>;
  test = "3"
  data = {
    collect1: [
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
    ],

    collect2: [
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
      {
        id: 'I22T455',
        nom: 'collection1',
        descrption: 'active',
        date: '29-01-2001',
        createur: 'mustapha',
        modele: 'Deep learning'
      },
    ]
  };

  constructor(private route: ActivatedRoute, private router : Router) {
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });

  }



}


