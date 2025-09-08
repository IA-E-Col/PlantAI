import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../../filter.pipe";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, Subject, BehaviorSubject, combineLatest, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state';
import { 
  selectUser,
  selectIsAuthenticated 
} from '../../store/auth/auth.selectors';
import { 
  selectNavigationProjectId 
} from '../../store/navigation/navigation.selectors';

// User Score Interface
interface UserScore {
  id: number;
  fullName: string;
  dateSubmission: string;
  score: number;
  avatar: string;
}

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
    FormsModule,
    AsyncPipe
  ],
  standalone: true,

})
export class ScoresComponent implements OnInit, OnDestroy {
  
  // Filtering and sorting state
  searchText: string = '';
  selectedDate: string = '';
  selectedScore: string = '';
  isAscending: boolean = true;
  currentSortField: string = 'fullName';
  p: number = 1;

  // NgRx Observables
  user$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  currentProjectId$: Observable<string | null>;
  
  // Local state management (will be moved to store later)
  private usersSubject = new BehaviorSubject<UserScore[]>([
    { id: 1, fullName: 'John Doe', dateSubmission: '09/09/2024', score: 1, avatar: 'assets/images/john-doe.jpg' },
    { id: 2, fullName: 'Jane Doe', dateSubmission: '04/10/2024', score: 2, avatar: 'assets/images/jane-doe.jpg' },
    { id: 3, fullName: 'John Smith', dateSubmission: '12/09/2024', score: 2, avatar: 'assets/images/john-smith.jpg' },
    { id: 4, fullName: 'Ashok Kumar', dateSubmission: '12/09/2024', score: 2, avatar: 'assets/images/ashok-kumar.jpg' },
    { id: 5, fullName: 'Paula Poe', dateSubmission: '25/10/2024', score: 1, avatar: 'assets/images/paula-poe.jpg' },
    { id: 6, fullName: 'William Woe', dateSubmission: '06/11/2024', score: 1, avatar: 'assets/images/william-woe.jpg' },
  ]);

  // Reactive filtered and sorted users
  filteredUsers$: Observable<UserScore[]>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.user$ = this.store.select(selectUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentProjectId$ = this.store.select(selectNavigationProjectId);
    
    // Create reactive filtered and sorted users observable
    this.filteredUsers$ = this.usersSubject.pipe(
      map(users => this.filterAndSortUsers(users))
    );
  }

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      });

    // Log current project context
    this.currentProjectId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectId => {
        if (projectId) {
          console.log('Scores component loaded for project:', projectId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private filterAndSortUsers(users: UserScore[]): UserScore[] {
    return users
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

  sortBy(field: string): void {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }
    
    // Trigger re-filtering and sorting
    this.refreshFilteredUsers();
  }

  onFilterChange(): void {
    // Trigger re-filtering when any filter changes
    this.refreshFilteredUsers();
  }

  private refreshFilteredUsers(): void {
    // Update the filtered users observable
    this.filteredUsers$ = this.usersSubject.pipe(
      map(users => this.filterAndSortUsers(users))
    );
  }

  addUser(): void {
    const currentUsers = this.usersSubject.value;
    const newUser = {
      id: currentUsers.length + 1,
      fullName: `User ${currentUsers.length + 1}`,
      dateSubmission: new Date().toLocaleDateString('en-GB'),
      score: Math.floor(Math.random() * 3) + 1,
      avatar: 'assets/images/default-avatar.jpg'
    };
    
    // Update the users list reactively
    this.usersSubject.next([...currentUsers, newUser]);
    console.log('Added new user:', newUser);
  }

  deleteUser(id: number): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.filter(user => user.id !== id);
    
    // Update the users list reactively
    this.usersSubject.next(updatedUsers);
    console.log('Deleted user with ID:', id);
  }

  trackByUserId(index: number, user: UserScore): number {
    return user.id;
  }
}
