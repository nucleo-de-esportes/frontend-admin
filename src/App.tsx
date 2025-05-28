import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassForm from "./pages/ClassForm";
import ClassView from "./pages/ClassView";
import ClassEdit from "./pages/ClassEdit"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cadastro/turma" element={<ClassForm />} />
        <Route path="/turmas" element={<ClassView />} />
        <Route path="/editar/turma/:id" element={<ClassEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
