//import { useState } from 'react'

import Button from "./components/Button"
import { FaSave, FaTrash } from "react-icons/fa";

function App() {
  return (
    <>
      <div className='h-screen w-screen flex flex-col items-center gap-4 justify-center'>

        <Button minWidth="21rem" text="Confirmar" onClick={() => console.log("Confirmado!")} />

        <div className="flex gap-4">
          <Button minWidth="10rem" text="Salvar" icon={FaSave} color="#36B37E" onClick={() => console.log("Salvo!")} />
          <Button minWidth="10rem" text="Remover" icon={FaTrash} color="#D81E5B" onClick={() => console.log("Removido!")} />
        </div>
        
      </div>
    </>
  )
}

export default App
