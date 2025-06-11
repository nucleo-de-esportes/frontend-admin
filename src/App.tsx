import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthProvider";
import ClassForm from "./pages/ClassForm";
import ClassViewAdm from "./pages/ClassViewAdm";
import ClassEdit from "./pages/ClassEdit";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import ClassView from "./pages/ClassView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserLogin />} />

          <Route
            path="/cadastro/turma"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <ClassForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/turmas"
            element={
              <PrivateRoute
                allowedTypes={["admin", "aluno"]}
                elementByType={{
                  admin: <ClassViewAdm />,
                  aluno: <ClassView />,
                }}
              />
            }
          />

          <Route
            path="/editar/turma/:id"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <ClassEdit />
              </PrivateRoute>
            }
          />

          <Route path="/user/cadastro" element={<UserRegister />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;