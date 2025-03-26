// import { FaSave, FaTrash } from "react-icons/fa";
import Input from "../components/Input";
import { z } from "zod";
import { Select } from "../components/Select";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

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
        <header>
          <Header />
        </header>
        <div className="flex flex-col items-center gap-4 justify-center mt-10 mb-10 w-[70vw] mx-auto">
          <p className="text-4xl text-[#43054E]">CADASTRO DE TURMA</p>
          
          <div className="flex flex-col w-full max-w-[35rem]">
            <p className="font-semibold text-2xl mb-2">Campus</p>
            <div className="flex flex-row gap-4">
              {campusOptions.map((option) => (
                <Input key={option.value} name="campus" type="radio" minWidth="17rem" label={option.label} value={option.value} />
              ))}
            </div>
          </div>
  
          <Select minWidth="35rem" value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={Modalidades} />
          <Select minWidth="35rem" value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
          <Select minWidth="35rem" value={selectedLocal} onChange={setSelectedLocal} label="Local" options={Locais} />
          
          <div className="flex flex-col w-full max-w-[35rem]">
            <p className="font-semibold text-2xl mb-2">Horário</p>
            <div className="flex flex-row gap-4">
              <Input value={horarioInicio} validation={horaSchema} onChange={(e) => setHorarioInicio(replaceChar(e.target.value))} onValidationChange={(isValid) => console.log(isValid)} minWidth="17rem" label="Início" placeholder="Hora" />
              <Input value={horarioFim} validation={horaSchema} onChange={(e) => setHorarioFim(replaceChar(e.target.value))} onValidationChange={(isValid) => console.log(isValid)} minWidth="17rem" label="Fim" placeholder="Hora" />
            </div>
          </div>
          
          <Select minWidth="35rem" value={selectedDia} onChange={setSelectedDia} label="Dias de Aula" options={Dias} />
          <Input value={mensalidade} validation={valorSchema} onChange={(e) => setMensalidade(replaceChar(e.target.value))} onValidationChange={(isValid) => console.log(isValid)} minWidth="35rem" label="Mensalidade" placeholder="Valor" />
          
          <Button disabled minWidth="21rem" text="Confirmar" onClick={() => console.log("Confirmado!")} />
        </div>
        <footer>
          <Footer />
        </footer>
      </>
    );
};

export default ClassForm;
