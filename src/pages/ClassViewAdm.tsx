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
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 14;
        const lineHeight = 6;
        let currentY = 20;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Turmas', margin, currentY);

        currentY += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Data de geração: ${new Date().toLocaleDateString()}`, margin, currentY);

        currentY += 15;
        const columnWidths = [25, 20, 35, 40, 25, 20];
        const headers = ["Sigla", "Dia", "Horário", "Local", "Modalidade", "Limite"];

        const columnPositions = [margin];
        for (let i = 0; i < columnWidths.length - 1; i++) {
            columnPositions.push(columnPositions[i] + columnWidths[i]);
        }

        doc.setFillColor(66, 66, 66);
        doc.rect(margin, currentY - 4, pageWidth - 2 * margin, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);

        headers.forEach((header, index) => {
            doc.text(header, columnPositions[index] + 2, currentY);
        });

        currentY += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        doc.setDrawColor(200, 200, 200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 2;

        (turmasFiltradas ?? []).forEach((turma, rowIndex) => {
            if (currentY > pageHeight - 30) {
                doc.addPage();
                currentY = 20;
            }

            const rowData = [
                turma.sigla || '',
                turma.dia_semana || '',
                `${turma.horario_inicio || ''} - ${turma.horario_fim || ''}`,
                turma.local || '',
                turma.modalidade || '',
                turma.limite_inscritos?.toString() || '0'
            ];

            let maxLines = 1;
            const textLines: string[][] = [];

            rowData.forEach((data, colIndex) => {
                const lines = doc.splitTextToSize(String(data), columnWidths[colIndex] - 4);
                textLines.push(lines);
                maxLines = Math.max(maxLines, lines.length);
            });

            const rowHeight = maxLines * lineHeight;

            if (rowIndex % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, currentY - 1, pageWidth - 2 * margin, rowHeight, 'F');
            }

            textLines.forEach((lines, colIndex) => {
                lines.forEach((line, lineIndex) => {
                    doc.text(line, columnPositions[colIndex] + 2, currentY + 4 + (lineIndex * lineHeight));
                });
            });

            doc.setDrawColor(220, 220, 220);
            columnPositions.forEach(pos => {
                doc.line(pos, currentY - 1, pos, currentY + rowHeight - 1);
            });
            doc.line(pageWidth - margin, currentY - 1, pageWidth - margin, currentY + rowHeight - 1);

            doc.line(margin, currentY + rowHeight - 1, pageWidth - margin, currentY + rowHeight - 1);

            currentY += rowHeight;
        });

        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Total de turmas: ${(turmasFiltradas ?? []).length}`, margin, currentY);

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
                `Página ${i} de ${totalPages}`,
                pageWidth - margin - 20,
                pageHeight - 10
            );
        }

        doc.save(`turmas-${new Date()}`);
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