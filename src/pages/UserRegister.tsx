import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useApiAlert } from "../hooks/useApiAlert";
import Button from "../components/Button";
import Form from "../components/Form";
import TextInput from "../components/TextInput";
import MainContainer from "../components/MainContainer";

const emailValidationSchema = z.string().email("Formato de E-mail inválido");

const nameValidationSchema = z.string().min(1, "Nome obrigatório");

const passwordValidationSchema = z.string()
    .min(8, "Mínimo de 8 caracteres")
    .regex(/[A-Z]/, "Mínimo de 1 letra maiúscula")
    .regex(/[a-z]/, "Mínimo de 1 letra minúscula")
    .regex(/[0-9]/, "Mínimo de 1 número")
    .regex(/[\W_]/, "Mínimo de 1 caractere especial (ex: !@#$%)");

const UserRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { showAlert } = useApiAlert();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validação final antes do envio
        const nameResult = nameValidationSchema.safeParse(formData.name);
        const emailResult = emailValidationSchema.safeParse(formData.email);
        const passwordResult = passwordValidationSchema.safeParse(formData.password);

        if (!nameResult.success || !emailResult.success || !passwordResult.success) {
            showAlert('error', 'Por favor, corrija os erros no formulário antes de enviar.', 'Erro de Validação');
            setLoading(false);
            return;
        }

        try {
            await axios.post(import.meta.env.VITE_API_URL + "/user/register", {
                nome: formData.name,
                email: formData.email,
                password: formData.password,
                user_type: "-1"
            });

            showAlert(
                'success', 
                'Usuário cadastrado com sucesso! Você receberá um e-mail de confirmação.', 
                'Cadastro Realizado',
                3000
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const apiErrorMessage = 
                    err.response?.data?.message || 
                    (typeof err.response?.data === 'string' ? err.response.data : "Erro no cadastro. Verifique os dados e tente novamente.");
                
                showAlert('error', apiErrorMessage, 'Erro no Cadastro', 1500);
                
                console.error("Erro no cadastro:", apiErrorMessage, err.response);
            } else {
                showAlert('error', 'Erro inesperado. Tente novamente.', 'Erro');
                console.error("Erro inesperado:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Verificar se todos os campos são válidos para habilitar o botão
    const isFormValid = () => {
        const nameResult = nameValidationSchema.safeParse(formData.name);
        const emailResult = emailValidationSchema.safeParse(formData.email);
        const passwordResult = passwordValidationSchema.safeParse(formData.password);
        
        return nameResult.success && emailResult.success && passwordResult.success;
    };

    const isDisabled = loading || !isFormValid();

    return (
        <MainContainer>
            <Form title="Núcleo de Esportes" onSubmit={handleSubmit}>
                <TextInput
                    label="Nome Completo"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    validation={nameValidationSchema}
                />
                
                <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    validation={emailValidationSchema}
                />

                <TextInput
                    label="Senha"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    validation={passwordValidationSchema}
                />

                <div className="flex flex-col w-full items-center gap-2 mt-8">
                    <Button
                        text={loading ? "Enviando..." : "Cadastrar-se"}
                        type="submit"
                        disabled={isDisabled}
                    />

                    <a href="/" className="text-[#BF0087] underline hover:text-[#43054E] transition">
                        Fazer Login
                    </a>
                </div>
            </Form>
        </MainContainer>
    );
};

export default UserRegister;