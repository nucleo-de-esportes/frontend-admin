import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
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
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isNameValid, setIsNameValid] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + "/user/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            console.log("Usuário registrado com sucesso:", response.data);
            window.location.href = "/";
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Erro no cadastro:", err.response?.data);
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
        !isNameValid ||
        !formData.email.trim() ||
        !formData.password.trim() ||
        !formData.name.trim();

    return (
        <MainContainer>
            <Form title="Núcleo de Esportes" onSubmit={handleSubmit}>
                <Input
                    label="Nome Completo"
                    placeholder="Seu nome completo"
                    name="name"
                    type="text"
                    value={formData.name}
                    validation={nameValidationSchema}
                    onChange={handleInputChange}
                    onValidationChange={setIsNameValid}
                />
                
                <Input
                    label="Email"
                    placeholder="E-mail"
                    name="email"
                    type="text"
                    value={formData.email}
                    validation={emailValidationSchema}
                    onChange={handleInputChange}
                    onValidationChange={setIsEmailValid}
                />

                <Input
                    type="password"
                    label="Senha"
                    placeholder="Senha"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    validation={passwordValidationSchema}
                    onValidationChange={setIsPasswordValid}
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