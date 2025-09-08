import { createAction, props } from '@ngrx/store';
import { ErrorNotification } from './error.state';

// Show Notification Actions
export const showNotification = createAction(
  '[Error] Show Notification',
  props<{ 
    notificationType: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    details?: string;
    source?: string;
    action?: {
      label: string;
      handler: () => void;
    };
    dismissible?: boolean;
    autoDismiss?: boolean;
    duration?: number;
  }>()
);

export const showNotificationSuccess = createAction(
  '[Error] Show Notification Success',
  props<{ notification: ErrorNotification }>()
);

export const showNotificationFailure = createAction(
  '[Error] Show Notification Failure',
  props<{ error: string }>()
);

// Dismiss Notification Actions
export const dismissNotification = createAction(
  '[Error] Dismiss Notification',
  props<{ notificationId: string }>()
);

export const dismissNotificationSuccess = createAction(
  '[Error] Dismiss Notification Success',
  props<{ notificationId: string }>()
);

export const dismissAllNotifications = createAction(
  '[Error] Dismiss All Notifications'
);

export const dismissAllNotificationsSuccess = createAction(
  '[Error] Dismiss All Notifications Success'
);

// Global Error Actions
export const setGlobalError = createAction(
  '[Error] Set Global Error',
  props<{ error: string; source?: string }>()
);

export const clearGlobalError = createAction(
  '[Error] Clear Global Error'
);

export const showGlobalError = createAction(
  '[Error] Show Global Error',
  props<{ error: string; source?: string }>()
);

export const hideGlobalError = createAction(
  '[Error] Hide Global Error'
);

// Error History Actions
export const addToErrorHistory = createAction(
  '[Error] Add To Error History',
  props<{ notification: ErrorNotification }>()
);

export const clearErrorHistory = createAction(
  '[Error] Clear Error History'
);

export const setMaxHistorySize = createAction(
  '[Error] Set Max History Size',
  props<{ maxSize: number }>()
);

// Settings Actions
export const updateErrorSettings = createAction(
  '[Error] Update Error Settings',
  props<{ 
    settings: Partial<{
      autoDismiss: boolean;
      defaultDuration: number;
      maxNotifications: number;
      enableSound: boolean;
      enableVibration: boolean;
    }> 
  }>()
);

export const updateErrorSettingsSuccess = createAction(
  '[Error] Update Error Settings Success',
  props<{ 
    settings: {
      autoDismiss: boolean;
      defaultDuration: number;
      maxNotifications: number;
      enableSound: boolean;
      enableVibration: boolean;
    } 
  }>()
);

// Quick Notification Actions (Convenience)
export const showError = createAction(
  '[Error] Show Error',
  props<{ 
    title: string;
    message: string;
    details?: string;
    source?: string;
    action?: {
      label: string;
      handler: () => void;
    };
  }>()
);

export const showWarning = createAction(
  '[Error] Show Warning',
  props<{ 
    title: string;
    message: string;
    details?: string;
    source?: string;
    action?: {
      label: string;
      handler: () => void;
    };
  }>()
);

export const showInfo = createAction(
  '[Error] Show Info',
  props<{ 
    title: string;
    message: string;
    details?: string;
    source?: string;
    action?: {
      label: string;
      handler: () => void;
    };
  }>()
);

export const showSuccess = createAction(
  '[Error] Show Success',
  props<{ 
    title: string;
    message: string;
    details?: string;
    source?: string;
    action?: {
      label: string;
      handler: () => void;
    };
  }>()
);

// HTTP Error Actions
export const handleHttpError = createAction(
  '[Error] Handle HTTP Error',
  props<{ 
    error: any;
    source?: string;
    context?: string;
  }>()
);

export const handleApiError = createAction(
  '[Error] Handle API Error',
  props<{ 
    error: any;
    endpoint?: string;
    method?: string;
    source?: string;
  }>()
);

// Network Error Actions
export const handleNetworkError = createAction(
  '[Error] Handle Network Error',
  props<{ 
    error: any;
    source?: string;
  }>()
);

export const handleOfflineError = createAction(
  '[Error] Handle Offline Error',
  props<{ 
    source?: string;
  }>()
);

// Validation Error Actions
export const handleValidationError = createAction(
  '[Error] Handle Validation Error',
  props<{ 
    errors: any;
    formName?: string;
    source?: string;
  }>()
);

// Permission Error Actions
export const handlePermissionError = createAction(
  '[Error] Handle Permission Error',
  props<{ 
    requiredPermission: string;
    source?: string;
  }>()
);

// Authentication Error Actions
export const handleAuthError = createAction(
  '[Error] Handle Auth Error',
  props<{ 
    error: any;
    source?: string;
  }>()
);

// File Upload Error Actions
export const handleFileUploadError = createAction(
  '[Error] Handle File Upload Error',
  props<{ 
    error: any;
    fileName?: string;
    source?: string;
  }>()
);

// Clear Actions
export const clearAllErrors = createAction(
  '[Error] Clear All Errors'
);

export const clearAllErrorsSuccess = createAction(
  '[Error] Clear All Errors Success'
);
