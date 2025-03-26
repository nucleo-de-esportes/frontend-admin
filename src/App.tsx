import Button from "./components/Button"
import { FaSave, FaTrash } from "react-icons/fa";
import Input from "./components/Input";
import { z } from 'zod';
import { Select } from "./components/Select";
import { useState } from "react";
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  const valorSchema = z.string().regex(/^\d*$/, "Apenas números são permitidos").max(3);
  const horaSchema = z.string().regex(/^\d*$/, "Apenas números são permitidos").max(2)

  const [selectedModalidade, setSelectedModalidade] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedLocal, setSelectedLocal] = useState('');
  const [selectedDia, setSelectedDia] = useState('');

  const Modalidades = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
    { value: 'option4', label: 'Opção 4' },
  ];

  const Professores = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
    { value: 'option4', label: 'Opção 4' },
  ];

  const Locais = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
    { value: 'option4', label: 'Opção 4' },
  ];

  const Dias = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
    { value: 'option4', label: 'Opção 4' },
  ];

  const campusOptions = [
    { value: 'asaNorte', label: 'Asa Norte' },
    { value: 'taguatinga', label: 'Taguatinga' },
  ];

  return (
    <>
      <header>
        <Header/>
      </header>
      <div className='flex flex-col items-center gap-4 justify-center mt-10 mb-10 w-[70vw] mx-auto'>

        {/*TODO: refatorar esse componente*/}
        <p className="text-4xl text-fuchsia-950">CADASTRO DE TURMA</p>
        <div className="flex flex-row gap-4">
        {campusOptions.map((option) => (
        <Input key={option.value} name="campus" type="radio" minWidth="17rem" label={option.label} value={option.value} />
        ))}
        </div>
        <Select minWidth="35rem" value={selectedModalidade} onChange={setSelectedModalidade} label="Modalidade" options={Modalidades} />
        <Select minWidth="35rem" value={selectedProfessor} onChange={setSelectedProfessor} label="Professor" options={Professores} />
        <Select minWidth="35rem" value={selectedLocal} onChange={setSelectedLocal} label="Local" options={Locais} />
        <div className="flex flex-row gap-4">
          <Input validation={horaSchema} onValidationChange={(isValid: boolean) => console.log(isValid)} minWidth="17rem" label="Início" placeholder="Hora" />
          <Input validation={horaSchema} onValidationChange={(isValid: boolean) => console.log(isValid)} minWidth="17rem" label="Fim" placeholder="Hora" />
        </div>
        
        <Select minWidth="35rem" value={selectedDia} onChange={setSelectedDia} label="Dias de Aula" options={Dias} />
        <Input validation={valorSchema} onValidationChange={(isValid: boolean) => console.log(isValid)} minWidth="35rem" label="Mensalidade" placeholder="Valor" />
        

        {/* 
            Ideia para meu querido amigo lfguerra: criar um componente que é uma lista de
            inputs do tipo radios e só passar os valores ["Asa Norte", "Taguatinga"]
        */}
        

        <Button disabled minWidth="21rem" text="Confirmar" onClick={() => console.log("Confirmado!")} />

      {/*
        <div className="flex gap-4">
          <Button minWidth="10rem" text="Salvar" icon={FaSave} color="#36B37E" onClick={() => console.log("Salvo!")} />
          <Button disabled minWidth="10rem" text="Remover" icon={FaTrash} color="#D81E5B" onClick={() => console.log("Removido!")} />
        </div>
         */}

      </div>
      <footer>
        <Footer/>
      </footer>
    </>
  )
}

export default App
