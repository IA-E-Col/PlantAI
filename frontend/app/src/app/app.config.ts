import { ApplicationConfig, importProvidersFrom, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { reducers } from './store';
import { AuthEffects } from './store/auth/auth.effects';
import { ProjectsEffects } from './store/projects/projects.effects';
import { CollectionsEffects } from './store/collections/collections.effects';
import { ModelsEffects } from './store/models/models.effects';
import { NavigationEffects } from './store/navigation/navigation.effects';
import { AnnotationEffects } from './store/annotations/annotations.effects';
import { UserEffects } from './store/users/users.effects';
import { ErrorEffects } from './store/error/error.effects';
import { AppInitializer } from './store/app.initializer';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
export class AppModule { }

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore(reducers),
        provideEffects([AuthEffects, ProjectsEffects, CollectionsEffects, ModelsEffects, NavigationEffects, AnnotationEffects, UserEffects, ErrorEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    }),
        {
          provide: APP_INITIALIZER,
          useFactory: (appInitializer: AppInitializer) => () => appInitializer.init(),
          deps: [AppInitializer],
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        // Temporarily disabled until backend compilation issues are resolved
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: AuthInterceptor,
        //   multi: true
        // },
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      NgxPaginationModule
    )
  ]
};

