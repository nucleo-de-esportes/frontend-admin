import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, User,  DollarSign } from 'lucide-react';

interface ModalidadePopupProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const ModalidadePopup = ({ isOpen, onClose }: ModalidadePopupProps) => {
  const [estareiPresente, setEstareiPresente] = useState(false);

  // Dados de exemplo baseados na estrutura fornecida
  const modalidadeData = {
    horario_inicio: "9:00",
    horario_fim: "10:00",
    limite_inscritos: "20",
    dia_semana: "Terça-feira",
    sigla: "ASA",
    local_id: "Asa Norte",
    modalidade_id: "Natação"
  };

  // Função para formatar o horário
  const formatarHorario = () => {
    return `${modalidadeData.dia_semana}, ${modalidadeData.horario_inicio} - ${modalidadeData.horario_fim}`;
  };

  // Função para obter próxima aula (exemplo estático)
  const getProximaAula = () => {
    return "Terça-feira, 12 de março, 9:00";
  };

  const handleSairDaTurma = () => {
    // Lógica para sair da turma
    console.log("Saindo da turma...");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Modalidade - {modalidadeData.modalidade_id || 'A'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações principais */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800 font-medium">
                {formatarHorario()}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Professor:</span> Fulano da Silva
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Mensalidade:</span> R$77,00
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Limite:</span> {modalidadeData.limite_inscritos} inscritos
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                <span className="font-medium">Local:</span> {modalidadeData.local_id}
              </span>
            </div>
          </div>

          {/* Próxima aula */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Próxima Aula:</span>
              <span className="text-gray-700">{getProximaAula()}</span>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={estareiPresente}
                  onChange={(e) => setEstareiPresente(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-700 select-none">
                  Estarei presente nessa aula
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSairDaTurma}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Sair da Turma
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de demonstração com botão para abrir o popup
const VerTurmaPopUp = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Demonstração do Pop-up Modalidade
        </h1>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Abrir Modalidade
        </button>
      </div>

      {showPopup && <ModalidadePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default VerTurmaPopUp;