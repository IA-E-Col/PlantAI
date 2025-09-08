import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import * as ErrorActions from '../store/error/error.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Extract meaningful information from the error
        const endpoint = request.url;
        const method = request.method;
        const source = this.getSourceFromUrl(endpoint);

        // Handle different types of HTTP errors
        if (error.status === 0) {
          // Network error (no response from server)
          this.store.dispatch(ErrorActions.handleNetworkError({ 
            error, 
            source: source || 'HTTP Client' 
          }));
        } else if (error.status >= 400 && error.status < 500) {
          // Client errors
          this.store.dispatch(ErrorActions.handleHttpError({ 
            error, 
            source: source || 'HTTP Client',
            context: `${method} ${endpoint}`
          }));
        } else if (error.status >= 500) {
          // Server errors
          this.store.dispatch(ErrorActions.handleHttpError({ 
            error, 
            source: source || 'HTTP Client',
            context: `${method} ${endpoint}`
          }));
        } else {
          // Other errors
          this.store.dispatch(ErrorActions.handleHttpError({ 
            error, 
            source: source || 'HTTP Client',
            context: `${method} ${endpoint}`
          }));
        }

        // Log error for debugging
        console.error('HTTP Error Interceptor:', {
          url: endpoint,
          method: method,
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });

        // Re-throw the error so it can be handled by the calling code if needed
        return throwError(() => error);
      })
    );
  }

  private getSourceFromUrl(url: string): string | undefined {
    // Extract source information from URL patterns
    if (url.includes('/auth/')) {
      return 'Authentication';
    } else if (url.includes('/users/')) {
      return 'User Management';
    } else if (url.includes('/projects/')) {
      return 'Project Management';
    } else if (url.includes('/collections/')) {
      return 'Collection Management';
    } else if (url.includes('/models/')) {
      return 'Model Management';
    } else if (url.includes('/annotations/')) {
      return 'Annotation Management';
    } else if (url.includes('/images/')) {
      return 'Image Management';
    } else if (url.includes('/upload')) {
      return 'File Upload';
    } else if (url.includes('/download')) {
      return 'File Download';
    } else if (url.includes('/api/')) {
      return 'API Client';
    }
    
    return undefined;
  }
}
