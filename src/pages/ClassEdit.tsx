// ClassEdit.tsx
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import MainContainer from "../components/MainContainer";
import { useAuth } from "../hooks/useAuth";
import { useApiAlert } from "../hooks/useApiAlert";
import TimeInput from "../components/TimeInput";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ComboBox from "../components/ComboBox";
import type { ComboBoxOption } from "../components/ComboBox";
import NumberInput from "../components/NumberInput";
import ConfirmationModal from "../components/ConfirmationModal";
import DeletionModal from "../components/DeletionModal";
import { FaSave, FaTrash } from "react-icons/fa";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Title from "../components/Title";

dayjs.locale("pt-br");
dayjs.extend(customParseFormat);

const ClassEdit = () => {
  useEffect(() => {
    axios.get("/cad/mod").then((response) => {
      const formatted = response.data.map(
        (mod: { modalidade_id: number; nome: string }) => ({
          value: mod.modalidade_id,
          label: mod.nome,
        })
      );
      setModalidadeOptions(formatted);
      setModalidadesCarregadas(true);
    });
  }, []);

  useEffect(() => {
    axios.get("/cad/local").then((response) => {
      const formatted = response.data.map(
        (loc: { local_id: number; nome: string }) => ({
          value: loc.local_id,
          label: loc.nome,
        })
      );
      setLocalOptions(formatted);
      setLocaisCarregados(true);
    });
  }, []);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const hasError = startTime && endTime && !startTime.isBefore(endTime);

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

  const [modalidadesCarregadas, setModalidadesCarregadas] = useState(false);
  const [locaisCarregados, setLocaisCarregados] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);

  const { user } = useAuth();
  const { id } = useParams();

  const { showAlert } = useApiAlert();

  const navigate = useNavigate();

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
          Authorization: `Bearer ${user?.token}`,
        },
      });
      clearTimeout(timeout);

        const turmaData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      setStartTime(dayjs(turmaData.horario_inicio, "HH:mm", "pt-br"));
      setEndTime(dayjs(turmaData.horario_fim, "HH:mm", "pt-br"));

      setLimite(turmaData.limite_inscritos.toString());

      const nomeModalidade = turmaData.modalidade?.nome || turmaData.modalidade || '';
      const nomeLocal = turmaData.local?.nome || turmaData.local || '';

      setSelectedModalidade(
        modalidadeOptions.find(
          (m) => m.label.toLowerCase() === String(nomeModalidade).toLowerCase()
        ) ?? null
      );
      
      setSelectedLocal(
        localOptions.find(
          (l) => l.label.toLowerCase() === String(nomeLocal).toLowerCase()
        ) ?? null
      );

      setLoading(false);
    } catch (error) {
      clearTimeout(timeout);
      console.error("Erro ao carregar turma:", error);
      setError(
        "Erro ao carregar a turma. Verifique sua conexão ou tente novamente."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalidadesCarregadas && locaisCarregados) {
      fetchTurmaData();
    }
  }, [modalidadesCarregadas, locaisCarregados, id, user?.token]);

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
      selectedModalidade &&
      selectedLocal &&
      !hasError
    );
  };

  const handleSave = async () => {
    const data = {
      horario_inicio: startTime?.format("HH:mm"),
      horario_fim: endTime?.format("HH:mm"),
      limite_inscritos: parseInt(limite, 10),
      sigla: selectedModalidade?.label,
      local: selectedLocal?.label,
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
        local_id: selectedLocal?.value,
        modalidade_id: selectedModalidade?.value,
      };

      console.log("Tentando enviar json:", json);
      await axios.put(`/turmas/${id}`, json, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      showAlert(
        "success",
        "Edição realizada com sucesso!",
        "Edição Realizada",
        2000
      );
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
      sigla: selectedModalidade?.label,
      local: selectedLocal?.label,
    };

    setModalData(data);
    setIsDeletionModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeletionModalOpen(false);
    try {
      await axios.delete(`/turmas/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      showAlert(
        "warning",
        "Remoção realizada com sucesso!",
        "Remoção Realizada",
        2000
      );
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
            <Title title="Erro ao Carregar Turma" />
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
      <Form
        title="EDITAR TURMA"
        className="w-screen h-full flex flex-col py-16"
      >
        <div className="flex flex-col flex-grow justify-center w-full">
          <ComboBox
            label="Modalidade"
            options={modalidadeOptions}
            value={selectedModalidade}
            onChange={setSelectedModalidade}
          />
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
          <NumberInput
            label="Limite de Alunos"
            value={limite}
            helperText={
              <span className="text-red-500">{validateLimite(limite)}</span>
            }
            onValueChange={(values) => {
              setLimite(values.value);
              console.log(limite);
            }}
          />
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

export default ClassEdit;