import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassCard from '../components/ClassCard';
import Button from '../components/Button';
import Title from '../components/Title';
import FiltroDeTurmas from '../components/FiltroDeTurmas';
import Loading from '../components/Loading';
import MainContainer from '../components/MainContainer';
import { Turma } from '../types/Class';
import { useAuth } from '../hooks/useAuth';

interface response {
    turmas: Turma[]
}

export default function ClassViewUser() {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [turmasFiltradas, setTurmasFiltradas] = useState<Turma[]>([]);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    const fetchTurmas = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) {
                throw new Error("Variável de ambiente VITE_API_URL não está definida.");
            }
            const response = await axios.get<response>(`${apiUrl}/user/turmas`, {
            headers: {
              'Authorization': `Bearer ${user?.token}`
            }
          });

            const turmasProcessadas = response.data.turmas.map(turma => ({
                ...turma,
                local: typeof turma.local === 'object' && turma.local !== null ? (turma.local as { nome: string }).nome : turma.local,
                modalidade: typeof turma.modalidade === 'object' && turma.modalidade !== null ? (turma.modalidade as { nome: string }).nome : turma.modalidade,
            })) as Turma[];


            setTurmas(turmasProcessadas);
            setTurmasFiltradas(turmasProcessadas);
        } catch (err) {
            console.error("Erro ao buscar turmas:", err);
            if (axios.isAxiosError(err)) {
                setError(`Erro ao conectar com o servidor`);
            } else {
                setError("Ocorreu um erro desconhecido ao buscar os dados.");
            }
            setTurmas([]);
            setTurmasFiltradas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTurmas();
    }, []);

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
                        <Title title='Erro ao Carregar Turmas' />
                        <p className="text-red-500 mt-4">{error}</p>
                        <Button
                            text="Tentar Novamente"
                            onClick={() => {
                                fetchTurmas();
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
        <MainContainer>
            <div className="p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2 sm:gap-0">
                    <Title title='TURMAS DISPONÍVEIS' />
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            icon={Filter}
                            text='Filtrar'
                            size="sm"
                            onClick={() => setFiltroAberto(!filtroAberto)}
                        />
                    </div>
                </div>

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
                        <p className="text-gray-400">Tente ajustar os filtros para encontrar turmas disponíveis.</p>
                    </div>
                )}

                <div className="space-y-4 mt-4">
                    {turmasFiltradas.map((turma) => (
                        <ClassCard
                            key={turma.turma_id}
                            turma={turma}
                        />
                    ))}
                </div>
            </div>
        </MainContainer>
    );
}