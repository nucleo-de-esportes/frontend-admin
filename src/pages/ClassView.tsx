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
import Pagination from '../components/Pagination';

import { useIsSmallScreen } from '../hooks/useIsSmallScreen';
import { useNavigate } from 'react-router-dom';

interface Turma {
    id?: string | number;
    horario_inicio: string;
    horario_fim: string;
    limite_inscritos: number;
    dia_semana: string;
    sigla: string;
    local: string;
    modalidade: string;
}

const ITEMS_PER_PAGE = 6; // Define quantas turmas por página

export default function ClassView() {
    const isSmall = useIsSmallScreen();
    const navigate = useNavigate();

    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [turmasFiltradas, setTurmasFiltradas] = useState<Turma[]>([]);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1); //Estado da página atual

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

    // Função para tentar buscar novamente
    const fetchTurmasAgain = async () => {
        setLoading(true);
        setError(null);
        setCurrentPage(1); // Resetar página ao tentar novamente
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

    // Calcular turmas para a página atual
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentTurmasNaPagina = turmasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleFilterChange = (filtradas: Turma[]) => {
        setTurmasFiltradas(filtradas);
        setCurrentPage(1); // Resetar para a primeira página ao aplicar filtros
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
                            onClick={fetchTurmasAgain}
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
                <div className="max-w-4xl mx-auto bg-white shadow-sm min-h-[calc(100vh-128px)] relative"> {/* Ajustar altura se necessário */}
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
                        
                        <FiltroDeTurmas 
                            turmas={turmas} // Passa todas as turmas para o filtro poder operar sobre o conjunto completo
                            onChange={handleFilterChange}
                            hideButton={true}
                            isOpen={filtroAberto}
                            onToggleFilter={(isOpen) => setFiltroAberto(isOpen)}
                        />
                        
                        {currentTurmasNaPagina.length === 0 && !loading && ( // Verifica as turmas da página atual
                             <div className="text-center py-10">
                                <p className="text-gray-500 text-lg">
                                    {turmasFiltradas.length > 0 ? 'Nenhuma turma nesta página.' : 'Nenhuma turma encontrada.'}
                                </p>
                                <p className="text-gray-400">
                                    {turmasFiltradas.length > 0 ? 'Tente outra página ou ajuste os filtros.' : 'Tente ajustar os filtros ou cadastrar uma nova turma.'}
                                </p>
                             </div>
                        )}

                        <div className="space-y-4 mt-4">
                            {currentTurmasNaPagina.map((turma, index) => (
                                <ClassCard
                                    key={index}
                                    turma={turma}
                                    onEditar={handleEditar}
                                />
                            ))}
                        </div>

                        {turmasFiltradas.length > ITEMS_PER_PAGE && (
                            <Pagination
                                totalItems={turmasFiltradas.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}