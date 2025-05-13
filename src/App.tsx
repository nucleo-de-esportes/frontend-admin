import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassForm from "./pages/ClassForm";
import ClassView from "./pages/ClassView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cadastro/turma" element={<ClassForm />} />
        <Route path="/turmas" element={<ClassView />} />
      </Routes>
    </Router>
  );
}

export default App;
