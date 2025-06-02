import React, { useState, useEffect, useCallback } from 'react';
import { X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MessageProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  title?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const typeStyles = {
  success: { color: 'green', icon: CheckCircle2, title: 'Sucesso!' },
  error: { color: 'red', icon: AlertTriangle, title: 'Erro!' },
  warning: { color: 'yellow', icon: AlertTriangle, title: 'Atenção!' },
  info: { color: 'blue', icon: Info, title: 'Informação:' },
};

const positionMap = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

const Message: React.FC<MessageProps> = ({
  message,
  type,
  onClose,
  title,
  duration,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(!!message);
  const styles = typeStyles[type] || typeStyles.info;
  const Icon = styles.icon;

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (duration && duration > 0) {
        const timer = setTimeout(handleClose, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [message, duration, handleClose]);

  if (!message || !isVisible) return null;

  const color = styles.color;
  const bgClass = `bg-${color}-50`;
  const textClass = `text-${color}-700`;
  const borderClass = `border-${color}-300`;
  const hoverClass = `hover:bg-${color}-200`;
  const ringClass = `focus:ring-${color}-400`;

  return (
    <div
      className={`fixed ${positionMap[position]} z-50 flex items-start p-4 text-sm ${bgClass} ${textClass} border ${borderClass} rounded-lg shadow-lg max-w-md`}
      role="alert"
    >
      <Icon className="w-5 h-5 me-3 mt-0.5" />
      <div className="flex-grow">
        {(title ?? styles.title) && (
          <span className="font-semibold">{title ?? styles.title}</span>
        )}
        <span className={(title ?? styles.title) ? ' ms-1' : ''}>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className={`ms-auto -ml-2 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 ${textClass} ${hoverClass} focus:ring-2 ${ringClass} focus:outline-none`}
          onClick={handleClose}
          aria-label="Fechar"
        >
          <span className="sr-only">Fechar</span>
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Message;