// ConfirmationModal.tsx
import React from 'react';
import Button from './Button'; // Assuming you have a Button component

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    sigla: string;
    professor?: string;
    local: string;
    dia_semana: string;
    horario_inicio: string;
    horario_fim: string;
    limite_inscritos: number;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#BF0087] hover:text-[#43054E] text-2xl font-bold"
          aria-label="Fechar"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-[#43054E]">{data.sigla} - A</h2> 
        <div className="space-y-2 mb-8 mt-8">
          <p>Asa Norte, {data.dia_semana} {data.horario_inicio} - {data.horario_fim} </p>
          {data.professor && data.sigla?.toLowerCase() !== "nado livre" && (
            <p><strong>Professor:</strong> {data.professor}</p>
          )}
          <p><strong>Limite de Alunos:</strong> {data.limite_inscritos}</p>
        </div>
        <div className="flex justify-center">
          <Button text="Confirmar" onClick={onConfirm} className="w-auto max-w-xs mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;