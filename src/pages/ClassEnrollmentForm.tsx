import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainContainer from '../components/MainContainer';
import Button from '../components/Button';
import Title from '../components/Title';

interface Modalidade {
  id: number;
  nome: string;
}

interface Turma {
  id: number;
  nome: string;
  horario: string;
  diasSemana: string[];
  vagas: number;
}

interface ClassEnrollmentFormProps {
  onBack?: () => void;
}

const ClassEnrollmentForm: React.FC<ClassEnrollmentFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedModalidade, setSelectedModalidade] = useState<string>('');
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurmas, setSelectedTurmas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalidadeDropdownOpen, setModalidadeDropdownOpen] = useState(false);

  // Mock data para modalidades
  useEffect(() => {
    const mockModalidades: Modalidade[] = [
      { id: 1, nome: 'Futebol' },
      { id: 2, nome: 'Basquete' },
      { id: 3, nome: 'Vôlei' },
      { id: 4, nome: 'Natação' },
      { id: 5, nome: 'Tênis' },
      { id: 6, nome: 'Judô' },
    ];
    setModalidades(mockModalidades);
  }, []);

  // Função para buscar turmas quando modalidade é selecionada
  const fetchTurmas = async (modalidadeId: string) => {
    setLoading(true);
    setTurmas([]);
    setSelectedTurmas([]);

    try {
      // Simulação de API call - substitua pela sua implementação real
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay

      // Mock data das turmas baseado na modalidade
      const mockTurmas: Record<string, Turma[]> = {
        '1': [ // Futebol
          { id: 1, nome: 'Futebol A', horario: '14:00 - 15:30', diasSemana: ['Segunda', 'Quarta'], vagas: 12 },
          { id: 2, nome: 'Futebol B', horario: '15:30 - 17:00', diasSemana: ['Terça', 'Quinta'], vagas: 8 },
          { id: 3, nome: 'Futebol C', horario: '17:00 - 18:30', diasSemana: ['Segunda', 'Quarta', 'Sexta'], vagas: 5 },
        ],
        '2': [ // Basquete
          { id: 4, nome: 'Basquete B', horario: '16:00 - 17:30', diasSemana: ['Terça', 'Quinta'], vagas: 15 },
          { id: 5, nome: 'Basquete A', horario: '18:00 - 19:30', diasSemana: ['Segunda', 'Quarta'], vagas: 10 },
        ],
        '3': [ // Vôlei
          { id: 6, nome: 'Vôlei A', horario: '19:00 - 20:30', diasSemana: ['Terça', 'Quinta'], vagas: 18 },
          { id: 7, nome: 'Vôlei B', horario: '17:00 - 18:30', diasSemana: ['Segunda', 'Sexta'], vagas: 14 },
        ],
        '4': [ // Natação
          { id: 8, nome: 'Natação A', horario: '07:00 - 08:00', diasSemana: ['Segunda', 'Quarta', 'Sexta'], vagas: 20 },
          { id: 9, nome: 'Natação B', horario: '18:00 - 19:00', diasSemana: ['Terça', 'Quinta'], vagas: 12 },
        ],
        '5': [ // Tênis
          { id: 10, nome: 'Tênis Individual', horario: '15:00 - 16:00', diasSemana: ['Segunda', 'Quarta'], vagas: 8 },
        ],
        '6': [ // Judô
          { id: 11, nome: 'Judô B', horario: '16:00 - 17:00', diasSemana: ['Terça', 'Quinta'], vagas: 16 },
          { id: 12, nome: 'Judô A', horario: '19:00 - 20:30', diasSemana: ['Segunda', 'Quarta', 'Sexta'], vagas: 12 },
        ],
      };

      const turmasData = mockTurmas[modalidadeId] || [];
      setTurmas(turmasData);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      // Aqui você pode adicionar tratamento de erro, como mostrar uma mensagem para o usuário
    } finally {
      setLoading(false);
    }
  };

  const handleModalidadeChange = (modalidadeId: string) => {
    setSelectedModalidade(modalidadeId);
    setModalidadeDropdownOpen(false);
    if (modalidadeId) {
      fetchTurmas(modalidadeId);
    } else {
      setTurmas([]);
      setSelectedTurmas([]);
    }
  };

  const handleTurmaToggle = (turmaId: number) => {
    setSelectedTurmas(prev =>
      prev.includes(turmaId)
        ? prev.filter(id => id !== turmaId)
        : [...prev, turmaId]
    );
  };

  const handleContinuar = () => {
    if (selectedTurmas.length === 0) {
      alert('Por favor, selecione pelo menos uma turma.');
      return;
    }

    const dadosCadastro = {
      modalidadeId: selectedModalidade,
      turmasIds: selectedTurmas,
    };

    console.log('Dados do cadastro:', dadosCadastro);
    alert(`Cadastro realizado com sucesso! Turmas selecionadas: ${selectedTurmas.length}`);
  };

  const getModalidadeNome = (id: string) => {
    return modalidades.find(m => m.id.toString() === id)?.nome || '';
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <MainContainer>
      <div className="w-full h-full p-8 md:px-36">
        {/* Header with back button */}
        <div className="flex items-start flex-col mb-8">
          <button
            onClick={handleGoBack}
            className="mr-4 p-2 hover:bg-gray-200 cursor-pointer rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Title title='REGISTRO EM TURMA' className='w-full text-center'/>
        </div>

        <div className="space-y-6">
          {/* Modalidade Dropdown */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Modalidade
            </label>
            <div className="relative">
              <button
                onClick={() => setModalidadeDropdownOpen(!modalidadeDropdownOpen)}
                className="w-full bg-gray-200 border border-gray-300 rounded-md px-4 py-3 text-left flex items-center justify-between hover:bg-gray-300 cursor-pointer transition-colors"
              >
                <span className={selectedModalidade ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedModalidade ? getModalidadeNome(selectedModalidade) : 'Selecione uma modalidade'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${modalidadeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {modalidadeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleModalidadeChange('')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-500"
                  >
                    Selecione uma modalidade
                  </button>
                  {modalidades.map((modalidade) => (
                    <button
                      key={modalidade.id}
                      onClick={() => handleModalidadeChange(modalidade.id.toString())}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer text-gray-900 border-t border-gray-100"
                    >
                      {modalidade.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Turmas disponíveis */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Turmas disponíveis
            </label>
            <div className="bg-gray-200 border border-gray-300 rounded-md min-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              ) : turmas.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  {selectedModalidade ? 'Nenhuma turma disponível' : 'Selecione uma modalidade primeiro'}
                </div>
              ) : (
                <div className="p-1">
                  {turmas.map((turma) => (
                    <div
                      key={turma.id}
                      className={`p-4 m-1 rounded border cursor-pointer transition-colors ${selectedTurmas.includes(turma.id)
                        ? 'bg-yellow-100 border-yellow-300'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => handleTurmaToggle(turma.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{turma.nome}</h3>
                          <p className="text-sm text-gray-600 mt-1">{turma.horario}</p>
                          <p className="text-sm text-gray-600">{turma.diasSemana.join(', ')}</p>
                          <p className="text-sm text-green-600 mt-1">
                            {turma.vagas} vagas disponíveis
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedTurmas.includes(turma.id)
                          ? 'bg-yellow-500 border-yellow-500'
                          : 'border-gray-300'
                          }`}>
                          {selectedTurmas.includes(turma.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            text='Continuar'
            onClick={handleContinuar}
            disabled={selectedTurmas.length === 0}
            />
        </div>

        {/* Selected turmas summary */}
        {selectedTurmas.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-200">
            <h3 className="font-medium text-yellow-900 mb-2">
              Turmas selecionadas ({selectedTurmas.length}):
            </h3>
            <ul className="text-sm text-yellow-800">
              {selectedTurmas.map(turmaId => {
                const turma = turmas.find(t => t.id === turmaId);
                return turma ? (
                  <li key={turmaId} className="mb-1">
                    • {turma.nome} - {turma.horario}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default ClassEnrollmentForm;