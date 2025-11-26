import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthProvider";
import { AlertProvider } from "./context/AlertContext";
import { AlertContainer } from "./components/AlertContainer";
import ClassForm from "./pages/ClassForm";
import ClassViewAdm from "./pages/ClassViewAdm";
import ClassEdit from "./pages/ClassEdit";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import PublicRoute from "./components/PublicRoute"

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router basename="/admin">
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <UserLogin />
              </PublicRoute>
              } 
            />

            <Route
              path="/cadastro/turma"
              element={
                <PrivateRoute
                  allowedTypes={["admin"]}
                  elementByType={{
                    admin: <ClassForm />,
                  }}
                />
              }
            />

            <Route
              path="/turmas"
              element={
                <PrivateRoute
                  allowedTypes={["admin"]}
                  elementByType={{
                    admin: <ClassViewAdm />,
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

            <Route path="/user/cadastro" element={
              <PublicRoute>
                <UserRegister/>
              </PublicRoute>
                } />
          </Routes>
          <AlertContainer />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;