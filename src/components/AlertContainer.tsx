import React from 'react';
import { useAlert } from '../context/AlertContext';
import { Alert } from './Alert';

export const AlertContainer: React.FC = () => {
  const { alerts } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 z-50 space-y-2 max-w-md 
                    w-[calc(100%-2rem)] left-1/2 -translate-x-1/2 
                    sm:w-full sm:left-auto sm:translate-x-0 sm:right-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} />
      ))}
    </div>
  );
};