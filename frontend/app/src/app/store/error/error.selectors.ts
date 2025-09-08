import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ErrorState } from './error.state';
import { AppState } from '../app.state';

// Feature selector
export const selectErrorState = createFeatureSelector<AppState, ErrorState>('error');

// Basic selectors
export const selectAllNotifications = createSelector(
  selectErrorState,
  (state: ErrorState) => state.notifications
);

export const selectGlobalError = createSelector(
  selectErrorState,
  (state: ErrorState) => state.globalError
);

export const selectIsGlobalErrorVisible = createSelector(
  selectErrorState,
  (state: ErrorState) => state.isGlobalErrorVisible
);

export const selectErrorHistory = createSelector(
  selectErrorState,
  (state: ErrorState) => state.errorHistory
);

export const selectErrorSettings = createSelector(
  selectErrorState,
  (state: ErrorState) => state.settings
);

export const selectMaxHistorySize = createSelector(
  selectErrorState,
  (state: ErrorState) => state.maxHistorySize
);

// Filtered selectors
export const selectNotificationsByType = (type: 'error' | 'warning' | 'info' | 'success') => createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.type === type)
);

export const selectErrorNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.type === 'error')
);

export const selectWarningNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.type === 'warning')
);

export const selectInfoNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.type === 'info')
);

export const selectSuccessNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.type === 'success')
);

export const selectNotificationsBySource = (source: string) => createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.source === source)
);

export const selectDismissibleNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.dismissible)
);

export const selectAutoDismissNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.autoDismiss)
);

// Count selectors
export const selectNotificationCount = createSelector(
  selectAllNotifications,
  (notifications) => notifications.length
);

export const selectErrorCount = createSelector(
  selectErrorNotifications,
  (notifications) => notifications.length
);

export const selectWarningCount = createSelector(
  selectWarningNotifications,
  (notifications) => notifications.length
);

export const selectInfoCount = createSelector(
  selectInfoNotifications,
  (notifications) => notifications.length
);

export const selectSuccessCount = createSelector(
  selectSuccessNotifications,
  (notifications) => notifications.length
);

export const selectErrorHistoryCount = createSelector(
  selectErrorHistory,
  (history) => history.length
);

// Recent selectors
export const selectRecentNotifications = (count: number = 5) => createSelector(
  selectAllNotifications,
  (notifications) => notifications.slice(0, count)
);

export const selectRecentErrors = (count: number = 5) => createSelector(
  selectErrorHistory,
  (history) => history.slice(0, count)
);

// Time-based selectors
export const selectNotificationsFromToday = createSelector(
  selectAllNotifications,
  (notifications) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return notifications.filter(n => new Date(n.timestamp) >= today);
  }
);

export const selectNotificationsFromLastHour = createSelector(
  selectAllNotifications,
  (notifications) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return notifications.filter(n => new Date(n.timestamp) >= oneHourAgo);
  }
);

export const selectNotificationsFromLastDay = createSelector(
  selectAllNotifications,
  (notifications) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(n => new Date(n.timestamp) >= oneDayAgo);
  }
);

// Error history selectors
export const selectErrorHistoryFromToday = createSelector(
  selectErrorHistory,
  (history) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return history.filter(h => new Date(h.timestamp) >= today);
  }
);

export const selectErrorHistoryFromLastHour = createSelector(
  selectErrorHistory,
  (history) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return history.filter(h => new Date(h.timestamp) >= oneHourAgo);
  }
);

export const selectErrorHistoryFromLastWeek = createSelector(
  selectErrorHistory,
  (history) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return history.filter(h => new Date(h.timestamp) >= oneWeekAgo);
  }
);

// Statistics selectors
export const selectErrorStatistics = createSelector(
  selectErrorHistory,
  (history) => {
    const stats = {
      total: history.length,
      byType: {
        error: 0,
        warning: 0,
        info: 0,
        success: 0
      },
      bySource: {} as { [key: string]: number },
      byDay: {} as { [key: string]: number }
    };

    history.forEach(notification => {
      // Count by type
      stats.byType[notification.type]++;

      // Count by source
      if (notification.source) {
        stats.bySource[notification.source] = (stats.bySource[notification.source] || 0) + 1;
      }

      // Count by day
      const day = new Date(notification.timestamp).toDateString();
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
    });

    return stats;
  }
);

// Top error sources
export const selectTopErrorSources = (count: number = 5) => createSelector(
  selectErrorStatistics,
  (stats) => {
    return Object.entries(stats.bySource)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([source, count]) => ({ source, count }));
  }
);

// Most frequent errors
export const selectMostFrequentErrors = (count: number = 5) => createSelector(
  selectErrorHistory,
  (history) => {
    const errorCounts: { [key: string]: { message: string; count: number; lastOccurrence: string } } = {};

    history.forEach(notification => {
      const key = `${notification.title}:${notification.message}`;
      if (errorCounts[key]) {
        errorCounts[key].count++;
        if (new Date(notification.timestamp) > new Date(errorCounts[key].lastOccurrence)) {
          errorCounts[key].lastOccurrence = notification.timestamp;
        }
      } else {
        errorCounts[key] = {
          message: notification.message,
          count: 1,
          lastOccurrence: notification.timestamp
        };
      }
    });

    return Object.entries(errorCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, count)
      .map(([key, data]) => ({
        key,
        message: data.message,
        count: data.count,
        lastOccurrence: data.lastOccurrence
      }));
  }
);

// Notification by ID
export const selectNotificationById = (id: string) => createSelector(
  selectAllNotifications,
  (notifications) => notifications.find(n => n.id === id)
);

// Has notifications
export const selectHasNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.length > 0
);

export const selectHasErrors = createSelector(
  selectErrorNotifications,
  (notifications) => notifications.length > 0
);

export const selectHasWarnings = createSelector(
  selectWarningNotifications,
  (notifications) => notifications.length > 0
);

// Settings selectors
export const selectAutoDismissEnabled = createSelector(
  selectErrorSettings,
  (settings) => settings.autoDismiss
);

export const selectDefaultDuration = createSelector(
  selectErrorSettings,
  (settings) => settings.defaultDuration
);

export const selectMaxNotifications = createSelector(
  selectErrorSettings,
  (settings) => settings.maxNotifications
);

export const selectSoundEnabled = createSelector(
  selectErrorSettings,
  (settings) => settings.enableSound
);

export const selectVibrationEnabled = createSelector(
  selectErrorSettings,
  (settings) => settings.enableVibration
);

// Combined selectors
export const selectNotificationSummary = createSelector(
  selectNotificationCount,
  selectErrorCount,
  selectWarningCount,
  selectInfoCount,
  selectSuccessCount,
  (total, errors, warnings, infos, successes) => ({
    total,
    errors,
    warnings,
    infos,
    successes
  })
);

export const selectErrorHealthStatus = createSelector(
  selectErrorCount,
  selectWarningCount,
  selectErrorHistoryFromLastHour,
  (errorCount, warningCount, recentErrors) => {
    const recentErrorCount = (recentErrors as any[]).length;
    
    if (recentErrorCount > 10) {
      return 'critical';
    } else if (recentErrorCount > 5 || errorCount > 3) {
      return 'warning';
    } else if (warningCount > 5) {
      return 'caution';
    } else {
      return 'healthy';
    }
  }
);
