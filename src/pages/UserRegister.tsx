import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import MainContainer from "../components/MainContainer";

const emailValidationSchema = z.string().email("E-mail inválido");

const passwordValidationSchema = z.string()
    .min(8, "Mínimo de 8 caracteres")
    .regex(/[A-Z]/, "Mínimo de 1 letra maiúscula")
    .regex(/[a-z]/, "Mínimo de 1 letra minúscula")
    .regex(/[0-9]/, "Mínimo de 1 número")
    .regex(/[\W_]/, "Mínimo de 1 caractere especial (ex: !@#$%)");

const UserRegister = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
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
            const response = await axios.post(import.meta.env.VITE_API_URL + "/user/register", {
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

    return (
        <MainContainer>
            <Form title="Núcleo de Esportes" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    placeholder="E-mail"
                    name="email"
                    type="text"
                    value={formData.email}
                    validation={emailValidationSchema}
                    onChange={handleInputChange}
                />

                <Input
                    type="password"
                    label="Senha"
                    placeholder="Senha"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    validation={passwordValidationSchema}
                />

                <div className="flex flex-col w-full items-center gap-2 mt-8">
                    <Button
                        text={loading ? "Enviando..." : "Cadastrar-se"}
                        type="submit"
                        disabled={loading}
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