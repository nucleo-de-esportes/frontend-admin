import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Alert, AlertContextType } from '../types/Alert';

type AlertAction =
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'CLEAR_ALERTS' };

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const alertReducer = (state: Alert[], action: AlertAction): Alert[] => {
  switch (action.type) {
    case 'ADD_ALERT':
      return [...state, action.payload];
    case 'REMOVE_ALERT':
      return state.filter(alert => alert.id !== action.payload);
    case 'CLEAR_ALERTS':
      return [];
    default:
      return state;
  }
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, dispatch] = useReducer(alertReducer, []);

  const addAlert = (alertData: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const alert: Alert = {
      id,
      closable: true,
      duration: 5000, // 5 segundos por padrão
      ...alertData,
    };

    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  const removeAlert = (id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
  };

  const clearAlerts = () => {
    dispatch({ type: 'CLEAR_ALERTS' });
  };

  const value: AlertContextType = {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert deve ser usado dentro de um AlertProvider');
  }
  return context;
};