import React from 'react';
import { useAlert } from '../context/AlertContext';
import { Alert } from './Alert';

export const AlertContainer: React.FC = () => {
  const { alerts } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} />
      ))}
    </div>
  );
};