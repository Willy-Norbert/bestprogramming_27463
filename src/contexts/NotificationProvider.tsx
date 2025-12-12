import React, { createContext, useContext, ReactNode } from 'react';
import { useNotification } from '@/hooks/use-notification';

interface NotificationContextType {
  showSuccess: (title: string, description: string, actions?: { primary?: { label: string; onClick: () => void }, secondary?: { label: string; onClick: () => void } }) => void;
  showError: (title: string, description: string, actions?: { primary?: { label: string; onClick: () => void }, secondary?: { label: string; onClick: () => void } }) => void;
  showInfo: (title: string, description: string, actions?: { primary?: { label: string; onClick: () => void }, secondary?: { label: string; onClick: () => void } }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showSuccess, showError, showInfo, NotificationComponent } = useNotification();

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {NotificationComponent}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

