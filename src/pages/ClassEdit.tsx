import Input from "../components/Input";
import { Select } from "../components/Select";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios"
import React from "react";
import { useParams } from 'react-router-dom';

const ClassForm = () => {
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedDia, setSelectedDia] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [limite, setLimite] = useState("");
  const [horarioError, setHorarioError] = useState("");
  
  const [horarioInicioError, setHorarioInicioError] = useState("");
  const [horarioFimError, setHorarioFimError] = useState("");
  const [limiteError, setLimiteError] = useState("");
  
  const [shouldValidateInicio, setShouldValidateInicio] = useState(false);
  const [shouldValidateFim, setShouldValidateFim] = useState(false);
  const [shouldValidateLimite, setShouldValidateLimite] = useState(false);

  const [modalidadeOptions, setModalidadeOptions] = useState<{ value: string, label: string }[]>([]);
  const [localOptions, setLocalOptions] = useState<{ value: string, label: string }[]>([]);

  const [modalidadesCarregadas, setModalidadesCarregadas] = useState(false);
  const [locaisCarregados, setLocaisCarregados] = useState(false);

  const { id } = useParams();
  
useEffect(() => {
  if (!modalidadesCarregadas || !locaisCarregados) return;

  axios.get(`turmas/${id}`).then(response => {
    const turmaData = Array.isArray(response.data) ? response.data[0] : response.data;

    setHorarioInicio(turmaData.horario_inicio);
    setHorarioFim(turmaData.horario_fim);
    setLimite(turmaData.limite_inscritos.toString());
    setSelectedDia(turmaData.dia_semana);

    // Encontrar o ID da modalidade baseado no nome (sigla)
    const modalidade = modalidadeOptions.find(mod => mod.label === turmaData.modalidade || mod.label === turmaData.sigla);
    if (modalidade) setSelectedModalidade(modalidade.value);

    // Encontrar o ID do local baseado no nome
    const local = localOptions.find(loc => loc.label === turmaData.local);
    if (local) setSelectedLocal(local.value);

  }).catch(error => {
    console.error('Erro ao carregar turma:', error);
  });
}, [modalidadesCarregadas, locaisCarregados]);

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

  const formatTimeInput = (value: string): string => {
    const onlyDigits = value.replace(/\D/g, "");
    
    let formatted = onlyDigits;
    
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4);
    }
    
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + ":" + formatted.slice(2);
    }
    
    return formatted;
  };

  const validateTime = (time: string): boolean => {
    if (!/^([0-9]{2}):([0-9]{2})$/.test(time)) {
      return false;
    }
    
    const [hours, minutes] = time.split(":").map(Number);
    
    if (hours < 0 || hours > 23) {
      return false;
    }
    
    if (minutes < 0 || minutes > 59) {
      return false;
    }
    
    return true;
  };

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
    if (shouldValidateInicio && horarioInicio) {
      if (horarioInicio.length === 5) {
        if (!validateTime(horarioInicio)) {
          setHorarioInicioError("Horário inválido.");
        } else {
          setHorarioInicioError("");
        }
      }
    } else {
      setHorarioInicioError("");
    }

    if (shouldValidateFim && horarioFim) {
      if (horarioFim.length === 5) {
        if (!validateTime(horarioFim)) {
          setHorarioFimError("Horário inválido.");
        } else {
          setHorarioFimError("");
        }
      }
    } else {
      setHorarioFimError("");
    }
    
    if (shouldValidateInicio && shouldValidateFim && horarioInicio && horarioFim) {
      if (horarioInicio.length === 5 && horarioFim.length === 5) {
        if (validateTime(horarioInicio) && validateTime(horarioFim)) {
          const [horaInicio, minInicio] = horarioInicio.split(":").map(Number);
          const [horaFim, minFim] = horarioFim.split(":").map(Number);
          
          const inicioEmMinutos = horaInicio * 60 + minInicio;
          const fimEmMinutos = horaFim * 60 + minFim;
          
          if (fimEmMinutos <= inicioEmMinutos) {
            setHorarioError("O horário de fim deve ser maior que o horário de início");
          } else {
            setHorarioError("");
          }
        }
      }
    } else if (!horarioInicioError && !horarioFimError) {
      setHorarioError("");
    }
  }, [horarioInicio, horarioFim, shouldValidateInicio, shouldValidateFim, horarioInicioError, horarioFimError]);

  // Validação do limite
  useEffect(() => {
    if (shouldValidateLimite) {
      const error = validateLimite(limite);
      setLimiteError(error);
    } else {
      setLimiteError("");
    }
  }, [limite, shouldValidateLimite]);

  const handleSubmit = async () => {
    setShouldValidateInicio(true);
    setShouldValidateFim(true);
    setShouldValidateLimite(true);
    
    if (horarioInicio.length === 5 && !validateTime(horarioInicio)) {
      alert("Horário de início inválido. Use valores entre 00:00 e 23:59");
      return;
    }
    
    if (horarioFim.length === 5 && !validateTime(horarioFim)) {
      alert("Horário de fim inválido. Use valores entre 00:00 e 23:59");
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
      await axios.put(`/turmas/${id}`, json);
      alert("Edição realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar:", error);
      alert("Erro ao editar a turma.");
    }
  };

  const handleHorarioInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatTimeInput(rawValue);
    setHorarioInicio(formattedValue);
    
    if (rawValue !== formattedValue) {
      setHorarioInicio(formattedValue);
      if (formattedValue.length === 5) {
        setShouldValidateInicio(true);
      }
      return;
    }
    
    
    if (formattedValue.length === 5) {
      setShouldValidateInicio(true);
    } else {
      setShouldValidateInicio(false);
      setHorarioInicioError("");
    }
  };

  const handleHorarioFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatTimeInput(rawValue);
    setHorarioFim(formattedValue);
    
    if (rawValue !== formattedValue) {
      setHorarioFim(formattedValue);
      if (formattedValue.length === 5) {
        setShouldValidateFim(true);
      }
      return;
    }
    
    
    if (formattedValue.length === 5) {
      setShouldValidateFim(true);
    } else {
      setShouldValidateFim(false);
      setHorarioFimError("");
    }
  };

  const handleHorarioInicioBlur = () => {
    setShouldValidateInicio(true);
    if (horarioInicio.length !== 5 || !validateTime(horarioInicio)) {
      setHorarioInicioError("Horário inválido.");
    }
  };
  
  const handleHorarioFimBlur = () => {
    setShouldValidateFim(true);
    if (horarioFim.length !== 5 || !validateTime(horarioFim)) {
      setHorarioFimError("Horário inválido.");
    }
  };

  const handleLimiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (value.length <= 2) { // Permite apenas até 2 caracteres
      setLimite(value);
      
      // Se o usuário digitou 2 caracteres, valida automaticamente
      if (value.length === 2) {
        setShouldValidateLimite(true);
      } else {
        // Se ainda está digitando, não valida
        setShouldValidateLimite(false);
        setLimiteError("");
      }
    }
  };

  const handleLimiteBlur = () => {
    // Valida quando o campo perde o foco
    setShouldValidateLimite(true);
  };

  return (
    <>
      <div className="flex flex-col items-center bg-[#E4E4E4] min-h-screen justify-between">
        <Header />
        <Form title="CADASTRO DE TURMA" className="w-screen">

          <Select value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={modalidadeOptions} />
          <Select value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
          <Select value={selectedLocal} onChange={setSelectedLocal} label="Local" options={localOptions} />

          <div className="flex flex-col w-full">
            <p className="font-semibold text-2xl mb-2">Horário</p>
            <div className="flex flex-col w-full">
              <div className="flex flex-row flex-wrap justify-center gap-4">
                <div className="flex flex-col w-full md:max-w-2xs">
                  <Input 
                    className="w-full" 
                    value={horarioInicio} 
                    onChange={handleHorarioInicioChange}
                    onBlur={handleHorarioInicioBlur} 
                    onValidationChange={(isValid) => console.log("Início valid:", isValid)} 
                    minWidth="17rem" 
                    label="Início" 
                    placeholder="00:00" 
                  />
                  {horarioInicioError && (
                    <div className="text-red-500 text-sm mt-1">
                      {horarioInicioError}
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full md:max-w-2xs">
                  <Input 
                    className="w-full" 
                    value={horarioFim} 
                    onChange={handleHorarioFimChange}
                    onBlur={handleHorarioFimBlur} 
                    onValidationChange={(isValid) => console.log("Fim valid:", isValid)} 
                    minWidth="17rem" 
                    label="Fim" 
                    placeholder="23:59" 
                  />
                  {horarioFimError && (
                    <div className="text-red-500 text-sm mt-1">
                      {horarioFimError}
                    </div>
                  )}
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
          
          <Button text="Confirmar" onClick={handleSubmit}/>
        </Form>
        <Footer />
      </div>
    </>
  );
};

export default ClassForm;