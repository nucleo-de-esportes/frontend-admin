// DeletionModal.tsx
import React from 'react';
import Button from './Button'; // Assuming you have a Button component

interface DeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    modalidade: string;
    professor?: string; // Optional if Nado Livre
    local: string;
    dia: string;
    horarioInicio: string;
    horarioFim: string;
    limite: string;
  };
}

const DeletionModal: React.FC<DeletionModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
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

        <h2 className="text-2xl font-bold mb-4 text-center text-[#43054E]">Tem certeza que deseja remover esta turma?</h2> {/* Changed text here */}
        
        {/* You can still display the class details if you want, similar to ConfirmationModal */}
        <div className="space-y-2 mb-8 mt-8">
          <p>Asa Norte, {data.dia} {data.horarioInicio} - {data.horarioFim} </p>
          {data.professor && <p><strong>Professor:</strong> {data.professor}</p>}
          <p><strong>Mensalidade:</strong> R$77,00</p>
        </div>
        <div className="flex justify-center">
          <Button text="Remover" onClick={onConfirm} className="w-auto max-w-xs mx-auto bg-red-600 hover:bg-red-700" /> {/* Changed text and added red color */}
        </div>
      </div>
    </div>
  );
};

export default DeletionModal;