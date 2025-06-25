import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContainer from '../components/MainContainer';
import Button from '../components/Button';
import Title from '../components/Title';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { useApiAlert } from '../hooks/useApiAlert';
import { Turma } from '../types/Class';

interface Modalidade {
  id: number;
  nome: string;
}

interface ClassEnrollmentFormProps {
  onBack?: () => void;
}

const ClassEnrollmentForm: React.FC<ClassEnrollmentFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useApiAlert();
  const [selectedModalidade, setSelectedModalidade] = useState<string>('');
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [allTurmas, setAllTurmas] = useState<Turma[]>([]);
  const [selectedTurmas, setSelectedTurmas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalidadeDropdownOpen, setModalidadeDropdownOpen] = useState(false);

  // Buscar todas as turmas do backend
  const fetchAllTurmas = async () => {
    try {
      setInitialLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get<Turma[]>(`${apiUrl}/turmas`);
      setAllTurmas(response.data);
      
      // Extrair modalidades únicas das turmas
      const modalidadesUnicas = Array.from(
        new Set(response.data.map(turma => turma.modalidade))
      ).map((modalidade, index) => ({
        id: index + 1,
        nome: modalidade
      }));
      
      setModalidades(modalidadesUnicas);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      showAlert(
        'error',
        'Não foi possível carregar as turmas. Tente novamente.',
        'Erro ao Carregar',
        3000
      );
    } finally {
      setInitialLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchAllTurmas();
  }, []);

  // Função para filtrar turmas por modalidade
  const filterTurmasByModalidade = (modalidadeNome: string) => {
    setLoading(true);
    setTurmas([]);
    setSelectedTurmas([]);

    try {
      // Simula um pequeno delay para mostrar o loading
      setTimeout(() => {
        const turmasFiltradas = allTurmas.filter(turma => turma.modalidade === modalidadeNome);
        setTurmas(turmasFiltradas);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Erro ao filtrar turmas:', error);
      setLoading(false);
    }
  };

  const handleModalidadeChange = (modalidadeId: string) => {
    setSelectedModalidade(modalidadeId);
    setModalidadeDropdownOpen(false);
    if (modalidadeId) {
      const modalidadeNome = getModalidadeNome(modalidadeId);
      filterTurmasByModalidade(modalidadeNome);
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

  const handleContinuar = async () => {
    if (selectedTurmas.length === 0) {
      showAlert(
        'warning',
        'Selecione pelo menos uma turma para continuar.',
        'Seleção Necessária',
        3000
      );
      return;
    }

    if (!user?.token) {
      showAlert(
        'error',
        'Token de autenticação não encontrado. Faça login novamente.',
        'Erro de Autenticação',
        3000
      );
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Fazer inscrição para cada turma selecionada
      const inscricoes = selectedTurmas.map(async (turmaId) => {
        return axios.post(
          `${apiUrl}/user/inscricao`,
          { "turma_id": turmaId },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      // Aguardar todas as inscrições serem processadas
      await Promise.all(inscricoes);

      showAlert(
        'success',
        `Você foi inscrito com sucesso em ${selectedTurmas.length} turma(s)!`,
        'Inscrição Realizada',
        3000
      );
      
      // Limpar seleções após sucesso
      setSelectedTurmas([]);
      setSelectedModalidade('');
      setTurmas([]);
      
      navigate("/turmas")
    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          showAlert(
            'error',
            'Token de autenticação inválido. Faça login novamente.',
            'Erro de Autenticação',
            4000
          );
        } else if (error.response?.status === 400) {
          showAlert(
            'error',
            'Dados inválidos ou turma já está lotada.',
            'Erro na Inscrição',
            4000
          );
        } else if (error.response?.status === 409) {
          showAlert(
            'warning',
            'Você já está inscrito em uma ou mais turmas selecionadas.',
            'Inscrição Duplicada',
            4000
          );
        } else {
          showAlert(
            'error',
            error.response?.data?.message || 'Erro desconhecido ao realizar inscrição.',
            'Erro na Inscrição',
            4000
          );
        }
      } else {
        showAlert(
          'error',
          'Erro de conexão. Verifique sua internet e tente novamente.',
          'Erro de Conexão',
          4000
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getModalidadeNome = (id: string) => {
    return modalidades.find(m => m.id.toString() === id)?.nome || '';
  };

  const formatHorario = (horarioInicio: string, horarioFim: string) => {
    return `${horarioInicio} - ${horarioFim}`;
  };

  const formatDiasSemana = (diaSemana: string) => {
    // Se o backend retornar apenas um dia, você pode ajustar esta função
    // para lidar com múltiplos dias se necessário
    return [diaSemana];
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Se ainda está carregando os dados iniciais, mostra o componente Loading
  if (initialLoading) {
    return (
      <MainContainer>
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      </MainContainer>
    );
  }

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
                <div className="p-1 h-72 overflow-y-auto">
                  {turmas.map((turma) => (
                    <div
                      key={turma.turma_id}
                      className={`p-4 m-1 rounded border cursor-pointer transition-colors ${selectedTurmas.includes(turma.turma_id)
                        ? 'bg-yellow-100 border-yellow-300'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => handleTurmaToggle(turma.turma_id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{turma.sigla}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatHorario(turma.horario_inicio, turma.horario_fim)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDiasSemana(turma.dia_semana).join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Local: {turma.local}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            {turma.limite_inscritos} vagas disponíveis
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedTurmas.includes(turma.turma_id)
                          ? 'bg-yellow-500 border-yellow-500'
                          : 'border-gray-300'
                          }`}>
                          {selectedTurmas.includes(turma.turma_id) && (
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
            text={submitting ? 'Inscrevendo...' : 'Continuar'}
            onClick={handleContinuar}
            disabled={selectedTurmas.length === 0 || submitting}
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
                const turma = turmas.find(t => t.turma_id === turmaId);
                return turma ? (
                  <li key={turmaId} className="mb-1">
                    • {turma.sigla} - {formatHorario(turma.horario_inicio, turma.horario_fim)}
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