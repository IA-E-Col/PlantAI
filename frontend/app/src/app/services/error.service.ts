import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import * as ErrorActions from '../store/error/error.actions';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private store: Store<AppState>) {}

  // Quick notification methods
  showError(title: string, message: string, details?: string, source?: string) {
    this.store.dispatch(ErrorActions.showError({ title, message, details, source }));
  }

  showWarning(title: string, message: string, details?: string, source?: string) {
    this.store.dispatch(ErrorActions.showWarning({ title, message, details, source }));
  }

  showInfo(title: string, message: string, details?: string, source?: string) {
    this.store.dispatch(ErrorActions.showInfo({ title, message, details, source }));
  }

  showSuccess(title: string, message: string, details?: string, source?: string) {
    this.store.dispatch(ErrorActions.showSuccess({ title, message, details, source }));
  }

  // Custom notification
  showNotification(
    type: 'error' | 'warning' | 'info' | 'success',
    title: string,
    message: string,
    options?: {
      details?: string;
      source?: string;
      action?: {
        label: string;
        handler: () => void;
      };
      dismissible?: boolean;
      autoDismiss?: boolean;
      duration?: number;
    }
  ) {
    this.store.dispatch(ErrorActions.showNotification({
      notificationType: type,
      title,
      message,
      details: options?.details,
      source: options?.source,
      action: options?.action,
      dismissible: options?.dismissible,
      autoDismiss: options?.autoDismiss,
      duration: options?.duration
    }));
  }

  // Dismiss methods
  dismissNotification(notificationId: string) {
    this.store.dispatch(ErrorActions.dismissNotification({ notificationId }));
  }

  dismissAllNotifications() {
    this.store.dispatch(ErrorActions.dismissAllNotifications());
  }

  // Global error methods
  setGlobalError(error: string, source?: string) {
    this.store.dispatch(ErrorActions.setGlobalError({ error, source }));
  }

  clearGlobalError() {
    this.store.dispatch(ErrorActions.clearGlobalError());
  }

  showGlobalError(error: string, source?: string) {
    this.store.dispatch(ErrorActions.showGlobalError({ error, source }));
  }

  hideGlobalError() {
    this.store.dispatch(ErrorActions.hideGlobalError());
  }

  // Specialized error handlers
  handleHttpError(error: any, source?: string, context?: string) {
    this.store.dispatch(ErrorActions.handleHttpError({ error, source, context }));
  }

  handleApiError(error: any, endpoint?: string, method?: string, source?: string) {
    this.store.dispatch(ErrorActions.handleApiError({ error, endpoint, method, source }));
  }

  handleNetworkError(error: any, source?: string) {
    this.store.dispatch(ErrorActions.handleNetworkError({ error, source }));
  }

  handleOfflineError(source?: string) {
    this.store.dispatch(ErrorActions.handleOfflineError({ source }));
  }

  handleValidationError(errors: any, formName?: string, source?: string) {
    this.store.dispatch(ErrorActions.handleValidationError({ errors, formName, source }));
  }

  handlePermissionError(requiredPermission: string, source?: string) {
    this.store.dispatch(ErrorActions.handlePermissionError({ requiredPermission, source }));
  }

  handleAuthError(error: any, source?: string) {
    this.store.dispatch(ErrorActions.handleAuthError({ error, source }));
  }

  handleFileUploadError(error: any, fileName?: string, source?: string) {
    this.store.dispatch(ErrorActions.handleFileUploadError({ error, fileName, source }));
  }

  // Clear methods
  clearAllErrors() {
    this.store.dispatch(ErrorActions.clearAllErrors());
  }

  clearErrorHistory() {
    this.store.dispatch(ErrorActions.clearErrorHistory());
  }

  // Settings methods
  updateSettings(settings: Partial<{
    autoDismiss: boolean;
    defaultDuration: number;
    maxNotifications: number;
    enableSound: boolean;
    enableVibration: boolean;
  }>) {
    this.store.dispatch(ErrorActions.updateErrorSettings({ settings }));
  }

  // Convenience methods for common scenarios
  showFormValidationError(formName: string, errors: any) {
    this.handleValidationError(errors, formName, 'Form Validation');
  }

  showUnauthorizedError() {
    this.showError(
      'Unauthorized',
      'You are not authorized to perform this action. Please log in again.',
      'Authentication required',
      'Authorization'
    );
  }

  showNetworkUnavailableError() {
    this.showError(
      'Network Unavailable',
      'Unable to connect to the server. Please check your internet connection and try again.',
      'Network connection failed',
      'Network'
    );
  }

  showServerError() {
    this.showError(
      'Server Error',
      'An internal server error occurred. Please try again later.',
      'Server is temporarily unavailable',
      'Server'
    );
  }

  showNotFoundError(resource: string) {
    this.showError(
      'Not Found',
      `The requested ${resource} was not found.`,
      'Resource may have been deleted or moved',
      'Resource'
    );
  }

  showConflictError(resource: string) {
    this.showError(
      'Conflict',
      `The ${resource} conflicts with existing data. Please check and try again.`,
      'Data conflict detected',
      'Data Validation'
    );
  }

  showRateLimitError() {
    this.showWarning(
      'Rate Limit Exceeded',
      'You have made too many requests. Please wait a moment before trying again.',
      'Rate limit protection active',
      'API'
    );
  }

  showFileUploadSuccess(fileName: string) {
    this.showSuccess(
      'Upload Successful',
      `File "${fileName}" has been uploaded successfully.`,
      'File processing completed',
      'File Upload'
    );
  }

  showSaveSuccess(resource: string) {
    this.showSuccess(
      'Saved Successfully',
      `The ${resource} has been saved successfully.`,
      'Changes have been applied',
      'Data Management'
    );
  }

  showDeleteSuccess(resource: string) {
    this.showSuccess(
      'Deleted Successfully',
      `The ${resource} has been deleted successfully.`,
      'Resource removed from system',
      'Data Management'
    );
  }

  showUpdateSuccess(resource: string) {
    this.showSuccess(
      'Updated Successfully',
      `The ${resource} has been updated successfully.`,
      'Changes have been applied',
      'Data Management'
    );
  }

  showCreateSuccess(resource: string) {
    this.showSuccess(
      'Created Successfully',
      `The ${resource} has been created successfully.`,
      'New resource added to system',
      'Data Management'
    );
  }

  // Error recovery methods
  showRetryableError(title: string, message: string, retryAction: () => void, source?: string) {
    this.showNotification('error', title, message, {
      source,
      action: {
        label: 'Retry',
        handler: retryAction
      },
      dismissible: true,
      autoDismiss: false
    });
  }

  showConfirmationError(title: string, message: string, confirmAction: () => void, source?: string) {
    this.showNotification('warning', title, message, {
      source,
      action: {
        label: 'Confirm',
        handler: confirmAction
      },
      dismissible: true,
      autoDismiss: false
    });
  }
}
