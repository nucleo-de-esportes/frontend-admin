import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassForm from "./pages/ClassForm";
import ClassView from "./pages/ClassView";
import ClassEdit from "./pages/ClassEdit"
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <UserLogin /> } />
        <Route path="/cadastro/turma" element={<ClassForm />} />
        <Route path="/turmas" element={<ClassView />} />
        <Route path="/editar/turma/:id" element={<ClassEdit />} />
        <Route path="/user/cadastro" element={<UserRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
