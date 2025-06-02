import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import MainContainer from "../components/MainContainer";

const emailValidationSchema = z.string().email("Formate de E-mail inválido");
const passwordValidationSchema = z.string().min(1, "Senha obrigatória");

const UserLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

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

        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + "/user/login", {
                email: formData.email,
                password: formData.password
            });

            console.log("Login realizado com sucesso:", response.data);
            localStorage.setItem("auth_token", response.data.token);
            window.location.href = "/turmas";
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Erro no login:", err.response?.data);
            } else {
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
