import { createContext } from 'react';

export interface AlertData {
  type: string;
  title: string;
  description: string;
  issuedAt: Date;
}

export interface AlertContextValue {
  alert: AlertData | null;
  isAlertVisible: boolean;
  hasUnreadNotification: boolean;
  closeAlert: () => void;
  markAlertAsRead: () => void;
}

export const AlertContext = createContext<AlertContextValue | undefined>(
  undefined,
);
