import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassForm from "./pages/ClassForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cadastro/turma" element={<ClassForm />} />
      </Routes>
    </Router>
  );
}

export default App;
