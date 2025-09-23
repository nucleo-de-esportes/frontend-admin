// ConfirmationModal.tsx
import React from 'react';
import Button from './Button'; // Assuming you have a Button component

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    modalidade: string;
    professor?: string; 
    local: string;
    dia: string;
    horarioInicio: string;
    horarioFim: string;
    limite: string;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen) return null;

  return (
    // Alterado bg-black bg-opacity-50 para bg-black/50 (funcionalmente o mesmo, mas mais conciso em Tailwind)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          // Alterado text-gray-500 hover:text-gray-700 para text-purple-600 hover:text-purple-800
          className="absolute top-3 right-3 text-[#BF0087] hover:text-[#43054E] text-2xl font-bold"
          aria-label="Fechar"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-[#43054E]">{data.modalidade} - A</h2> {/* This might be dynamic based on your data */}
        <div className="space-y-2 mb-8 mt-8">
          <p>Asa Norte, {data.dia} {data.horarioInicio} - {data.horarioFim} </p>
          {data.professor && <p><strong>Professor:</strong> {data.professor}</p>}
          <p><strong>Mensalidade:</strong> R$77,00</p>
        </div>
        <div className="flex justify-center">
          <Button text="Confirmar" onClick={onConfirm} className="w-auto max-w-xs mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;