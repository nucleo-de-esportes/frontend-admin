import { Pencil } from 'lucide-react';
import formatDayWeek from '../utils/formatDayWeek';
import Button from './Button';
import { Turma } from '../types/Class';
import { useIsSmallScreen } from '../hooks/useIsSmallScreen';

interface ClassCardProps {
    turma: Turma;
    onEditar?: (turma: Turma) => void;
}

const ClassCard = ({ turma, onEditar }: ClassCardProps) => {
    const isSmall = useIsSmallScreen();

    const diasFormatados = formatDayWeek(turma.dia_semana);

    // Lógica de segurança para exibir Modalidade
    let modalidadeNome = 'Não definido';
    if (typeof turma.modalidade === 'string') {
        modalidadeNome = turma.modalidade;
    } else if (typeof turma.modalidade === 'object' && turma.modalidade?.nome) {
        modalidadeNome = turma.modalidade.nome;
    }

    // Lógica de segurança para exibir Local
    let localNome = 'Não definido';
    let localCampus = '';
    
    // Tenta pegar do backup (original_local) primeiro, pois tem o campus
    if (turma.original_local) {
        localNome = turma.original_local.nome;
        localCampus = turma.original_local.campus;
    } 
    // Se não, verifica se o local principal é objeto
    else if (typeof turma.local === 'object' && turma.local?.nome) {
        localNome = turma.local.nome;
        localCampus = (turma.local as any).campus || '';
    } 
    // Se não, usa como string mesmo
    else if (typeof turma.local === 'string') {
        localNome = turma.local;
    }

    return (
        <div className="w-full border border-gray-200 rounded p-4 mb-4 flex justify-between items-center">
            <div>
                <h3 className="text-[#43054E] font-medium text-lg">
                    {modalidadeNome} - {turma.sigla}
                </h3>
                <p className="text-gray-700">
                    {localNome} {localCampus ? `(${localCampus})` : ''}, {diasFormatados} {turma.horario_inicio} - {turma.horario_fim}
                </p>
            </div>
            {onEditar && (
                <div className="w-2/12">
                    <Button
                        onClick={() => onEditar(turma)}
                        icon={Pencil}
                        text={isSmall ? '' : 'Editar'}
                        size="sm"
                    />
                </div>
            )}
        </div>
    );
};

export default ClassCard;