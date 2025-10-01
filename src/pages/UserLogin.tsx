import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useApiAlert } from "../hooks/useApiAlert";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Form from "../components/Form";
import MainContainer from "../components/MainContainer";
import TextInput from "../components/TextInput"

const emailValidationSchema = z.string().email("Formato de E-mail inválido");
const passwordValidationSchema = z.string().min(1, "Senha obrigatória");

const UserLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

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

        // Validar os dados antes de enviar
        const emailResult = emailValidationSchema.safeParse(formData.email);
        const passwordResult = passwordValidationSchema.safeParse(formData.password);

        if (!emailResult.success || !passwordResult.success) {
            setLoading(false);
            return;
        }

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

    // Verificar se os campos são válidos para habilitar/desabilitar o botão
    const isEmailValid = emailValidationSchema.safeParse(formData.email).success;
    const isPasswordValid = passwordValidationSchema.safeParse(formData.password).success;

    const isDisabled =
        loading ||
        !isEmailValid ||
        !isPasswordValid ||
        !formData.email.trim() ||
        !formData.password.trim();

    return (
        <MainContainer>
            <Form title="Núcleo de Esportes" onSubmit={handleSubmit}>

                <TextInput
                    label="E-mail"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    validation={emailValidationSchema}
                />

                <TextInput
                    label="Senha"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    validation={passwordValidationSchema}
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