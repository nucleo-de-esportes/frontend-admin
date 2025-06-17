import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useApiAlert } from "../hooks/useApiAlert";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import MainContainer from "../components/MainContainer";

const emailValidationSchema = z.string().email("Formato de E-mail inválido");
const passwordValidationSchema = z.string().min(1, "Senha obrigatória");

const UserLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const { showAlert } = useApiAlert();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email: formData.email,
                password: formData.password
            });

            const token = response.data.usuario.token;
            login(token);

            showAlert(
                'success', 
                'Login realizado com sucesso!', 
                'Login Realizado',
                2000
            )
            
            setTimeout(() => {
                navigate("/turmas");
            }, 1500);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const apiErrorMessage = 
                    err.response?.data?.message || 
                    (typeof err.response?.data === 'string' ? err.response.data : "Erro no login. Verifique suas credenciais.");
                
                showAlert('error', apiErrorMessage, 'Erro no Login', 1500);
            } else {
                showAlert('error', 'Erro inesperado. Tente novamente.', 'Erro');
                console.error("Erro inesperado:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    const isDisabled =
        loading ||
        !isEmailValid ||
        !isPasswordValid ||
        !formData.email.trim() ||
        !formData.password.trim();

    return (
        <MainContainer>
            <Form title="Núcleo de Esportes" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    placeholder="Seu email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleInputChange}
                    validation={emailValidationSchema}
                    onValidationChange={setIsEmailValid}
                />

                <Input
                    type="password"
                    label="Senha"
                    placeholder="Sua senha"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    validation={passwordValidationSchema}
                    onValidationChange={setIsPasswordValid}
                />

                <a href="/forgot-password" className="text-[#BF0087] underline hover:text-[#43054E] transition mb-8">
                    Esqueci minha senha
                </a>

                <Button
                    text={loading ? "Entrando..." : "Entrar"}
                    type="submit"
                    disabled={isDisabled}
                />

                <a href="/user/cadastro" className="text-[#BF0087] underline hover:text-[#43054E] transition">
                    Criar uma conta
                </a>
            </Form>
        </MainContainer>
    );
};

export default UserLogin;
