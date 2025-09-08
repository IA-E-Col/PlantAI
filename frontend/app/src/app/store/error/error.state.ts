export interface ErrorNotification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  details?: string;
  timestamp: string;
  source?: string; // Component or service that generated the error
  action?: {
    label: string;
    handler: () => void;
  };
  dismissible: boolean;
  autoDismiss?: boolean;
  duration?: number; // Auto-dismiss duration in milliseconds
}

export interface ErrorState {
  notifications: ErrorNotification[];
  globalError: string | null;
  isGlobalErrorVisible: boolean;
  errorHistory: ErrorNotification[];
  maxHistorySize: number;
  settings: {
    autoDismiss: boolean;
    defaultDuration: number;
    maxNotifications: number;
    enableSound: boolean;
    enableVibration: boolean;
  };
}

export const initialErrorState: ErrorState = {
  notifications: [],
  globalError: null,
  isGlobalErrorVisible: false,
  errorHistory: [],
  maxHistorySize: 100,
  settings: {
    autoDismiss: true,
    defaultDuration: 5000, // 5 seconds
    maxNotifications: 5,
    enableSound: false,
    enableVibration: false
  }
};
