import Input from "../components/Input";
import { z } from "zod";
import { Select } from "../components/Select";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios"
import React from "react";

const ClassForm = () => {
  const limiteSchema = z.string().regex(/^\d*$/, "Apenas números são permitidos").max(2).refine(value => parseInt(value) >= 0 && parseInt(value) <= 30, "A quantidade de alunos deve estar entre 0 e 30");
  
  // Esquema de validação aprimorado para horários
  const horaSchema = z.string()
    .refine(value => value === "" || /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message: "Formato de hora inválido.",
    });

  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedDia, setSelectedDia] = useState("");
  const [mensalidade, setMensalidade] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [limite, setLimite] = useState("");
  const [horarioError, setHorarioError] = useState("");
  
  // Estados para controlar erros específicos de cada campo de horário
  const [horarioInicioError, setHorarioInicioError] = useState("");
  const [horarioFimError, setHorarioFimError] = useState("");
  
  // Estados para controlar a validação
  const [shouldValidateInicio, setShouldValidateInicio] = useState(false);
  const [shouldValidateFim, setShouldValidateFim] = useState(false);

  const Modalidades = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const Professores = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const Locais = [
    { value: "1", label: "Opção 1" },
    { value: "2", label: "Opção 2" },
    { value: "3", label: "Opção 3" },
    { value: "4", label: "Opção 4" },
  ];

  const Dias = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const campusOptions = [
    { value: "1", label: "Asa Norte" },
    { value: "2", label: "Taguatinga" },
  ];

  // Função de máscara para o formato HH:MM
  const formatTimeInput = (value: string): string => {
    // Remove tudo que não for dígito, preservando o valor original
    const onlyDigits = value.replace(/\D/g, "");
    
    // Formata para o padrão HH:MM
    let formatted = onlyDigits;
    
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4);
    }
    
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + ":" + formatted.slice(2);
    }
    
    return formatted;
  };

  // Função para validar se um horário está no formato e intervalo correto
  const validateTime = (time: string): boolean => {
    // Verifica se o formato está correto (HH:MM)
    if (!/^([0-9]{2}):([0-9]{2})$/.test(time)) {
      return false;
    }
    
    const [hours, minutes] = time.split(":").map(Number);
    
    // Verifica se as horas estão entre 0 e 23
    if (hours < 0 || hours > 23) {
      return false;
    }
    
    // Verifica se os minutos estão entre 0 e 59
    if (minutes < 0 || minutes > 59) {
      return false;
    }
    
    return true;
  };

  // Verificação de horários válidos e se o fim é maior que o início
  useEffect(() => {
    // Validar o formato e intervalo do horário de início
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
    
    // Validar o formato e intervalo do horário de fim
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
    
    // Verificar se o horário de fim é maior que o de início
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

  const handleSubmit = async () => {
    // Força a validação ao enviar
    setShouldValidateInicio(true);
    setShouldValidateFim(true);
    
    // Verifica erros nos horários
    if (horarioInicio.length === 5 && !validateTime(horarioInicio)) {
      alert("Horário de início inválido. Use valores entre 00:00 e 23:59");
      return;
    }
    
    if (horarioFim.length === 5 && !validateTime(horarioFim)) {
      alert("Horário de fim inválido. Use valores entre 00:00 e 23:59");
      return;
    }
    
    // Valida se o horário fim é maior que o horário início antes de enviar
    if (horarioError) {
      alert(horarioError);
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
        modalidade_id: parseInt(selectedCampus, 10),
      };
      
      console.log("Tentando enviar json:", json);
      await axios.post("/turmas", json);
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar a turma.");
    }
  };

  const handleHorarioInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatTimeInput(rawValue);
    setHorarioInicio(formattedValue);
    
    // Verifica se caracteres foram removidos durante a formatação
    const onlyNumbersInput = rawValue.replace(/\D/g, "");
    const onlyNumbersFormatted = formattedValue.replace(/:/g, "");
    
    // Detecta se houve input de caractere inválido
    const hadInvalidChar = rawValue.length > formattedValue.replace(/:/g, "").length + 1; // +1 para contar os dois pontos
    
    // Se detectou input inválido, sempre desativa a validação
    if (rawValue !== formattedValue) {
      setShouldValidateInicio(false);
      setHorarioInicioError("");
      return;
    }
    
    // Só ativa validação se o formato estiver completo
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
    
    // Verifica se caracteres foram removidos durante a formatação
    const onlyNumbersInput = rawValue.replace(/\D/g, "");
    const onlyNumbersFormatted = formattedValue.replace(/:/g, "");
    
    // Detecta se houve input de caractere inválido
    const hadInvalidChar = rawValue.length > formattedValue.replace(/:/g, "").length + 1; // +1 para contar os dois pontos
    
    // Se detectou input inválido, sempre desativa a validação
    if (rawValue !== formattedValue) {
      setShouldValidateFim(false);
      setHorarioFimError("");
      return;
    }
    
    // Só ativa validação se o formato estiver completo
    if (formattedValue.length === 5) {
      setShouldValidateFim(true);
    } else {
      setShouldValidateFim(false);
      setHorarioFimError("");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center bg-[#E4E4E4] min-h-screen justify-between">
        <Header />
        <Form title="CADASTRO DE TURMA" className="w-screen">
          <div className="flex flex-col w-full max-w-[35rem]">
            <p className="font-semibold text-2xl mb-2">Campus</p>
            <div className="flex flex-row flex-wrap  justify-between md:justify-start md:gap-40">
              {campusOptions.map((option) => (
                <Input key={option.value} id={option.value} className="max-w-2xs" name="campus" type="radio" label={option.label} value={option.value} onChange={() => setSelectedCampus(option.value)} />
              ))}
            </div>
          </div>

          <Select value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={Modalidades} />
          <Select value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
          <Select value={selectedLocal} onChange={setSelectedLocal} label="Local" options={Locais} />

          <div className="flex flex-col w-full">
            <p className="font-semibold text-2xl mb-2">Horário</p>
            <div className="flex flex-col w-full">
              <div className="flex flex-row flex-wrap justify-center gap-4">
                <div className="flex flex-col w-full md:max-w-2xs">
                  <Input 
                    className="w-full" 
                    value={horarioInicio} 
                    validation={shouldValidateInicio ? horaSchema : z.string()}
                    onChange={handleHorarioInicioChange} 
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
                    validation={shouldValidateFim ? horaSchema : z.string()}
                    onChange={handleHorarioFimChange} 
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
          <Input value={limite} validation={limiteSchema} onChange={(e) => setLimite(e.target.value.replace(/\D/g, ""))} onValidationChange={(isValid) => console.log(isValid)} label="Limite de Alunos" placeholder="Quantidade" />      
          <Button text="Confirmar" onClick={handleSubmit}/>
        </Form>
        <Footer />
      </div>
    </>
  );
};

export default ClassForm;