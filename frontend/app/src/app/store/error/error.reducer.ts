import { createReducer, on } from '@ngrx/store';
import { ErrorState, initialErrorState, ErrorNotification } from './error.state';
import * as ErrorActions from './error.actions';

export const errorReducer = createReducer(
  initialErrorState,

  // Show Notification
  on(ErrorActions.showNotification, (state, { notificationType, title, message, details, source, action, dismissible, autoDismiss, duration }) => {
    const notification: ErrorNotification = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: notificationType,
      title,
      message,
      details,
      timestamp: new Date().toISOString(),
      source,
      action,
      dismissible: dismissible !== false,
      autoDismiss: autoDismiss !== false,
      duration: duration || state.settings.defaultDuration
    };

    // Add to notifications (respect max limit)
    const newNotifications = [notification, ...state.notifications].slice(0, state.settings.maxNotifications);

    return {
      ...state,
      notifications: newNotifications
    };
  }),

  on(ErrorActions.showNotificationSuccess, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
  })),

  on(ErrorActions.showNotificationFailure, (state, { error }) => ({
    ...state,
    globalError: error,
    isGlobalErrorVisible: true
  })),

  // Dismiss Notification
  on(ErrorActions.dismissNotification, (state, { notificationId }) => ({
    ...state,
    notifications: state.notifications.filter(n => n.id !== notificationId)
  })),

  on(ErrorActions.dismissNotificationSuccess, (state, { notificationId }) => ({
    ...state,
    notifications: state.notifications.filter(n => n.id !== notificationId)
  })),

  on(ErrorActions.dismissAllNotifications, (state) => ({
    ...state,
    notifications: []
  })),

  on(ErrorActions.dismissAllNotificationsSuccess, (state) => ({
    ...state,
    notifications: []
  })),

  // Global Error
  on(ErrorActions.setGlobalError, (state, { error, source }) => ({
    ...state,
    globalError: error,
    isGlobalErrorVisible: true
  })),

  on(ErrorActions.clearGlobalError, (state) => ({
    ...state,
    globalError: null,
    isGlobalErrorVisible: false
  })),

  on(ErrorActions.showGlobalError, (state, { error, source }) => ({
    ...state,
    globalError: error,
    isGlobalErrorVisible: true
  })),

  on(ErrorActions.hideGlobalError, (state) => ({
    ...state,
    isGlobalErrorVisible: false
  })),

  // Error History
  on(ErrorActions.addToErrorHistory, (state, { notification }) => {
    const newHistory = [notification, ...state.errorHistory].slice(0, state.maxHistorySize);
    return {
      ...state,
      errorHistory: newHistory
    };
  }),

  on(ErrorActions.clearErrorHistory, (state) => ({
    ...state,
    errorHistory: []
  })),

  on(ErrorActions.setMaxHistorySize, (state, { maxSize }) => ({
    ...state,
    maxHistorySize: maxSize,
    errorHistory: state.errorHistory.slice(0, maxSize)
  })),

  // Settings
  on(ErrorActions.updateErrorSettings, (state, { settings }) => ({
    ...state,
    settings: { ...state.settings, ...settings }
  })),

  on(ErrorActions.updateErrorSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings
  })),

  // Quick Notification Actions
  on(ErrorActions.showError, (state, { title, message, details, source, action }) => {
    const notification: ErrorNotification = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title,
      message,
      details,
      timestamp: new Date().toISOString(),
      source,
      action,
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  on(ErrorActions.showWarning, (state, { title, message, details, source, action }) => {
    const notification: ErrorNotification = {
      id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'warning',
      title,
      message,
      details,
      timestamp: new Date().toISOString(),
      source,
      action,
      dismissible: true,
      autoDismiss: true,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  on(ErrorActions.showInfo, (state, { title, message, details, source, action }) => {
    const notification: ErrorNotification = {
      id: `info_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'info',
      title,
      message,
      details,
      timestamp: new Date().toISOString(),
      source,
      action,
      dismissible: true,
      autoDismiss: true,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  on(ErrorActions.showSuccess, (state, { title, message, details, source, action }) => {
    const notification: ErrorNotification = {
      id: `success_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'success',
      title,
      message,
      details,
      timestamp: new Date().toISOString(),
      source,
      action,
      dismissible: true,
      autoDismiss: true,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  // HTTP Error
  on(ErrorActions.handleHttpError, (state, { error, source, context }) => {
    const message = error?.message || error?.error?.message || 'An HTTP error occurred';
    const details = error?.error?.details || error?.details || context;
    
    const notification: ErrorNotification = {
      id: `http_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'HTTP Error',
      message,
      details,
      timestamp: new Date().toISOString(),
      source: source || 'HTTP Client',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications),
      errorHistory: [notification, ...state.errorHistory].slice(0, state.maxHistorySize)
    };
  }),

  // API Error
  on(ErrorActions.handleApiError, (state, { error, endpoint, method, source }) => {
    const message = error?.message || error?.error?.message || 'An API error occurred';
    const details = `${method || 'REQUEST'} ${endpoint || 'Unknown endpoint'}: ${error?.error?.details || error?.details || ''}`;
    
    const notification: ErrorNotification = {
      id: `api_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'API Error',
      message,
      details,
      timestamp: new Date().toISOString(),
      source: source || 'API Client',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications),
      errorHistory: [notification, ...state.errorHistory].slice(0, state.maxHistorySize)
    };
  }),

  // Network Error
  on(ErrorActions.handleNetworkError, (state, { error, source }) => {
    const notification: ErrorNotification = {
      id: `network_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      details: error?.message || 'Network connection failed',
      timestamp: new Date().toISOString(),
      source: source || 'Network',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications),
      errorHistory: [notification, ...state.errorHistory].slice(0, state.maxHistorySize)
    };
  }),

  // Offline Error
  on(ErrorActions.handleOfflineError, (state, { source }) => {
    const notification: ErrorNotification = {
      id: `offline_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'warning',
      title: 'Offline Mode',
      message: 'You are currently offline. Some features may not be available.',
      timestamp: new Date().toISOString(),
      source: source || 'Network',
      dismissible: true,
      autoDismiss: true,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  // Validation Error
  on(ErrorActions.handleValidationError, (state, { errors, formName, source }) => {
    const errorMessages = Array.isArray(errors) ? errors.join(', ') : errors?.message || 'Validation failed';
    
    const notification: ErrorNotification = {
      id: `validation_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'Validation Error',
      message: errorMessages,
      details: formName ? `Form: ${formName}` : undefined,
      timestamp: new Date().toISOString(),
      source: source || 'Form Validation',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  // Permission Error
  on(ErrorActions.handlePermissionError, (state, { requiredPermission, source }) => {
    const notification: ErrorNotification = {
      id: `permission_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'Permission Denied',
      message: 'You do not have the required permissions to perform this action.',
      details: `Required permission: ${requiredPermission}`,
      timestamp: new Date().toISOString(),
      source: source || 'Authorization',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  // Auth Error
  on(ErrorActions.handleAuthError, (state, { error, source }) => {
    const message = error?.message || 'Authentication failed';
    
    const notification: ErrorNotification = {
      id: `auth_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'Authentication Error',
      message,
      details: error?.details || 'Please check your credentials and try again',
      timestamp: new Date().toISOString(),
      source: source || 'Authentication',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications),
      errorHistory: [notification, ...state.errorHistory].slice(0, state.maxHistorySize)
    };
  }),

  // File Upload Error
  on(ErrorActions.handleFileUploadError, (state, { error, fileName, source }) => {
    const message = error?.message || 'File upload failed';
    
    const notification: ErrorNotification = {
      id: `upload_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      title: 'Upload Error',
      message,
      details: fileName ? `File: ${fileName}` : error?.details,
      timestamp: new Date().toISOString(),
      source: source || 'File Upload',
      dismissible: true,
      autoDismiss: false,
      duration: state.settings.defaultDuration
    };

    return {
      ...state,
      notifications: [notification, ...state.notifications].slice(0, state.settings.maxNotifications)
    };
  }),

  // Clear All Errors
  on(ErrorActions.clearAllErrors, (state) => ({
    ...state,
    notifications: [],
    globalError: null,
    isGlobalErrorVisible: false
  })),

  on(ErrorActions.clearAllErrorsSuccess, (state) => ({
    ...state,
    notifications: [],
    globalError: null,
    isGlobalErrorVisible: false
  }))
);
