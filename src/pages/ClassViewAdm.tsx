import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Filter, FileDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassCard from '../components/ClassCard';
import Button from '../components/Button';
import Title from '../components/Title';
import FiltroDeTurmas from '../components/FiltroDeTurmas';
import Loading from '../components/Loading';
import { jsPDF } from 'jspdf';
import { useIsSmallScreen } from '../hooks/useIsSmallScreen';
import { useNavigate } from 'react-router-dom';
import MainContainer from '../components/MainContainer';
import { useAuth } from '../hooks/useAuth';

export default function ClassView() {
    const isSmall = useIsSmallScreen();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [turmas, setTurmas] = useState<any[]>([]);
    const [turmasFiltradas, setTurmasFiltradas] = useState<any[]>([]);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTurmas = useCallback(async () => {
        if (!user?.token) return;

        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error("VITE_API_URL não definida");

            const response = await axios.get(`${apiUrl}/turmas`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const dadosTratados = response.data.map((turma: any, index: number) => {
                
                const modalidadeString = typeof turma.modalidade === 'object' && turma.modalidade !== null
                    ? turma.modalidade.nome
                    : String(turma.modalidade || '');

                const localString = typeof turma.local === 'object' && turma.local !== null
                    ? turma.local.nome
                    : String(turma.local || '');

                const uniqueId = turma.turma_id ? turma.turma_id : `temp-${index}-${Date.now()}`;

                return {
                    ...turma,
                    turma_id: uniqueId, 
                    modalidade: modalidadeString, 
                    local: localString,
                    original_local: turma.local
                };
            });

            setTurmas(dadosTratados);
            setTurmasFiltradas(dadosTratados);

        } catch (err: any) {
            const msg = axios.isAxiosError(err) 
                ? `Erro ao carregar dados: ${err.response?.status === 401 ? 'Não autorizado' : err.message}` 
                : "Erro desconhecido ao conectar com o servidor.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTurmas();
    }, [fetchTurmas]);

    const handleEditar = (turma: any) => {
        navigate(`/editar/turma/${turma.turma_id}`);
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 14;
            let currentY = 20;

            doc.setFontSize(16);
            doc.text('Relatório de Turmas', margin, currentY);
            currentY += 10;
            
            doc.setFontSize(10);
            doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, margin, currentY);
            currentY += 15;

            turmasFiltradas.forEach((turma) => {
                const linha = [
                    String(turma.sigla || ''),
                    String(turma.dia_semana || ''),
                    `${turma.horario_inicio || ''} - ${turma.horario_fim || ''}`,
                    String(turma.local || ''),
                    String(turma.modalidade || ''),
                    String(turma.limite_inscritos || '0')
                ];
                
                doc.text(linha.join(" | "), margin, currentY);
                currentY += 10;

                if (currentY >= pageHeight - 20) {
                    doc.addPage();
                    currentY = 20;
                }
            });

            doc.save(`turmas.pdf`);
        } catch (e) {
            alert("Não foi possível gerar o PDF no momento.");
        }
    };

    if (loading) {
        return (
            <div className="bg-[#E4E4E4] min-h-screen flex flex-col justify-between">
                <Header />
                <main className="flex-grow flex items-center justify-center">
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
                <main className="flex-grow flex items-center justify-center">
                    <div className="bg-white p-8 shadow rounded text-center">
                        <Title title='ERRO' />
                        <p className="text-red-500 mt-4 mb-4">{error}</p>
                        <Button text="Tentar Novamente" onClick={fetchTurmas} size="md" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <MainContainer>
            <div className="flex flex-col min-h-full p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2 sm:gap-0">
                    <Title title='TURMAS CADASTRADAS' />
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            icon={FileDown}
                            text={isSmall ? '' : 'PDF'}
                            size="sm"
                            onClick={exportToPDF}
                            disabled={turmasFiltradas.length === 0}
                        />
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
                    turmas={turmas}
                    onChange={setTurmasFiltradas}
                    hideButton={true}
                    isOpen={filtroAberto}
                    onToggleFilter={setFiltroAberto}
                />

                <div className="space-y-4 mt-4 flex-grow">
                    {turmasFiltradas.map((turma, index) => (
                        <ClassCard
                            key={turma.turma_id || `fallback-key-${index}`}
                            turma={turma}
                            onEditar={handleEditar}
                        />
                    ))}
                </div>
            </div>
        </MainContainer>
    );
}