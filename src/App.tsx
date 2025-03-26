import Button from "./components/Button"
import { FaSave, FaTrash } from "react-icons/fa";
import Input from "./components/Input";
import { z } from 'zod';

function App() {
  const strSchema = z.string().max(5)

  return (
    <>
      <div className='h-screen w-screen flex flex-col items-center gap-4 justify-center'>

        <Input validation={strSchema} onValidationChange={(isValid: boolean) => console.log(isValid)} minWidth="21rem" label="Mensalidade" placeholder="Valor" />

        <Input type="radio" minWidth="21rem" label="Asa Norte"/>

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
