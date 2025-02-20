import { Component } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { ProjetService } from "../../services/projet.service";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CreeCollectionComponent } from "../cree-collection/cree-collection.component";
import { MatDialog } from "@angular/material/dialog";
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  imports: [
    CommonModule,
    FilterPipe,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule
  ],
  standalone: true,

})
export class ScoresComponent {
  searchText: string = '';
  selectedDate: string = '';
  selectedScore: string = '';
  isAscending: boolean = true;
  currentSortField: string = 'fullName';
  message_err: string = '';
  p: number = 1;

  users = [
    { id: 1, fullName: 'John Doe', dateSubmission: '09/09/2024', score: 1, avatar: 'assets/images/john-doe.jpg' },
    { id: 2, fullName: 'Jane Doe', dateSubmission: '04/10/2024', score: 2, avatar: 'assets/images/jane-doe.jpg' },
    { id: 3, fullName: 'John Smith', dateSubmission: '12/09/2024', score: 2, avatar: 'assets/images/john-smith.jpg' },
    { id: 4, fullName: 'Ashok Kumar', dateSubmission: '12/09/2024', score: 2, avatar: 'assets/images/ashok-kumar.jpg' },
    { id: 5, fullName: 'Paula Poe', dateSubmission: '25/10/2024', score: 1, avatar: 'assets/images/paula-poe.jpg' },
    { id: 6, fullName: 'William Woe', dateSubmission: '06/11/2024', score: 1, avatar: 'assets/images/william-woe.jpg' },
  ];

  get filteredUsers() {
    return this.users
      .filter(user => 
        user.fullName.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedDate ? user.dateSubmission === this.selectedDate : true) &&
        (this.selectedScore ? user.score.toString() === this.selectedScore : true)
      )
      .sort((a, b) => {
        const valueA = (a as any)[this.currentSortField];
        const valueB = (b as any)[this.currentSortField];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return this.isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        return this.isAscending ? valueA - valueB : valueB - valueA;
      });
  }

  sortBy(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }
  }

  addUser() {
    const newUser = {
      id: this.users.length + 1,
      fullName: `User ${this.users.length + 1}`,
      dateSubmission: new Date().toLocaleDateString('en-GB'),
      score: Math.floor(Math.random() * 3) + 1,
      avatar: 'assets/images/default-avatar.jpg'
    };
    this.users = [...this.users, newUser];
  }

  deleteUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }
}
