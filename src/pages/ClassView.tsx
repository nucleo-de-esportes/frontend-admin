import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassCard from '../components/ClassCard';
import Button from '../components/Button';
import Title from '../components/Title';
import FiltroDeTurmas from '../components/FiltroDeTurmas';
import Loading from '../components/Loading';

import { useIsSmallScreen } from '../hooks/useIsSmallScreen';
import { useNavigate } from 'react-router-dom';

interface Turma {
    horario_inicio: string;
    horario_fim: string;
    limite_inscritos: number;
    dia_semana: string;
    sigla: string;
    local: string;
    modalidade: string;
    // id?: string | number; // Exemplo
}

export default function ClassView() {
    const isSmall = useIsSmallScreen();
    const navigate = useNavigate();

    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [turmasFiltradas, setTurmasFiltradas] = useState<Turma[]>([]);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os dados quando o componente montar
    useEffect(() => {
        const fetchTurmas = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!apiUrl) {
                    throw new Error("Variável de ambiente VITE_API_URL não está definida.");
                }
                const response = await axios.get<Turma[]>(`${apiUrl}/turmas`);
                setTurmas(response.data);
                setTurmasFiltradas(response.data);
            } catch (err) {
                console.error("Erro ao buscar turmas:", err);
                if (axios.isAxiosError(err)) {
                    setError(`Erro ao conectar com o servidor: ${err.message}`);
                } else {
                    setError("Ocorreu um erro desconhecido ao buscar os dados.");
                }
                setTurmas([]);
                setTurmasFiltradas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTurmas();
    }, []);

    const fetchTurmasAgain = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) {
                throw new Error("A variável de ambiente VITE_API_URL não está definida.");
            }
            const response = await axios.get<Turma[]>(`${apiUrl}/turmas`);
            setTurmas(response.data);
            setTurmasFiltradas(response.data);
        } catch (err) {
            console.error("Erro ao buscar turmas:", err);
            if (axios.isAxiosError(err)) {
                setError(`Erro ao conectar com o servidor: ${err.message}`);
            } else {
                setError("Ocorreu um erro desconhecido ao buscar os dados.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (turma: Turma): void => {
        console.log("Editando turma:", turma);
    };

    if (loading) {
        return (
            <div className="bg-[#E4E4E4] min-h-screen flex flex-col justify-between">
                <Header />
                <main className="flex-grow bg-gray-100 flex items-center justify-center">
                    <Loading />
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#E4E4E4] min-h-screen flex flex-col justify-between">
                <Header />
                <main className="flex-grow bg-gray-100 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto bg-white shadow-sm p-8 text-center">
                        <Title title='ERRO AO CARREGAR TURMAS' />
                        <p className="text-red-500 mt-4">{error}</p>
                        <Button
                            text="Tentar Novamente"
                            onClick={() => { // Adiciona uma forma de tentar novamente
                                setLoading(true); // Ativa o loading para a nova tentativa
                                setError(null);
                                fetchTurmasAgain();
                            }}
                            size="md"
                            className="mt-6"
                        />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#E4E4E4] min-h-screen flex flex-col justify-between">
            <Header />

            <main className="flex-grow bg-gray-100">
                <div className="max-w-4xl mx-auto bg-white shadow-sm min-h-[calc(100vh-128px)] relative">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <Title title='TURMAS CADASTRADAS' />
                            <div className="flex gap-2">
                                <Button
                                    icon={Filter}
                                    text='Filtrar'
                                    size="sm"
                                    onClick={() => setFiltroAberto(!filtroAberto)}
                                />
                                <Button
                                    icon={Plus}
                                    text={isSmall ? 'Turma' : ''}
                                    size="sm"
                                    onClick={() => navigate('/cadastro/turma')}
                                />
                            </div>
                        </div>
                        
                        {/* Passar o estado `turmas` (vindo da API) para o filtro */}
                        <FiltroDeTurmas 
                            turmas={turmas} 
                            onChange={(filtradas) => setTurmasFiltradas(filtradas)}
                            hideButton={true}
                            isOpen={filtroAberto}
                            onToggleFilter={(isOpen) => setFiltroAberto(isOpen)}
                        />
                        
                        {turmasFiltradas.length === 0 && !loading && (
                             <div className="text-center py-10">
                                <p className="text-gray-500 text-lg">Nenhuma turma encontrada.</p>
                                <p className="text-gray-400">Tente ajustar os filtros ou cadastrar uma nova turma.</p>
                             </div>
                        )}

                        <div className="space-y-4 mt-4">
                            {turmasFiltradas.map((turma, index) => (
                                <ClassCard
                                    key={index} // Sugestão: usar um ID da turma como key se disponível
                                    turma={turma}
                                    onEditar={handleEditar}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}