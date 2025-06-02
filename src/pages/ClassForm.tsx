import Input from "../components/Input";
import { Select } from "../components/Select";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios"
import React from "react";
import MainContainer from "../components/MainContainer";

const ClassForm = () => {
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedDia, setSelectedDia] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [limite, setLimite] = useState("");
  const [horarioError, setHorarioError] = useState("");

  const [limiteError, setLimiteError] = useState("");

  const [shouldValidateLimite, setShouldValidateLimite] = useState(false);

  const [modalidadeOptions, setModalidadeOptions] = useState<{ value: string, label: string }[]>([]);
  const [localOptions, setLocalOptions] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
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
      });
  }, []);

  const Professores = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  useEffect(() => {
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
  }, [horarioInicio, horarioFim]);

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
        sigla: selectedModalidade,
        local_id: parseInt(selectedLocal, 10),
        modalidade_id: parseInt(selectedModalidade, 10),
      };

      console.log("Tentando enviar json:", json);
      await axios.post("/turmas", json);
      alert("Cadastro realizado com sucesso!");
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

  return (
    <MainContainer>
      <Form title="CADASTRO DE TURMA" className="w-screen">

        <Select value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={modalidadeOptions} />
        <Select value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
        <Select value={selectedLocal} onChange={setSelectedLocal} label="Local" options={localOptions} />

        <div className="flex flex-col w-full">
          <p className="font-semibold text-2xl mb-2">Horário</p>
          <div className="flex flex-col w-full">
            <div className="flex flex-row flex-wrap justify-center gap-20">
              <div className="flex flex-col w-full md:max-w-2xs">
              <Input type="time" value={horarioInicio} placeholder="00:00" onChange={(e) => setHorarioInicio(e.target.value)}/>
              </div>
              <div className="flex flex-col w-full md:max-w-2xs">
              <Input type="time" value={horarioFim} placeholder="23:59" onChange={(e) => setHorarioFim(e.target.value)}/>
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

        <Button text="Confirmar" onClick={handleSubmit} />
      </Form>
    </MainContainer>
  );
};

export default ClassForm;