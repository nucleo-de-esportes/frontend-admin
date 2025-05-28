import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FiltroDeTurmasProps {
    turmas?: Turma[];
    onChange?: (turmasFiltradas: Turma[]) => void;
    hideButton?: boolean; 
    isOpen?: boolean; 
    onToggleFilter?: (isOpen: boolean) => void; 
  }

interface Turma {
  turma_id: number;
  horario_inicio: string;
  horario_fim: string;
  limite_inscritos: number;
  dia_semana: string;
  sigla: string;
  local: string;
  modalidade: string;
}

const turmasExemplo: Turma[] = [
  { turma_id: 1, horario_inicio: '08:00', horario_fim: '09:30', limite_inscritos: 25, dia_semana: 'Segunda', sigla: 'MAT101', local: 'Sala 101', modalidade: 'Presencial' },
  { turma_id: 2, horario_inicio: '10:00', horario_fim: '11:30', limite_inscritos: 20, dia_semana: 'Terça', sigla: 'FIS202', local: 'Laboratório', modalidade: 'Híbrida' },
  { turma_id: 3, horario_inicio: '13:00', horario_fim: '14:30', limite_inscritos: 30, dia_semana: 'Quarta', sigla: 'PORT103', local: 'Sala 203', modalidade: 'Online' },
  { turma_id: 4, horario_inicio: '15:00', horario_fim: '16:30', limite_inscritos: 40, dia_semana: 'Quinta', sigla: 'HIST104', local: 'Auditório', modalidade: 'Presencial' },
  { turma_id: 5, horario_inicio: '17:00', horario_fim: '18:30', limite_inscritos: 25, dia_semana: 'Sexta', sigla: 'GEO105', local: 'Sala 101', modalidade: 'Online' },
];

