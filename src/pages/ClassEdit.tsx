import Input from "../components/Input";
import { Select } from "../components/Select";
import { useState, useEffect, useRef } from "react";
import MainContainer from "../components/MainContainer";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios"
import React from "react";
import Loading from '../components/Loading';
import { useApiAlert } from "../hooks/useApiAlert";
import { useAuth } from "../hooks/useAuth";
import { useParams, useNavigate } from 'react-router-dom';
import { TimeInputRef } from "../components/TimeInput";
import { FaSave, FaTrash } from "react-icons/fa";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title'; // Assuming you have a Title component

const ClassForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // New state for error message
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedDia, setSelectedDia] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [limite, setLimite] = useState("");
  const [horarioError, setHorarioError] = useState("");
  const [horarioInicioTouched, setHorarioInicioTouched] = useState(false);
  const [horarioFimTouched, setHorarioFimTouched] = useState(false);

  const [limiteError, setLimiteError] = useState("");
  const [shouldValidateLimite, setShouldValidateLimite] = useState(false);

  const horarioInicioRef = useRef<TimeInputRef>(null);
  const horarioFimRef = useRef<TimeInputRef>(null);

  const [modalidadeOptions, setModalidadeOptions] = useState<{ value: string, label: string }[]>([]);
  const [localOptions, setLocalOptions] = useState<{ value: string, label: string }[]>([]);

  const [modalidadesCarregadas, setModalidadesCarregadas] = useState(false);
  const [locaisCarregados, setLocaisCarregados] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { showAlert } = useApiAlert();

  const fetchTurmaData = async () => {
    setLoading(true);
    setError(null); 
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

      setHorarioInicio(turmaData.horario_inicio);
      setHorarioFim(turmaData.horario_fim);
      setLimite(turmaData.limite_inscritos.toString());
      setSelectedDia(turmaData.dia_semana);

      const modalidade = modalidadeOptions.find(mod => mod.label === turmaData.modalidade || mod.label === turmaData.sigla);
      if (modalidade) setSelectedModalidade(modalidade.value);

      const local = localOptions.find(loc => loc.label === turmaData.local);
      if (local) setSelectedLocal(local.value);
      setLoading(false);

    } catch (error) {
      clearTimeout(timeout); 
      console.error('Erro ao carregar turma:', error);
      setError("Erro ao carregar a turma. Verifique sua conexão ou tente novamente.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalidadesCarregadas && locaisCarregados) {
      fetchTurmaData();
    }
  }, [modalidadesCarregadas, locaisCarregados, id, user?.token]);

  useEffect(() => {
    axios.get('/cad/mod').then(response => {
      const formatted = response.data.map((mod: { modalidade_id: number; nome: string }) => ({
        value: mod.modalidade_id.toString(),
        label: mod.nome
      }));
      setModalidadeOptions(formatted);
      setModalidadesCarregadas(true);
    });
  }, []);

  const Professores = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const isNadoLivre = () => {
    const modalidadeSelecionada = modalidadeOptions.find(mod => mod.value === selectedModalidade);
    return modalidadeSelecionada?.label.toLowerCase().includes('nado livre') || false;
  };

  const isProfessorRequired = () => {
    return selectedModalidade && !isNadoLivre();
  };

  const isFormValid = () => {
    const professorValid = isProfessorRequired() ? selectedProfessor : true;

    return (
      selectedModalidade &&
      professorValid &&
      selectedLocal &&
      selectedDia &&
      horarioInicio &&
      horarioFim &&
      !horarioError &&
      limite &&
      !validateLimite(limite)
    );
  };

  useEffect(() => {
    axios.get('/cad/local').then(response => {
      const formatted = response.data.map((loc: { local_id: number; nome: string }) => ({
        value: loc.local_id.toString(),
        label: loc.nome
      }));
      setLocalOptions(formatted);
      setLocaisCarregados(true);
    });
  }, []);

  const Dias = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const validateLimite = (value: string): string => {
    if (!value) {
      return "Campo obrigatório";
    }

    const num = parseInt(value);
    if (isNaN(num)) {
      return "Apenas números são permitidos";
    }

    if (num < 5 || num > 30) {
      return "A quantidade de alunos deve estar entre 5 e 30";
    }

    return "";
  };

  useEffect(() => {
    if (isNadoLivre()) {
      setSelectedProfessor("");
    }
  }, [selectedModalidade, modalidadeOptions]);

  useEffect(() => {
    if (!horarioInicioTouched || !horarioFimTouched) {
      return;
    }

    if (!horarioInicio || !horarioFim) {
      setHorarioError("Campo obrigatório");
      return;
    }

    const [horaInicio, minInicio] = horarioInicio.split(":").map(Number);
    const [horaFim, minFim] = horarioFim.split(":").map(Number);

    const inicioEmMinutos = horaInicio * 60 + minInicio;
    const fimEmMinutos = horaFim * 60 + minFim;

    if (fimEmMinutos <= inicioEmMinutos) {
      setHorarioError("O horário de fim deve ser maior que o horário de início");
    } else {
      setHorarioError("");
    }
  }, [horarioInicio, horarioFim, horarioInicioTouched, horarioFimTouched]);

  useEffect(() => {
    if (shouldValidateLimite) {
      const error = validateLimite(limite);
      setLimiteError(error);
    } else {
      setLimiteError("");
    }
  }, [limite, shouldValidateLimite]);

  const handleSave = async () => {
    setShouldValidateLimite(true);

    if (!horarioInicio || !horarioFim) {
      setHorarioError("Campo obrigatório");
      return;
    }

    if (horarioError) {
      alert(horarioError);
      return;
    }

    const limiteValidationError = validateLimite(limite);
    if (limiteValidationError) {
      alert(limiteValidationError);
      return;
    }

    try {
      const json = {
        horario_inicio: horarioInicio,
        horario_fim: horarioFim,
        limite_inscritos: parseInt(limite, 10),
        dia_semana: selectedDia,
        sigla: selectedModalidade,
        local_id: parseInt(selectedLocal, 10),
        modalidade_id: parseInt(selectedModalidade, 10),
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja remover esta turma? Esta ação não pode ser desfeita.");

    if (!confirmDelete) {
      return;
    }

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

  const handleLimiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setLimite(value);

      if (value.length === 2) {
        setShouldValidateLimite(true);
      } else {
        setShouldValidateLimite(false);
        setLimiteError("");
      }
    }
  };

  const handleLimiteBlur = () => {
    setShouldValidateLimite(true);
  };

  const handleInicioNavigateNext = () => {
    horarioFimRef.current?.focusStart();
  };

  const handleFimNavigatePrevious = () => {
    horarioInicioRef.current?.focusEnd();
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
              onClick={fetchTurmaData} // Call the function to re-fetch data
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
      <Form title="EDIÇÃO DE TURMA" className="w-screen">
        <Select value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={modalidadeOptions} loading={!modalidadesCarregadas}/>

        {/* Só mostra o select de professor se a modalidade estiver selecionada e não for nado livre */}
        {selectedModalidade && !isNadoLivre() && (
          <Select value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
        )}

        <Select value={selectedLocal} onChange={setSelectedLocal} label="Local" options={localOptions} loading={!locaisCarregados}/>

        <div className="flex flex-col w-full">
          <p className="font-semibold text-2xl mb-2">Horário</p>
          <div className="flex flex-col w-full">
            <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-32">
              <div className="flex flex-col w-full md:max-w-2xs">
                <label className="font-semibold text-lg mb-1">Início</label>
                <Input
                  type="time"
                  inputRef={horarioInicioRef}
                  value={horarioInicio}
                  placeholder="00:00"
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  onBlur={() => setHorarioInicioTouched(true)}
                  onNavigateNext={handleInicioNavigateNext}
                />
              </div>
              <div className="flex flex-col w-full md:max-w-2xs">
                <label className="font-semibold text-lg mb-1">Fim</label>
                <Input
                  type="time"
                  inputRef={horarioFimRef}
                  value={horarioFim}
                  placeholder="23:59"
                  onChange={(e) => setHorarioFim(e.target.value)}
                  onBlur={() => setHorarioFimTouched(true)}
                  onNavigatePrevious={handleFimNavigatePrevious}
                />
              </div>
            </div>
            {horarioError && (
              <div className="text-red-500 text-sm mt-1 w-full text-center">
                {horarioError}
              </div>
            )}
          </div>
        </div>

        <Select value={selectedDia} onChange={setSelectedDia} label="Dias de Aula" options={Dias} />

        <div className="flex flex-col w-full">
          <Input
            value={limite}
            onChange={handleLimiteChange}
            onBlur={handleLimiteBlur}
            onValidationChange={(isValid) => console.log(isValid)}
            label="Limite de Alunos"
            placeholder="Quantidade"
          />
          {limiteError && (
            <div className="text-red-500 text-sm mt-1">
              {limiteError}
            </div>
          )}
        </div>

        {/* Botões de ação */}
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
    </MainContainer>
  );
};

export default ClassForm;