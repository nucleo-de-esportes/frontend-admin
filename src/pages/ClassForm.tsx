// import { FaSave, FaTrash } from "react-icons/fa";
import Input from "../components/Input";
import { z } from "zod";
import { Select } from "../components/Select";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Form from "../components/Form";

const ClassForm = () => {
  const valorSchema = z.string().regex(/^\d*$/, "Apenas números são permitidos").max(3).refine(value => parseInt(value) >= 0 && parseInt(value) <= 300, "O valor deve estar entre 0 e 300");
  const horaSchema = z.string().regex(/^\d*$/, "Apenas números são permitidos").max(2).refine(value => parseInt(value) >= 0 && parseInt(value) <= 24, "A hora deve estar entre 0 e 24");

  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedDia, setSelectedDia] = useState("");
  const [mensalidade, setMensalidade] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

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
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const Dias = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
    { value: "option4", label: "Opção 4" },
  ];

  const campusOptions = [
    { value: "asaNorte", label: "Asa Norte" },
    { value: "taguatinga", label: "Taguatinga" },
  ];

  const replaceChar = (value: string) => {
    return value.replace(/\D/g, "")
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#E4E4E4] min-h-screen justify-between">
        <Header />
        <Form title="CADASTRO DE TURMA" className="w-screen md:w-max">
          <div className="flex flex-col w-full max-w-[35rem]">
            <p className="font-semibold text-2xl mb-2">Campus</p>
            <div className="flex flex-row flex-wrap  justify-between md:justify-start md:gap-40">
              {campusOptions.map((option) => (
                <Input key={option.value} id={option.value} className="max-w-2xs" name="campus" type="radio" label={option.label} value={option.value} />
              ))}
            </div>
          </div>

          <Select value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={Modalidades} />
          <Select value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
          <Select  value={selectedLocal} onChange={setSelectedLocal} label="Local" options={Locais} />

          <div className="flex flex-col w-full">
            <p className="font-semibold text-2xl mb-2">Horário</p>
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <Input className="md:max-w-2xs" value={horarioInicio} validation={horaSchema} onChange={(e) => setHorarioInicio(replaceChar(e.target.value))} onValidationChange={(isValid) => console.log(isValid)} minWidth="17rem" label="Início" placeholder="Hora" />
              <Input className="md:max-w-2xs" value={horarioFim} validation={horaSchema} onChange={(e) => setHorarioFim(replaceChar(e.target.value))} onValidationChange={(isValid) => console.log(isValid)} minWidth="17rem" label="Fim" placeholder="Hora" />
            </div>
          </div>

          <Select value={selectedDia} onChange={setSelectedDia} label="Dias de Aula" options={Dias} />
          <Input value={mensalidade} validation={valorSchema} onChange={(e) => setMensalidade(replaceChar(e.target.value))} onValidationChange={(isValid) => console.log(isValid)} label="Mensalidade" placeholder="Valor" />

          <Button disabled text="Confirmar" onClick={() => console.log("Confirmado!")} />
        </Form>
        <Footer />
      </div>
    </>
  );
};

export default ClassForm;
