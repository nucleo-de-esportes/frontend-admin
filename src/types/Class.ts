export interface Turma {
    turma_id: number | string; // Aceita string pois geramos IDs temporários se precisar
    horario_inicio: string;
    horario_fim: string;
    limite_inscritos: number;
    dia_semana: string;
    sigla: string;
    // Agora aceitam string OU objeto, para flexibilidade
    local: string | { nome: string; campus: string }; 
    modalidade: string | { nome: string };
    
    // Propriedade extra que criamos para backup do campus
    original_local?: { nome: string; campus: string }; 
    
    total_alunos?: number;
    professor?: string;
}