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

    return (
        <div className="w-full border border-gray-200 rounded p-4 mb-4 flex justify-between items-center">
            <div>
                <h3 className="text-[#43054E] font-medium text-lg">
                    {turma.modalidade} - {turma.sigla}
                </h3>
                <p className="text-gray-700">
                    {turma.local}, {diasFormatados} {turma.horario_inicio} - {turma.horario_fim}
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