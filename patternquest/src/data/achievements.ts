export interface AchievementDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'diagnosis' | 'pattern' | 'hexagonal' | 'performance' | 'narrative' | 'exploration' | 'special';
    rarity: 'common' | 'rare' | 'legendary';
}

export const ACHIEVEMENTS_LIST: AchievementDef[] = [
    // --- Diagnóstico Arquitetural ---
    { id: 'diag_preciso', name: 'Diagnóstico Preciso', description: 'Acertar 5 questões seguidas', icon: '🎯', category: 'diagnosis', rarity: 'common' },
    { id: 'olho_clinico', name: 'Olho Clínico', description: 'Acertar sem errar nenhuma vez na fase', icon: '👁️', category: 'diagnosis', rarity: 'rare' },
    { id: 'pensamento_arq', name: 'Pensamento Arquitetural', description: 'Acertar 3 questões difíceis', icon: '🧠', category: 'diagnosis', rarity: 'rare' },

    // --- Especialização (Exemplos) ---
    { id: 'mestre_camadas', name: 'Mestre das Camadas', description: 'Acertar 3 variações de Layers', icon: '🍰', category: 'pattern', rarity: 'common' },
    { id: 'senhor_mvc', name: 'Senhor do MVC', description: 'Acertar 3 casos de MVC', icon: '🎮', category: 'pattern', rarity: 'common' },
    
    // --- Narrativa Hexagonal ---
    { id: 'nucleo_sagrado', name: 'O Núcleo é Sagrado', description: 'Nenhuma questão com acesso direto ao core', icon: '⚛️', category: 'hexagonal', rarity: 'legendary' },

    // --- Performance ---
    { id: 'arquiteto_agil', name: 'Arquiteto Ágil', description: 'Média de tempo menor que 10s', icon: '⚡', category: 'performance', rarity: 'rare' },
    { id: 'sob_pressao', name: 'Sob Pressão', description: 'Acertar com menos de 5s restantes', icon: '💣', category: 'performance', rarity: 'rare' },

    // --- Narrativa (Roleplay) ---
    { id: 'estagiario_promissor', name: 'Estagiário Promissor', description: 'Completar Fase 1', icon: '📝', category: 'narrative', rarity: 'common' },
    { id: 'guardiao_city', name: 'Guardião da City', description: 'Concluir todas as fases', icon: '🏙️', category: 'narrative', rarity: 'legendary' },

    // --- Exploração ---
    { id: 'nova_investigacao', name: 'Nova Investigação', description: 'Rejogar uma fase', icon: '🔄', category: 'exploration', rarity: 'common' },
    { id: 'e_se', name: 'E se fosse diferente?', description: 'Errar e tentar novamente', icon: '🤔', category: 'exploration', rarity: 'common' },

    // --- Especiais ---
    { id: 'lenda_city', name: 'Lenda da ArchPattern City', description: 'Conquistar todos os troféus', icon: '🏆', category: 'special', rarity: 'legendary' },
];