import { useState, useEffect } from 'react';
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

    // Função para dividir texto longo em múltiplas linhas
    const splitText = (doc: jsPDF, text: string | null | undefined, maxWidth: number): string[] => {
        // Verificar se o texto é válido
        if (!text || typeof text !== 'string') {
            return [''];
        }

        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = doc.getTextWidth(testLine);
            
            if (testWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    lines.push(word);
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    };

    // Função para exportar turmas para PDF usando jsPDF puro
    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 14;
        const lineHeight = 6;
        let currentY = 20;

        // Título
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Turmas', margin, currentY);
        
        currentY += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Data de geração: ${new Date().toLocaleDateString()}`, margin, currentY);
        
        currentY += 15;
        const columnWidths = [25, 20, 35, 40, 25, 20]; // larguras das colunas
        const headers = ["Sigla", "Dia", "Horário", "Local", "Modalidade", "Limite"];
        
        // Calcular posições das colunas
        const columnPositions = [margin];
        for (let i = 0; i < columnWidths.length - 1; i++) {
            columnPositions.push(columnPositions[i] + columnWidths[i]);
        }

        // Desenhar cabeçalho da tabela
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

        // Desenhar linha horizontal
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 2;

        // Desenhar dados das turmas
        turmasFiltradas.forEach((turma, rowIndex) => {
            // Verificar se precisa de nova página
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

            // Calcular altura da linha (considerando quebra de texto)
            let maxLines = 1;
            const textLines: string[][] = [];
            
            rowData.forEach((data, colIndex) => {
                const lines = splitText(doc, data, columnWidths[colIndex] - 4);
                textLines.push(lines);
                maxLines = Math.max(maxLines, lines.length);
            });

            const rowHeight = maxLines * lineHeight;

            // Alternar cor de fundo das linhas
            if (rowIndex % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, currentY - 1, pageWidth - 2 * margin, rowHeight, 'F');
            }

            // Desenhar texto das células
            textLines.forEach((lines, colIndex) => {
                lines.forEach((line, lineIndex) => {
                    doc.text(line, columnPositions[colIndex] + 2, currentY + 4 + (lineIndex * lineHeight));
                });
            });

            // Desenhar bordas verticais
            doc.setDrawColor(220, 220, 220);
            columnPositions.forEach(pos => {
                doc.line(pos, currentY - 1, pos, currentY + rowHeight - 1);
            });
            doc.line(pageWidth - margin, currentY - 1, pageWidth - margin, currentY + rowHeight - 1);

            // Desenhar linha horizontal inferior
            doc.line(margin, currentY + rowHeight - 1, pageWidth - margin, currentY + rowHeight - 1);

            currentY += rowHeight;
        });

        // Adicionar estatísticas finais
        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Total de turmas: ${turmasFiltradas.length}`, margin, currentY);

        // Adicionar rodapé com número da página
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

        // Salvar o PDF
        doc.save(`turmas-${new Date()}`);
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
                                    key={index}
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
