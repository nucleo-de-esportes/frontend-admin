// ClassForm.tsx
import { useState , useEffect} from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import MainContainer from "../components/MainContainer";
import { useAuth } from "../hooks/useAuth";
import { useApiAlert } from "../hooks/useApiAlert";
import TimeInput from "../components/TimeInput"
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/pt-br'; // Importar locale português
import ComboBox from "../components/ComboBox";
import type { ComboBoxOption } from "../components/ComboBox";
import NumberInput from "../components/NumberInput";
import ConfirmationModal from '../components/ConfirmationModal';
import DeletionModal from '../components/DeletionModal';
import { FaSave, FaTrash } from "react-icons/fa";
import Loading from '../components/Loading';
import Footer from '../components/Footer'
import Header from "../components/Header";
import Title from "../components/Title";

// Configurar dayjs para usar português brasileiro globalmente
dayjs.locale('pt-br');

const ClassForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const hasError = startTime && endTime && !startTime.isBefore(endTime);
  
  const [selectedDia, setSelectedDia] = useState<ComboBoxOption | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<ComboBoxOption | null>(null);
  const [limite, setLimite] = useState("");

  const [modalidadeOptions, setModalidadeOptions] = useState<{ value: number, label: string }[]>([]);
  const [localOptions, setLocalOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<{ value: number; label: string } | null>(null);
  const [selectedModalidade, setSelectedModalidade] = useState<{ value: number; label: string } | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [modalidadesCarregadas, setModalidadesCarregadas] = useState(false);
  const [locaisCarregados, setLocaisCarregados] = useState(false);
  const [dadosTurmaCarregados, setDadosTurmaCarregados] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false); 

  const isNadoLivre = selectedModalidade?.value === 6;

  const { user } = useAuth();
  const { id } = useParams();

  const { showAlert } = useApiAlert();

  const navigate = useNavigate();

  // Carregamento das modalidades - REMOVIDO DUPLICAÇÃO
  useEffect(() => {
    const loadModalidades = async () => {
      try {
        const response = await axios.get('/cad/mod');
        const formatted = response.data.map((mod: { modalidade_id: number; nome: string }) => ({
          value: mod.modalidade_id,
          label: mod.nome
        }));
        setModalidadeOptions(formatted);
        setModalidadesCarregadas(true);
      } catch (error) {
        console.error('Erro ao carregar modalidades:', error);
        setError("Erro ao carregar modalidades");
      }
    };

    loadModalidades();
  }, []);

  // Carregamento dos locais
  useEffect(() => {
    const loadLocais = async () => {
      try {
        const response = await axios.get('/cad/local');
        const formatted = response.data.map((loc: { local_id: number; nome: string }) => ({
          value: loc.local_id,
          label: loc.nome
        }));
        setLocalOptions(formatted);
        setLocaisCarregados(true);
      } catch (error) {
        console.error('Erro ao carregar locais:', error);
        setError("Erro ao carregar locais");
      }
    };

    loadLocais();
  }, []);

  const fetchTurmaData = async () => {
    if (!modalidadesCarregadas || !locaisCarregados) {
      return; // Aguarda carregar as opções primeiro
    }

    setLoading(true);
    setError(null);
    setDadosTurmaCarregados(false); // Reset do estado
    
    const timeout = setTimeout(() => {
      setError("Erro ao conectar com o servidor");
      setLoading(false);
    }, 10000);
  
    try {
      const response = await axios.get(`turmas/${id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      clearTimeout(timeout);
  
      const turmaData = Array.isArray(response.data) ? response.data[0] : response.data;
  
      // Definir horários - CORRIGIDO PARA USAR FORMATO CORRETO
      console.log('Dados recebidos da API:', turmaData);
      console.log('Horário início bruto:', turmaData.horario_inicio);
      console.log('Horário fim bruto:', turmaData.horario_fim);
      
      if (turmaData.horario_inicio) {
        // Usar apenas dayjs() com string no formato HH:mm atual
        const inicioTime = dayjs(`2023-01-01 ${turmaData.horario_inicio}`);
        console.log('Horário início processado:', inicioTime);
        console.log('Horário início é válido?', inicioTime.isValid());
        setStartTime(inicioTime);
      }
      if (turmaData.horario_fim) {
        const fimTime = dayjs(`2023-01-01 ${turmaData.horario_fim}`);
        console.log('Horário fim processado:', fimTime);
        console.log('Horário fim é válido?', fimTime.isValid());
        setEndTime(fimTime);
      }
  
      setLimite(turmaData.limite_inscritos.toString());
  
      // Buscar dia da semana
      const diaEncontrado = Dias.find(d => `option${d.value}` === turmaData.dia_semana);
      if (diaEncontrado) {
        setSelectedDia(diaEncontrado);
      }
  
      // Buscar modalidade - USANDO VALUE NUMÉRICO
      const modalidadeEncontrada = modalidadeOptions.find(m => 
        m.label.toLowerCase() === turmaData.modalidade.toLowerCase()
      );
      if (modalidadeEncontrada) {
        setSelectedModalidade(modalidadeEncontrada);
      }
  
      // Buscar local - USANDO VALUE NUMÉRICO
      const localEncontrado = localOptions.find(l => 
        l.label.toLowerCase() === turmaData.local.toLowerCase()
      );
      if (localEncontrado) {
        setSelectedLocal(localEncontrado);
      }
  
      setDadosTurmaCarregados(true); // Marca que os dados foram carregados
      setLoading(false);
  
    } catch (error) {
      clearTimeout(timeout);
      console.error('Erro ao carregar turma:', error);
      setError("Erro ao carregar a turma. Verifique sua conexão ou tente novamente.");
      setLoading(false);
      setDadosTurmaCarregados(false);
    }
  };
  
  // Carregamento dos dados da turma - DEPENDÊNCIAS CORRETAS
  useEffect(() => {
    if (modalidadesCarregadas && locaisCarregados && id && user?.token) {
      fetchTurmaData();
    }
  }, [modalidadesCarregadas, locaisCarregados, id, user?.token]);
  
  const Professores = [
    { value: 1, label: "Fulano da Silva" },
    { value: 2, label: "Luiz Felipe III" },
    { value: 3, label: "Ciclano" },
    { value: 4, label: "Betrano" },
  ];

  const Dias = [
    { value: 1, label: "Domingo" },
    { value: 2, label: "Segunda" },
    { value: 3, label: "Terça" },
    { value: 4, label: "Quarta" },
    { value: 5, label: "Quinta" },
    { value: 6, label: "Sexta" },
    { value: 7, label: "Sábado" },
  ];

  const handleModalidadeChange = (modalidade: { value: number; label: string } | null) => {
    setSelectedModalidade(modalidade);
    if (modalidade?.value === 6) {
      setSelectedProfessor(null);
    }
  };  

  const validateLimite = (value: string): string => {
    if (!value) {
      return "Campo obrigatório";
    }

    const num = parseInt(value);
 
    if (num < 5 || num > 30) {
      return "A quantidade de alunos deve estar entre 5 e 30";
    }

    return "";
  };

  const isFormValid = () => {
    return (
      limite &&
      !validateLimite(limite) &&
      startTime  &&
      endTime &&
      selectedDia &&
      selectedModalidade &&
      selectedLocal &&
      (isNadoLivre || selectedProfessor) &&
      !hasError
    );
  };

  const handleSave = async () => {
    const data = {
      horario_inicio: startTime?.format("HH:mm"),
      horario_fim: endTime?.format("HH:mm"),
      limite_inscritos: parseInt(limite, 10),
      dia_semana: selectedDia?.label,
      sigla: selectedModalidade?.label,
      local: selectedLocal?.label,
      professor: selectedProfessor?.label ?? "N/A",
    };

    setModalData(data);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsConfirmationModalOpen(false);
    try {
      const json = {
        horario_inicio: startTime?.format("HH:mm"),
        horario_fim: endTime?.format("HH:mm"),
        limite_inscritos: parseInt(limite, 10),
        dia_semana: selectedDia?.label,
        sigla: selectedModalidade?.label,
        local_id: selectedLocal?.value,
        modalidade_id: selectedModalidade?.value
      };

      console.log("Tentando enviar json:", json);
      await axios.put(`/turmas/${id}`, json, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      showAlert(
        'success',
        'Edição realizada com sucesso!',
        'Edição Realizada',
        2000
      )
      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao editar:", error);
      alert("Erro ao editar a turma.");
    }
  };

  const handleDelete = () => {
    const data = {
      horario_inicio: startTime?.format("HH:mm"),
      horario_fim: endTime?.format("HH:mm"),
      limite_inscritos: parseInt(limite, 10),
      dia_semana: selectedDia?.label,
      sigla: selectedModalidade?.label,
      local: selectedLocal?.label,
      professor: selectedProfessor?.label ?? "N/A",
    };

    setModalData(data);
    setIsDeletionModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeletionModalOpen(false); 
    try {
      await axios.delete(`/turmas/${id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      showAlert(
        'warning',
        'Remoção realizada com sucesso!',
        'Remoção Realizada',
        2000
      )
      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao remover turma:", error);
      alert("Erro ao remover a turma.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#E4E4E4] min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <Loading />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E4E4E4] min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="max-w-4xl mx-auto bg-white shadow-sm p-8 text-center">
            <Title title='Erro ao Carregar Turma' />
            <p className="text-red-500 mt-4">{error}</p>
            <Button
              text="Tentar Novamente"
              onClick={fetchTurmaData}
              size="md"
              className="mt-6"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <MainContainer>
      <Form title="CADASTRO DE TURMA" className="w-screen">
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full">
            <ComboBox
              label="Modalidade"
              options={modalidadeOptions}
              value={selectedModalidade}
              onChange={handleModalidadeChange}
            />
            {!isNadoLivre && (
              <ComboBox
                label="Professor"
                options={Professores}
                value={selectedProfessor}
                onChange={setSelectedProfessor}
              />
            )}
            <ComboBox
              label="Local"
              options={localOptions}
              value={selectedLocal}
              onChange={setSelectedLocal}
            />
            <div className="flex flex-row w-full justify-between">
              <TimeInput
                format="HH:mm"
                label="Horário Início"
                value={startTime}
                onChange={setStartTime}
              />
              <TimeInput
                format="HH:mm"
                label="Horário Fim"
                value={endTime}
                onChange={setEndTime}
                error={hasError? hasError : undefined}
                helperText={hasError ? "O horário de fim deve ser maior que o de início" : ""}
              />
            </div>
            <ComboBox
              label="Dias de Aula"
              options={Dias}
              value={selectedDia}
              onChange={setSelectedDia}
            />
            <NumberInput
            label="Limite de Alunos"
            value={limite}
            helperText={<span className="text-red-500">{validateLimite(limite)}</span>}
            onValueChange={(values) => {setLimite(values.value); console.log(limite)}}/>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            text="Salvar"
            onClick={handleSave}
            disabled={!isFormValid()}
            icon={FaSave}
            color="#16a34a"
            className="hover:brightness-110"
          />
          <Button
            text="Remover"
            onClick={handleDelete}
            icon={FaTrash}
            color="#dc2626"
            className="hover:brightness-80"
          />
        </div>
      </Form>

    <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmSave}
        data={modalData}
      />

      <DeletionModal
        isOpen={isDeletionModalOpen}
        onClose={() => setIsDeletionModalOpen(false)}
        onConfirm={handleConfirmDelete}
        data={modalData}
      />
    </MainContainer>
  );
};

export default ClassForm;