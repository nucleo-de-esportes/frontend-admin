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
import TextInput from "../components/TextInput";

const ClassForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const hasError = startTime && endTime && !startTime.isBefore(endTime);

  const [limite, setLimite] = useState("");
  const [sigla, setSigla] = useState("");

  const [modalidadeOptions, setModalidadeOptions] =
    useState<ComboBoxOption[]>([]);
  const [localOptions, setLocalOptions] = useState<ComboBoxOption[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<ComboBoxOption | null>(
    null
  );
  const [selectedModalidade, setSelectedModalidade] =
    useState<ComboBoxOption | null>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const { user } = useAuth();
  const { showAlert } = useApiAlert();
  const navigate = useNavigate();

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
      sigla &&
      !hasError
    );
  };

  const gerarAbreviacao = (nome: string): string => {
    return nome
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 3)
      .toUpperCase();
  };

  const gerarSiglaAutomatica = async (modalidadeId: number, nome: string) => {
    try {
      const res = await axios.get("/turmas", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      const existente = res.data.filter(
        (t: any) => t.modalidade.modalidade_id === modalidadeId
      ).length;

      const prefixo = gerarAbreviacao(nome);
      const numero = String(existente + 1).padStart(3, "0");

      setSigla(`${prefixo}-${numero}`);
    } catch (err) {
      console.log("Erro ao gerar sigla:", err);
      setSigla("SIG-001");
    }
  };

  const handleModalidadeChange = (mod: ComboBoxOption | null) => {
    setSelectedModalidade(mod);
    if (mod) gerarSiglaAutomatica(mod.value, mod.label);
  };

  const fetchOptionData = async () => {
    try {
      setLoading(true);

      const [modalRes, localRes] = await Promise.all([
        axios.get("/cad/mod"),
        axios.get("/cad/local"),
      ]);

      setModalidadeOptions(
        modalRes.data.map((m: any) => ({
          value: m.modalidade_id,
          label: m.nome,
        }))
      );

      setLocalOptions(
        localRes.data.map((l: any) => ({
          value: l.local_id,
          label: l.nome,
        }))
      );
    } catch (e) {
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionData();
  }, []);

  const handleConfirmation = () => {
    const data = {
      horario_inicio: startTime?.format("HH:mm"),
      horario_fim: endTime?.format("HH:mm"),
      limite: limite,
      sigla: sigla,
      modalidade: selectedModalidade?.label,
      local: selectedLocal?.label,
    };

    setModalData(data);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true);

      const json = {
        horario_inicio: startTime?.format("HH:mm"),
        horario_fim: endTime?.format("HH:mm"),
        limite_inscritos: parseInt(limite, 10),
        sigla: sigla,
        local_id: selectedLocal?.value,
        modalidade_id: selectedModalidade?.value,
      };

      await axios.post("/turmas", json, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      showAlert(
        "success",
        "Cadastro realizado com sucesso!",
        "Cadastro Realizado",
        2000
      );

      navigate("/turmas");
    } catch (err: any) {
      let msg = "Erro ao cadastrar.";
      if (err.response?.data?.error) msg = err.response.data.error;
      showAlert("error", msg, "Erro", 4000);
    } finally {
      setSubmitting(false);
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
              error={hasError || undefined}
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
            onValueChange={(v) => setLimite(v.value)}
          />
        </div>

        <div className="w-full">
          <Button
            text={submitting ? "Cadastrando..." : "Cadastrar"}
            onClick={handleConfirmation}
            disabled={!isFormValid() || submitting}
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
