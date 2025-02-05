import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-explorer-details',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './explorer-details.component.html',
  styleUrl: './explorer-details.component.scss'
})
export class ExplorerDetailsComponent {

  collectionId!: string

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
      this.collectionId = params['id'];
    });
  }
}