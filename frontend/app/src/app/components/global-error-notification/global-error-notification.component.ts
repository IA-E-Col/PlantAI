import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { AppState } from '../../store/app.state';
import * as ErrorActions from '../../store/error/error.actions';
import { 
  selectAllNotifications,
  selectGlobalError,
  selectIsGlobalErrorVisible,
  selectErrorSettings
} from '../../store/error/error.selectors';
import { ErrorNotification } from '../../store/error/error.state';

@Component({
  selector: 'app-global-error-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Global Error Banner -->
    <div 
      *ngIf="isGlobalErrorVisible$ | async" 
      class="global-error-banner"
      [ngClass]="'error-banner-' + ((globalError$ | async) ? 'visible' : 'hidden')"
    >
      <div class="error-banner-content">
        <div class="error-banner-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="error-banner-message">
          <strong>System Error:</strong>
          <span>{{ globalError$ | async }}</span>
        </div>
        <button 
          class="error-banner-close"
          (click)="hideGlobalError()"
          aria-label="Close error banner"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>

    <!-- Notification Toast Container -->
    <div class="notification-container" *ngIf="hasNotifications | async">
      <div 
        *ngFor="let notification of notifications$ | async; trackBy: trackByNotificationId"
        class="notification-toast"
        [class]="'notification-' + notification.type"
        [class.notification-dismissible]="notification.dismissible"
        [class.notification-auto-dismiss]="notification.autoDismiss"
        [@slideInOut]
      >
        <div class="notification-content">
          <div class="notification-icon">
            <i [class]="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-body">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div *ngIf="notification.details" class="notification-details">
              {{ notification.details }}
            </div>
            <div *ngIf="notification.source" class="notification-source">
              Source: {{ notification.source }}
            </div>
          </div>
          <div class="notification-actions">
            <button 
              *ngIf="notification.action"
              class="notification-action-btn"
              (click)="executeAction(notification)"
            >
              {{ notification.action.label }}
            </button>
            <button 
              *ngIf="notification.dismissible"
              class="notification-close-btn"
              (click)="dismissNotification(notification.id)"
              aria-label="Dismiss notification"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        <div 
          *ngIf="notification.autoDismiss && notification.duration"
          class="notification-progress"
          [style.animation-duration]="notification.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .global-error-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: linear-gradient(135deg, #dc3545, #c82333);
      color: white;
      padding: 12px 20px;
      box-shadow: 0 2px 10px rgba(220, 53, 69, 0.3);
      transform: translateY(-100%);
      transition: transform 0.3s ease-in-out;
    }

    .error-banner-visible {
      transform: translateY(0);
    }

    .error-banner-content {
      display: flex;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .error-banner-icon {
      margin-right: 12px;
      font-size: 1.2em;
    }

    .error-banner-message {
      flex: 1;
      font-weight: 500;
    }

    .error-banner-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.2em;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .error-banner-close:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9998;
      max-width: 400px;
      width: 100%;
    }

    .notification-toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      margin-bottom: 12px;
      overflow: hidden;
      position: relative;
      border-left: 4px solid;
    }

    .notification-error {
      border-left-color: #dc3545;
    }

    .notification-warning {
      border-left-color: #ffc107;
    }

    .notification-info {
      border-left-color: #17a2b8;
    }

    .notification-success {
      border-left-color: #28a745;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 16px;
    }

    .notification-icon {
      margin-right: 12px;
      font-size: 1.2em;
      margin-top: 2px;
    }

    .notification-error .notification-icon {
      color: #dc3545;
    }

    .notification-warning .notification-icon {
      color: #ffc107;
    }

    .notification-info .notification-icon {
      color: #17a2b8;
    }

    .notification-success .notification-icon {
      color: #28a745;
    }

    .notification-body {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      font-size: 0.95em;
      margin-bottom: 4px;
      color: #333;
    }

    .notification-message {
      font-size: 0.9em;
      color: #666;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .notification-details {
      font-size: 0.8em;
      color: #888;
      margin-top: 4px;
      font-style: italic;
    }

    .notification-source {
      font-size: 0.75em;
      color: #aaa;
      margin-top: 4px;
    }

    .notification-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-left: 12px;
    }

    .notification-action-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.8em;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .notification-action-btn:hover {
      background: #0056b3;
    }

    .notification-close-btn {
      background: none;
      border: none;
      color: #999;
      font-size: 1.1em;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s;
    }

    .notification-close-btn:hover {
      color: #666;
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #007bff, #0056b3);
      animation: progressBar linear;
    }

    @keyframes progressBar {
      from { width: 100%; }
      to { width: 0%; }
    }

    @keyframes slideInOut {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-toast {
      animation: slideInOut 0.3s ease-out;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .global-error-banner {
        padding: 10px 15px;
      }

      .error-banner-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .error-banner-close {
        align-self: flex-end;
      }
    }
  `],
  animations: [
    // Add Angular animations here if needed
  ]
})
export class GlobalErrorNotificationComponent implements OnInit, OnDestroy {
  // NgRx Observables
  notifications$: Observable<ErrorNotification[]>;
  globalError$: Observable<string | null>;
  isGlobalErrorVisible$: Observable<boolean>;
  errorSettings$: Observable<any>;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    // Initialize NgRx observables
    this.notifications$ = this.store.select(selectAllNotifications);
    this.globalError$ = this.store.select(selectGlobalError);
    this.isGlobalErrorVisible$ = this.store.select(selectIsGlobalErrorVisible);
    this.errorSettings$ = this.store.select(selectErrorSettings);
  }

  ngOnInit(): void {
    console.log('Global error notification component initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // UI Helper methods
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'error':
        return 'bi bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi bi-exclamation-triangle';
      case 'info':
        return 'bi bi-info-circle-fill';
      case 'success':
        return 'bi bi-check-circle-fill';
      default:
        return 'bi bi-info-circle';
    }
  }

  trackByNotificationId(index: number, notification: ErrorNotification): string {
    return notification.id;
  }

  get hasNotifications(): Observable<boolean> {
    return this.notifications$.pipe(
      map(notifications => notifications && notifications.length > 0)
    );
  }

  // Action methods
  dismissNotification(notificationId: string): void {
    this.store.dispatch(ErrorActions.dismissNotification({ notificationId }));
  }

  dismissAllNotifications(): void {
    this.store.dispatch(ErrorActions.dismissAllNotifications());
  }

  hideGlobalError(): void {
    this.store.dispatch(ErrorActions.hideGlobalError());
  }

  clearGlobalError(): void {
    this.store.dispatch(ErrorActions.clearGlobalError());
  }

  executeAction(notification: ErrorNotification): void {
    if (notification.action?.handler) {
      try {
        notification.action.handler();
        // Optionally dismiss the notification after action execution
        this.dismissNotification(notification.id);
      } catch (error) {
        console.error('Error executing notification action:', error);
        this.store.dispatch(ErrorActions.showError({
          title: 'Action Error',
          message: 'Failed to execute the requested action.',
          source: 'Global Error Notification'
        }));
      }
    }
  }

  // Utility methods
  getNotificationClass(notification: ErrorNotification): string {
    return `notification-${notification.type}`;
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  isNotificationExpired(notification: ErrorNotification): boolean {
    if (!notification.autoDismiss || !notification.duration) {
      return false;
    }
    
    const now = new Date().getTime();
    const notificationTime = new Date(notification.timestamp).getTime();
    return (now - notificationTime) > notification.duration;
  }

}
