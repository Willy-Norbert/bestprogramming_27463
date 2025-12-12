import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, WifiOff, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    const baseSize = "w-24 h-24";
    switch (type) {
      case 'success':
        return (
          <div className="relative">
            <div className={`${baseSize} bg-green-100 flex items-center justify-center`}>
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="relative">
            <div className={`${baseSize} bg-red-100 flex items-center justify-center`}>
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>
        );
      case 'warning':
        return (
          <div className="relative">
            <div className={`${baseSize} bg-yellow-100 flex items-center justify-center`}>
              <AlertCircle className="w-16 h-16 text-yellow-600" />
            </div>
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className={`${baseSize} bg-blue-100 flex items-center justify-center`}>
              <Info className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white p-8 max-w-md w-full border-2 border-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="flex-1 border-2 border-border bg-white text-foreground hover:bg-accent"
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction ? (
            <Button
              onClick={primaryAction.onClick}
              className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              {primaryAction.label}
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              OK
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

