import { useState, useCallback } from 'react';
import { NotificationModal } from '@/components/NotificationModal';

interface NotificationOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showNotification = useCallback((options: NotificationOptions) => {
    setNotification(options);
    setIsOpen(true);
  }, []);

  const hideNotification = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setNotification(null), 300);
  }, []);

  const showSuccess = useCallback((title: string, description: string, actions?: { primary?: { label: string; onClick: () => void }, secondary?: { label: string; onClick: () => void } }) => {
    showNotification({
      type: 'success',
      title,
      description,
      primaryAction: actions?.primary,
      secondaryAction: actions?.secondary,
    });
  }, [showNotification]);

  const showError = useCallback((title: string, description: string, actions?: { primary?: { label: string; onClick: () => void }, secondary?: { label: string; onClick: () => void } }) => {
    showNotification({
      type: 'error',
      title,
      description,
      primaryAction: actions?.primary,
      secondaryAction: actions?.secondary,
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, description: string, actions?: { primary?: { label: string; onClick: () => void }, secondary?: { label: string; onClick: () => void } }) => {
    showNotification({
      type: 'info',
      title,
      description,
      primaryAction: actions?.primary,
      secondaryAction: actions?.secondary,
    });
  }, [showNotification]);

  const NotificationComponent = notification ? (
    <NotificationModal
      isOpen={isOpen}
      onClose={hideNotification}
      type={notification.type}
      title={notification.title}
      description={notification.description}
      primaryAction={notification.primaryAction}
      secondaryAction={notification.secondaryAction}
    />
  ) : null;

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    hideNotification,
    NotificationComponent,
  };
};

