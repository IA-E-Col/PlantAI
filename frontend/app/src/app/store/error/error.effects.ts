import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap, delay } from 'rxjs/operators';
import { AppState } from '../app.state';
import * as ErrorActions from './error.actions';
import { ErrorNotification } from './error.state';

@Injectable()
export class ErrorEffects {

  // Show Notification Effect
  showNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.showNotification),
      switchMap(({ notificationType, title, message, details, source, action, dismissible, autoDismiss, duration }) => {
        const notification: ErrorNotification = {
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: notificationType,
          title,
          message,
          details,
          timestamp: new Date().toISOString(),
          source,
          action,
          dismissible: dismissible !== false,
          autoDismiss: autoDismiss !== false,
          duration: duration || 5000
        };

        return of(ErrorActions.showNotificationSuccess({ notification }));
      }),
      catchError(error => of(ErrorActions.showNotificationFailure({ error: error.message })))
    )
  );

  // Auto-dismiss notifications
  autoDismissNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.showNotificationSuccess),
      switchMap(({ notification }) => {
        if (notification.autoDismiss && notification.duration) {
          return of(notification.id).pipe(
            delay(notification.duration),
            map(id => ErrorActions.dismissNotification({ notificationId: id }))
          );
        }
        return of();
      })
    )
  );

  // Add to error history
  addToErrorHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.showNotificationSuccess),
      map(({ notification }) => {
        if (notification.type === 'error') {
          return ErrorActions.addToErrorHistory({ notification });
        }
        return { type: 'NO_ACTION' };
      })
    )
  );

  // Handle HTTP Error Effect
  handleHttpError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleHttpError),
      switchMap(({ error, source, context }) => {
        console.error('HTTP Error:', error, 'Source:', source, 'Context:', context);
        
        // Extract meaningful error information
        let title = 'HTTP Error';
        let message = 'An error occurred while processing your request';
        let details = context;

        if (error?.status) {
          switch (error.status) {
            case 400:
              title = 'Bad Request';
              message = 'The request was invalid or cannot be served';
              break;
            case 401:
              title = 'Unauthorized';
              message = 'You are not authorized to perform this action';
              break;
            case 403:
              title = 'Forbidden';
              message = 'Access to this resource is forbidden';
              break;
            case 404:
              title = 'Not Found';
              message = 'The requested resource was not found';
              break;
            case 409:
              title = 'Conflict';
              message = 'The request conflicts with the current state';
              break;
            case 422:
              title = 'Validation Error';
              message = 'The request contains invalid data';
              break;
            case 429:
              title = 'Too Many Requests';
              message = 'You have exceeded the rate limit. Please try again later';
              break;
            case 500:
              title = 'Internal Server Error';
              message = 'An internal server error occurred';
              break;
            case 502:
              title = 'Bad Gateway';
              message = 'The server received an invalid response';
              break;
            case 503:
              title = 'Service Unavailable';
              message = 'The service is temporarily unavailable';
              break;
            case 504:
              title = 'Gateway Timeout';
              message = 'The server did not respond in time';
              break;
            default:
              title = `HTTP ${error.status} Error`;
              message = error?.message || 'An HTTP error occurred';
          }
        }

        if (error?.error?.message) {
          message = error.error.message;
        }

        if (error?.error?.details) {
          details = error.error.details;
        }

        return of(ErrorActions.showError({
          title,
          message,
          details,
          source: source || 'HTTP Client'
        }));
      })
    )
  );

  // Handle API Error Effect
  handleApiError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleApiError),
      switchMap(({ error, endpoint, method, source }) => {
        console.error('API Error:', error, 'Endpoint:', endpoint, 'Method:', method, 'Source:', source);
        
        const title = 'API Error';
        let message = 'An API error occurred';
        let details = `${method || 'REQUEST'} ${endpoint || 'Unknown endpoint'}`;

        if (error?.message) {
          message = error.message;
        }

        if (error?.error?.message) {
          message = error.error.message;
        }

        if (error?.error?.details) {
          details += `: ${error.error.details}`;
        }

        return of(ErrorActions.showError({
          title,
          message,
          details,
          source: source || 'API Client'
        }));
      })
    )
  );

  // Handle Network Error Effect
  handleNetworkError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleNetworkError),
      switchMap(({ error, source }) => {
        console.error('Network Error:', error, 'Source:', source);
        
        return of(ErrorActions.showError({
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          details: error?.message || 'Network connection failed',
          source: source || 'Network'
        }));
      })
    )
  );

  // Handle Offline Error Effect
  handleOfflineError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleOfflineError),
      switchMap(({ source }) => {
        console.warn('Offline Error:', 'Source:', source);
        
        return of(ErrorActions.showWarning({
          title: 'Offline Mode',
          message: 'You are currently offline. Some features may not be available.',
          source: source || 'Network'
        }));
      })
    )
  );

  // Handle Validation Error Effect
  handleValidationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleValidationError),
      switchMap(({ errors, formName, source }) => {
        console.error('Validation Error:', errors, 'Form:', formName, 'Source:', source);
        
        let message = 'Validation failed';
        let details = formName ? `Form: ${formName}` : undefined;

        if (Array.isArray(errors)) {
          message = errors.join(', ');
        } else if (errors?.message) {
          message = errors.message;
        }

        return of(ErrorActions.showError({
          title: 'Validation Error',
          message,
          details,
          source: source || 'Form Validation'
        }));
      })
    )
  );

  // Handle Permission Error Effect
  handlePermissionError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handlePermissionError),
      switchMap(({ requiredPermission, source }) => {
        console.error('Permission Error:', requiredPermission, 'Source:', source);
        
        return of(ErrorActions.showError({
          title: 'Permission Denied',
          message: 'You do not have the required permissions to perform this action.',
          details: `Required permission: ${requiredPermission}`,
          source: source || 'Authorization'
        }));
      })
    )
  );

  // Handle Auth Error Effect
  handleAuthError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleAuthError),
      switchMap(({ error, source }) => {
        console.error('Auth Error:', error, 'Source:', source);
        
        const message = error?.message || 'Authentication failed';
        const details = error?.details || 'Please check your credentials and try again';

        return of(ErrorActions.showError({
          title: 'Authentication Error',
          message,
          details,
          source: source || 'Authentication'
        }));
      })
    )
  );

  // Handle File Upload Error Effect
  handleFileUploadError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorActions.handleFileUploadError),
      switchMap(({ error, fileName, source }) => {
        console.error('File Upload Error:', error, 'File:', fileName, 'Source:', source);
        
        const message = error?.message || 'File upload failed';
        const details = fileName ? `File: ${fileName}` : error?.details;

        return of(ErrorActions.showError({
          title: 'Upload Error',
          message,
          details,
          source: source || 'File Upload'
        }));
      })
    )
  );

  // Global error handling for all error actions
  handleGlobalError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ErrorActions.showNotificationFailure,
        ErrorActions.handleHttpError,
        ErrorActions.handleApiError,
        ErrorActions.handleNetworkError,
        ErrorActions.handleAuthError
      ),
      tap((action) => {
        // Log to console for debugging
        console.error('Global Error Handler:', action);
        
        // You can add additional global error handling here:
        // - Send to error reporting service
        // - Track analytics
        // - Show global error banner
        // - Trigger recovery actions
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {}
}