function FiltroDeTurmas({ 
  turmas = [] as Turma[], 
  onChange, 
  isOpen, 
  onToggleFilter 
}: FiltroDeTurmasProps) {
  const [filtroAbertoInterno, setFiltroAbertoInterno] = useState(false);
  const filtroAberto = isOpen !== undefined ? isOpen : filtroAbertoInterno;
  const setFiltroAberto = (estado: boolean) => {
    if (onToggleFilter) {
      onToggleFilter(estado);
    } else {
      setFiltroAbertoInterno(estado);
    }
  };

    useEffect(() => {
      const handleToggleFiltro = () => {
        setFiltroAberto(!filtroAberto);
      };
      
      document.addEventListener('toggleFiltro', handleToggleFiltro);
      
      return () => {
        document.removeEventListener('toggleFiltro', handleToggleFiltro);
      };
    }, [filtroAberto]);
  
  const [turmasFiltradas, setTurmasFiltradas] = useState<Turma[]>(turmas);
  
  type FiltroCategorias = 'dias_semana' | 'locais' | 'modalidades' | 'siglas' | 'faixas_horario' | 'capacidades';

  interface FaixaHorario {
    label: string;
    inicio: string;
    fim: string;
  }

  interface FaixaCapacidade {
    label: string;
    min: number;
    max: number;
  }

  interface FiltroOptions {
    dias_semana: string[];
    locais: string[];
    modalidades: string[];
    siglas: string[];
    faixas_horario: string[];
    capacidades: string[];
  }

  const faixasHorarioPredefinidas: FaixaHorario[] = [
    { label: 'Manhã (08:00 - 12:00)', inicio: '08:00', fim: '12:00' },
    { label: 'Tarde (12:01 - 18:00)', inicio: '12:01', fim: '18:00' },
    { label: 'Noite (18:01 - 22:00)', inicio: '18:01', fim: '22:00' }
  ];

  const faixasCapacidadePredefinidas: FaixaCapacidade[] = [
    { label: 'Pequena (até 20)', min: 0, max: 20 },
    { label: 'Média (21-30)', min: 21, max: 30 },
    { label: 'Grande (31+)', min: 31, max: 999 }
  ];

  const dadosParaFiltro = turmas.length > 0 ? turmas : turmasExemplo;

  const opcoesUnicas: FiltroOptions = {
    dias_semana: [...new Set(dadosParaFiltro.map(t => t.dia_semana))],
    locais: [...new Set(dadosParaFiltro.map(t => t.local))],
    modalidades: [...new Set(dadosParaFiltro.map(t => t.modalidade))],
    siglas: [...new Set(dadosParaFiltro.map(t => t.sigla))],
    faixas_horario: faixasHorarioPredefinidas.map(fh => fh.label),
    capacidades: faixasCapacidadePredefinidas.map(fc => fc.label)
  };

  const [filtros, setFiltros] = useState<FiltroOptions>({
    dias_semana: [],
    locais: [],
    modalidades: [],
    siglas: [],
    faixas_horario: [],
    capacidades: []
  });

  const horarioEstaNaFaixa = (horarioInicio: string, horarioFim: string, faixaLabel: string): boolean => {
    const faixa = faixasHorarioPredefinidas.find(f => f.label === faixaLabel);
    if (!faixa) return false;
    
    const converterParaMinutos = (hora: string): number => {
      const horaFormatada = hora.replace('h', ':');
      const [horas, minutos] = horaFormatada.split(':').map(Number);
      return horas * 60 + minutos;
    };
    
    const inicioTurmaMinutos = converterParaMinutos(horarioInicio);
    const fimTurmaMinutos = converterParaMinutos(horarioFim);
    const inicioFaixaMinutos = converterParaMinutos(faixa.inicio);
    const fimFaixaMinutos = converterParaMinutos(faixa.fim);
    
    return (
      (inicioTurmaMinutos >= inicioFaixaMinutos && inicioTurmaMinutos <= fimFaixaMinutos) ||
      (fimTurmaMinutos >= inicioFaixaMinutos && fimTurmaMinutos <= fimFaixaMinutos) ||
      (inicioTurmaMinutos <= inicioFaixaMinutos && fimTurmaMinutos >= fimFaixaMinutos)
    );
  };

  const capacidadeEstaNaFaixa = (capacidade: number, faixaLabel: string): boolean => {
    const faixa = faixasCapacidadePredefinidas.find(f => f.label === faixaLabel);
    if (!faixa) return false;
    
    return capacidade >= faixa.min && capacidade <= faixa.max;
  };

  useEffect(() => {
    if (turmas.length === 0) {
      setTurmasFiltradas([]);
      return;
    }
    
    let resultado = turmas;
    
    if (filtros.dias_semana.length > 0) {
      resultado = resultado.filter(t => filtros.dias_semana.includes(t.dia_semana));
    }
    
    if (filtros.siglas.length > 0) {
      resultado = resultado.filter(t => filtros.siglas.includes(t.sigla));
    }
    
    if (filtros.locais.length > 0) {
      resultado = resultado.filter(t => filtros.locais.includes(t.local));
    }
    
    if (filtros.modalidades.length > 0) {
      resultado = resultado.filter(t => filtros.modalidades.includes(t.modalidade));
    }
    
    if (filtros.faixas_horario.length > 0) {
      resultado = resultado.filter(t => 
        filtros.faixas_horario.some(faixa => 
          horarioEstaNaFaixa(t.horario_inicio, t.horario_fim, faixa)
        )
      );
    }
    
    if (filtros.capacidades.length > 0) {
      resultado = resultado.filter(t => 
        filtros.capacidades.some(faixa => 
          capacidadeEstaNaFaixa(t.limite_inscritos, faixa)
        )
      );
    }
    
    setTurmasFiltradas(resultado);

    if (onChange) {
        onChange(resultado);
      }
  }, [filtros, turmas]);

  const toggleFiltro = (categoria: FiltroCategorias, valor: string): void => {
    setFiltros(prevFiltros => {
      const novosFiltros = { ...prevFiltros };
      
      if (novosFiltros[categoria].includes(valor)) {
        novosFiltros[categoria] = novosFiltros[categoria].filter(item => item !== valor);
      } else {
        novosFiltros[categoria] = [...novosFiltros[categoria], valor];
      }
      
      return novosFiltros;
    });
  };

  const limparFiltros = () => {
    setFiltros({
      dias_semana: [],
      locais: [],
      modalidades: [],
      siglas: [],
      faixas_horario: [],
      capacidades: []
    });
  };

  return (
    <div className="w-full">

      <div className={`transition-all duration-300 overflow-hidden ${filtroAberto ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <div className="flex gap-2">
              <button 
                onClick={limparFiltros}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar filtros
              </button>
              <button 
                onClick={() => setFiltroAberto(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Siglas</h3>
              <div className="flex flex-wrap gap-2">
                {opcoesUnicas.siglas.map((sigla: string) => (
                  <button
                    key={sigla}
                    onClick={() => toggleFiltro('siglas', sigla)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      filtros.siglas.includes(sigla)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {sigla}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Dias da Semana</h3>
              <div className="flex flex-wrap gap-2">
                {opcoesUnicas.dias_semana.map((dia: string) => (
                  <button
                    key={dia}
                    onClick={() => toggleFiltro('dias_semana', dia)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      filtros.dias_semana.includes(dia)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Locais</h3>
              <div className="flex flex-wrap gap-2">
                {opcoesUnicas.locais.map((local: string) => (
                  <button
                    key={local}
                    onClick={() => toggleFiltro('locais', local)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      filtros.locais.includes(local)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {local}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Modalidades</h3>
              <div className="flex flex-wrap gap-2">
                {opcoesUnicas.modalidades.map((modalidade: string) => (
                  <button
                    key={modalidade}
                    onClick={() => toggleFiltro('modalidades', modalidade)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      filtros.modalidades.includes(modalidade)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {modalidade}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Horários</h3>
              <div className="flex flex-wrap gap-2">
                {opcoesUnicas.faixas_horario.map((faixa: string) => (
                  <button
                    key={faixa}
                    onClick={() => toggleFiltro('faixas_horario', faixa)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      filtros.faixas_horario.includes(faixa)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {faixa}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Capacidade</h3>
              <div className="flex flex-wrap gap-2">
                {opcoesUnicas.capacidades.map((capacidade: string) => (
                  <button
                    key={capacidade}
                    onClick={() => toggleFiltro('capacidades', capacidade)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      filtros.capacidades.includes(capacidade)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {capacidade}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {Object.entries(filtros).some(([_, valores]) => valores.length > 0) && (
            <div className="mt-4 pt-3 border-t border-gray-300">
              <h3 className="font-medium mb-2">Filtros aplicados:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filtros).map(([categoria, valores]) =>
                  valores.map((valor: string) => (
                    <div 
                      key={`${categoria}-${valor}`}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {valor}
                      <button 
                        onClick={() => toggleFiltro(categoria as FiltroCategorias, valor)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {turmasFiltradas.length === 0 && (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">Nenhuma turma encontrada com os filtros selecionados.</p>
          <button 
            onClick={limparFiltros}
            className="text-blue-600 hover:text-blue-800 mt-2"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default FiltroDeTurmas;