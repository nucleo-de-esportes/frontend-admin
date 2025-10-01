// ClassForm.tsx
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainContainer from "../components/MainContainer";
import { useAuth } from "../hooks/useAuth";
import { useApiAlert } from "../hooks/useApiAlert";
import TimeInput from "../components/TimeInput";
import { Dayjs } from "dayjs";
import ComboBox from "../components/ComboBox";
import type { ComboBoxOption } from "../components/ComboBox";
import NumberInput from "../components/NumberInput";
import ConfirmationModal from "../components/ConfirmationModal";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Title from "../components/Title";

const ClassForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const hasError = startTime && endTime && !startTime.isBefore(endTime);

  const [selectedDia, setSelectedDia] = useState<ComboBoxOption | null>(null);
  const [selectedProfessor, setSelectedProfessor] =
    useState<ComboBoxOption | null>(null);
  const [limite, setLimite] = useState("");

  const [modalidadeOptions, setModalidadeOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [localOptions, setLocalOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedLocal, setSelectedLocal] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedModalidade, setSelectedModalidade] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

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

  const handleModalidadeChange = (
    modalidade: { value: number; label: string } | null
  ) => {
    setSelectedModalidade(modalidade);
    if (modalidade?.value === 6) {
      setSelectedProfessor(null);
    }
  };

  const validateLimite = (value: string): string => {
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
      startTime &&
      endTime &&
      selectedDia &&
      selectedModalidade &&
      selectedLocal &&
      (isNadoLivre || selectedProfessor) &&
      !hasError
    );
  };

  // Função unificada para buscar modalidades e locais
  const fetchOptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [modalidadeRes, localRes] = await Promise.all([
        axios.get<{ modalidade_id: number; nome: string; valor: number }[]>(
          "/cad/mod"
        ),
        axios.get<{ local_id: number; nome: string }[]>("/cad/local"),
      ]);

      const modalidades = modalidadeRes.data.map((res) => ({
        value: res.modalidade_id,
        label: res.nome,
      }));
      setModalidadeOptions(modalidades);

      const locais = localRes.data.map((res) => ({
        value: res.local_id,
        label: res.nome,
      }));
      setLocalOptions(locais);
    } catch (err) {
      console.error("Erro ao carregar opções:", err);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionData();
  }, []);

  const handleConfirmation = async () => {
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

  const handleConfirmSubmit = async () => {
    try {
      const json = {
        horario_inicio: startTime?.format("HH:mm"),
        horario_fim: endTime?.format("HH:mm"),
        limite_inscritos: parseInt(limite, 10),
        dia_semana: selectedDia?.label,
        sigla: selectedModalidade?.label,
        local_id: selectedLocal?.value,
        modalidade_id: selectedModalidade?.value,
      };

      console.log("Tentando enviar json:", json);
      await axios.post("/turmas", json, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      showAlert(
        "success",
        "Cadastro realizado com sucesso!",
        "Cadastro Realizado",
        2000
      );
      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar a turma.");
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
            <Title title="Erro ao Carregar Dados" />
            <p className="text-red-500 mt-4">{error}</p>
            <Button
              text="Tentar Novamente"
              onClick={fetchOptionData}
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
      <Form
        title="CADASTRO DE TURMA"
        className="w-screen h-full flex flex-col py-16"
      >
        <div className="flex flex-col flex-grow justify-center w-full">
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
              error={hasError ? hasError : undefined}
              helperText={
                hasError
                  ? "O horário de fim deve ser maior que o de início"
                  : ""
              }
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
            helperText={
              <span className="text-red-500">{validateLimite(limite)}</span>
            }
            onValueChange={(values) => setLimite(values.value)}
          />
        </div>

        <div className="w-full">
          <Button
            text="Cadastrar"
            onClick={handleConfirmation}
            disabled={!isFormValid()}
          />
        </div>

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmSubmit}
          data={modalData}
        />
      </Form>
    </MainContainer>
  );
};

export default ClassForm;
