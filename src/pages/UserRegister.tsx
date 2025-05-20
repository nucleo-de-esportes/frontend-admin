import { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import MainContainer from "../components/MainContainer";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

//   const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError(null);

    try {
      // Substitua pela URL da sua API
      const response = await axios.post(import.meta.env.VITE_API_URL+ "/user/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      // Caso o registro seja bem-sucedido
      console.log("Usuário registrado com sucesso:", response.data);
      
      // Redirecionar para login ou outra página após registro bem-sucedido
      window.location.href = "/";
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // setError(err.response?.data?.message || "Erro ao cadastrar. Tente novamente.");
        console.error("Erro no cadastro:", err.response?.data);
      } else {
        // setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
        console.error("Erro inesperado:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <Form title="Núcleo de Esportes" onSubmit={handleSubmit}>
        {/* {error && (
          <div className="w-full p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )} */}
        
        <Input 
          label="Nome" 
          placeholder="Primeiro Nome" 
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        
        <Input 
          label="Sobrenome" 
          placeholder="Último Nome" 
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        
        <Input 
          label="Email" 
          placeholder="E-mail" 
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        
        <Input 
          type="password" 
          label="Senha" 
          placeholder="Senha" 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        
        <a href="/" className="text-[#BF0087] underline hover:text-[#43054E] transition">
          Fazer Login
        </a>
        
        <Button 
          text={loading ? "Enviando..." : "Cadastrar-se"} 
          type="submit" 
          disabled={loading}
        />
      </Form>
    </MainContainer>
  );
};

export default UserRegister;