import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassCard from '../components/ClassCard';
import Button from '../components/Button';
import Title from '../components/Title';

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
}

// Dados fictícios de exemplo
const turmasData: Turma[] = [
    {
        horario_inicio: "9h00",
        horario_fim: "10h00",
        limite_inscritos: 25,
        dia_semana: "tuesday,thursday",
        sigla: "A",
        local: "Asa Norte",
        modalidade: "Futsal"
    }
];

export default function ClassView() {
    const isSmall = useIsSmallScreen();
    const navigate = useNavigate();

    const [turmas] = useState<Turma[]>(turmasData);


    const handleEditar = (turma: Turma): void => {
        console.log("Editando turma:", turma);
    };

    return (
        <div className="bg-[#E4E4E4] min-h-screen justify-between">
            <Header />

            <main className="flex-grow bg-gray-100">
                <div className="max-w-4xl mx-auto bg-white shadow-sm h-screen relative">
                    <div className="p-8">
                        <div className="flex items-center justify-center md:justify-between mb-3">
                            <Title title='TURMAS CADASTRADAS' />
                            <div className='sm:w-1/12 fixed right-8 bottom-8 sm:static'>
                                <Button
                                    icon={Plus}
                                    text={isSmall ? 'Turma' : ''}
                                    size="sm"
                                    onClick={() => navigate('/cadastro/turma')}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {turmas.map((turma, index) => (
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