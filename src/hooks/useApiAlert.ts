import { useAlert } from '../context/AlertContext';
import { AlertType } from '../types/Alert';

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export const useApiAlert = () => {
  const { addAlert } = useAlert();

  const handleApiResponse = (response: ApiResponse, successMessage?: string) => {
    if (response.success) {
      addAlert({
        type: 'success',
        message: successMessage || response.message || 'Operação realizada com sucesso!',
      });
    } else {
      addAlert({
        type: 'error',
        message: response.error || response.message || 'Ocorreu um erro inesperado.',
      });
    }
  };

  const showAlert = (type: AlertType, message: string, title?: string, duration?: number) => {
    addAlert({
      type,
      message,
      title,
      duration,
    });
  };

  return {
    handleApiResponse,
    showAlert,
  };
};