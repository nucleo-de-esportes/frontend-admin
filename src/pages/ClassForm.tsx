import Input from "../components/Input";
import { Select } from "../components/Select";
import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios"
import React from "react";
import { useNavigate } from 'react-router-dom';
import MainContainer from "../components/MainContainer";
import { TimeInputRef } from "../components/TimeInput";
import { useAuth } from "../hooks/useAuth";
import { useApiAlert } from "../hooks/useApiAlert";

const ClassForm = () => {
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

  const [modalidadesLoading, setModalidadesLoading] = useState(true);
  const [locaisLoading, setLocaisLoading] = useState(true);

  const horarioInicioRef = useRef<TimeInputRef>(null);
  const horarioFimRef = useRef<TimeInputRef>(null);

  const [modalidadeOptions, setModalidadeOptions] = useState<{ value: string, label: string }[]>([]);
  const [localOptions, setLocalOptions] = useState<{ value: string, label: string }[]>([]);

  const { user } = useAuth();

  const { showAlert } = useApiAlert();

  const navigate = useNavigate();

  useEffect(() => {
    setModalidadesLoading(true);
    axios.get<{ modalidade_id: number; nome: string; valor: number }[]>('/cad/mod')
      .then(response => {
        const formatted = response.data.map(mod => ({
          value: mod.modalidade_id.toString(),
          label: mod.nome
        }));
        setModalidadeOptions(formatted);
      })
      .catch(error => {
        console.error('Erro ao carregar modalidades:', error);
      })
      .finally(() => {
        setModalidadesLoading(false);
      });
  }, []);

  useEffect(() => {
    setLocaisLoading(true);
    axios.get<{ local_id: number; nome: string; campus: string }[]>('/cad/local')
      .then(response => {
        const formatted = response.data.map(loc => ({
          value: loc.local_id.toString(),
          label: loc.nome
        }));
        setLocalOptions(formatted);
      })
      .catch(error => {
        console.error('Erro ao carregar locais:', error);
      })
      .finally(() => {
        setLocaisLoading(false); 
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

  const handleSubmit = async () => {
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
        // Assuming 'sigla' is derived from selectedModalidade, you might need to adjust this based on your backend
        sigla: modalidadeOptions.find(opt => opt.value === selectedModalidade)?.label || '', 
        local_id: parseInt(selectedLocal, 10),
        modalidade_id: parseInt(selectedModalidade, 10),
      };

      console.log("Tentando enviar json:", json);
      await axios.post("/turmas", json,{
    headers: {
      'Authorization': `Bearer ${user?.token}`
    }
  });
      showAlert(
        'success', 
        'Cadastro realizado com sucesso!', 
        'Cadastro Realizado',
        2000
      )
      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar a turma.");
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

  return (
    <MainContainer>
      <Form title="CADASTRO DE TURMA" className="w-screen">

        <Select 
          value={selectedModalidade} 
          onChange={setSelectedModalidade} 
          label="Modalidade" 
          options={modalidadeOptions}
          loading={modalidadesLoading} // Spinner in dropdown while loading and open
        />
        
        {/* Só mostra o select de professor se a modalidade estiver selecionada e não for nado livre */}
        {selectedModalidade && !isNadoLivre() && (
          <Select value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
        )}
        
        <Select 
          value={selectedLocal} 
          onChange={setSelectedLocal} 
          label="Local" 
          options={localOptions}
          loading={locaisLoading} // Spinner in dropdown while loading and open
        />

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

        <Button text="Cadastrar" onClick={handleSubmit} disabled={!isFormValid()} />
      </Form>
    </MainContainer>
  );
};

export default ClassForm;