const formatDayWeek = (diasString: string): string => {
    const dias = diasString.split(',');
    const mapaAbreviacoes: Record<string, string> = {
        'monday': 'Seg',
        'tuesday': 'Ter',
        'wednesday': 'Qua',
        'thursday': 'Qui',
        'friday': 'Sex',
        'saturday': 'Sáb',
        'sunday': 'Dom'
    };

    return dias.map(dia => mapaAbreviacoes[dia] || dia).join(' e ');
};

export default formatDayWeek;