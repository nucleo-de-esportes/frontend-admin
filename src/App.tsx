import Button from "./components/Button"
import { FaSave, FaTrash } from "react-icons/fa";
import Input from "./components/Input";
import { z } from 'zod';
import { Select } from "./components/Select";
import { useState } from "react";

function App() {
  const strSchema = z.string().max(5)

  const [selectedValue, setSelectedValue] = useState('');

  const options = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
    { value: 'option4', label: 'Opção 4' },
  ];

  return (
    <>
      <div className='h-screen w-screen flex flex-col items-center gap-4 justify-center'>

        {/*TODO: refatorar esse componente*/}
        <Select minWidth="21rem" value={selectedValue} onChange={setSelectedValue} label="Modalidade" options={options} />

        <Input validation={strSchema} onValidationChange={(isValid: boolean) => console.log(isValid)} minWidth="21rem" label="Mensalidade" placeholder="Valor" />

        {/* 
            Ideia para meu querido amigo lfguerra: criar um componente que é uma lista de
            inputs do tipo radios e só passar os valores ["Asa Norte", "Taguatinga"]
        */}
        <Input type="radio" minWidth="21rem" label="Asa Norte" />

        <Button minWidth="21rem" text="Confirmar" onClick={() => console.log("Confirmado!")} />

        <div className="flex gap-4">
          <Button minWidth="10rem" text="Salvar" icon={FaSave} color="#36B37E" onClick={() => console.log("Salvo!")} />
          <Button disabled minWidth="10rem" text="Remover" icon={FaTrash} color="#D81E5B" onClick={() => console.log("Removido!")} />
        </div>

      </div>
    </>
  )
}

export default App
