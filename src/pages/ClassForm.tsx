// ClassForm.tsx
import { useState , useEffect} from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MainContainer from "../components/MainContainer";
import { useAuth } from "../hooks/useAuth";
import { useApiAlert } from "../hooks/useApiAlert";
import TimeInput from "../components/TimeRangePicker"
import { Dayjs } from "dayjs";
import ComboBox from "../components/ComboBox";
import type { ComboBoxOption } from "../components/ComboBox";
import NumberInput from "../components/NumberInput";

const ClassForm = () => {
  useEffect(() => {
    axios.get<{ modalidade_id: number; nome: string; valor: number }[]>('/cad/mod')
      .then(response => {
        const options = response.data.map(res => ({
          value: res.modalidade_id,
          label: res.nome
        }));
        setModalidadeOptions(options);
      })
      .catch(error => {
        console.error("Erro ao carregar as modalidades:", error);
      });
  }, []);

  useEffect(() => {
    axios.get<{ local_id: number; nome: string}[]>('/cad/local')
      .then(response => {
        const options = response.data.map(res => ({
          value: res.local_id,
          label: res.nome
        }));
        setLocalOptions(options);
      })
      .catch(error => {
        console.error("Erro ao carregar os locais:", error);
      });
  }, []);

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

  const isNadoLivre = selectedModalidade?.value === 6;

  const { user } = useAuth();

  const { showAlert } = useApiAlert();

  const navigate = useNavigate();


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

  const handleConfirmSubmit = async () => {
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
      await axios.post("/turmas", json, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      showAlert(
        'success',
        'Cadastro realizado com sucesso!',
        'Cadastro Realizado',
        2000
      );
      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar a turma.");
    }
  };

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
        <Button text="Cadastrar" onClick={handleConfirmSubmit} disabled={!isFormValid()} />
      </Form>
    </MainContainer>
  );
};

export default ClassForm;