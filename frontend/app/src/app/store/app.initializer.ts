import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { AuthActions } from './';

@Injectable({
  providedIn: 'root'
})
export class AppInitializer {
  
  constructor(private store: Store<AppState>) {}

  /**
   * Initialize the application by loading user from localStorage
   */
  init(): void {
    // Load user from localStorage if exists
    this.store.dispatch(AuthActions.loadUserFromStorage());
  }
}
