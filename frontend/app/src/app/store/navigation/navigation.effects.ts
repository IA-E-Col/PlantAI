import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import * as NavigationActions from './navigation.actions';

@Injectable()
export class NavigationEffects {

  constructor(
    private actions$: Actions,
    private router: Router
  ) {}

  // Navigate to route effect
  navigateToRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.navigateToRoute),
      tap(action => {
        this.router.navigate([action.route]);
      })
    ), { dispatch: false }
  );

  // Auto-detect menu when route changes
  detectMenuFromRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.detectMenuFromRoute),
      // This effect just processes the route change - the reducer handles the menu detection
    ), { dispatch: false }
  );
}
