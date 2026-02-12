import { ACHIEVEMENTS_LIST } from '../data/achievements';
import type { PlayerTitle, UserProfile } from '../types/game';

export const XP_TABLE = {
    BASE_PHASE: 100,
    REPLAY_FACTOR: 0.1,
    PERFECT_BONUS: 50
};

// Configuração de XP para cada Nível
const LEVEL_THRESHOLDS = [0, 200, 600, 1200, 2000, 3000, 4200, 5600, 7200, 9000];

// Títulos baseados no Nível
const TITLES: PlayerTitle[] = [
    'Estagiário Investigador', // Nível 1
    'Desenvolvedor Júnior',    // Nível 2
    'Desenvolvedor Pleno',     // Nível 3
    'Arquiteto Sênior',        // Nível 4
    'Mestre Arquiteto'         // Nível 5+
];

export const calculateLevel = (xp: number): number => {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
        else break;
    }
    return level;
};

export const getTitleForLevel = (level: number): PlayerTitle => {
    const index = Math.min(Math.floor((level - 1) / 2), TITLES.length - 1);
    return TITLES[index];
};

// Função Pura para verificar novas conquistas
export const checkAchievements = (
    user: UserProfile, 
    sessionData: { 
        score: number, 
        correctCount: number, 
        totalQuestions: number,
        timeLeftTotal: number, 
        isReplay: boolean,
        phaseId: string
    }
): string[] => {
    const newBadges: string[] = [];
    const currentBadges = user.unlockedBadges || [];

    const unlock = (id: string) => {
        if (!currentBadges.includes(id) && !newBadges.includes(id)) {
            newBadges.push(id);
        }
    };

    // --- LÓGICA DE DIAGNÓSTICO ---
    if (sessionData.correctCount >= 5) unlock('diag_preciso');
    if (sessionData.correctCount === sessionData.totalQuestions) unlock('olho_clinico');

    // --- LÓGICA DE NARRATIVA (Fases Individuais) ---
    if (sessionData.phaseId === 'p1_garage') unlock('estagiario_promissor');
    if (sessionData.phaseId === 'p2_commercial') unlock('desenvolvedor_confiavel');
    if (sessionData.phaseId === 'p3_industrial') unlock('arquiteto_formacao');
    if (sessionData.phaseId === 'p4_digital') unlock('tech_lead');
    if (sessionData.phaseId === 'p5_tower') unlock('arquiteto_mestre');

    // --- LÓGICA: GUARDIÃO DA CITY (Todas as Fases) ---
    const allCompletedPhases = new Set([...user.completedPhases, sessionData.phaseId]);
    
    if (allCompletedPhases.size >= 5) {
        unlock('guardiao_city'); 
    }

    // --- LÓGICA DE PERFORMANCE ---
    const avgTimeSpent = (30 * sessionData.totalQuestions - sessionData.timeLeftTotal) / sessionData.totalQuestions;
    if (sessionData.correctCount > 0 && avgTimeSpent < 10) unlock('arquiteto_agil');

    // --- LÓGICA DE EXPLORAÇÃO ---
    if (sessionData.isReplay) unlock('nova_investigacao');

    // --- META CONQUISTA (LENDA - Todos os Troféus) ---
    const totalUniqueBadges = new Set([...currentBadges, ...newBadges]).size;
    const totalAchievementsPossible = 12; // ajustar para o total exato de conquistas

    // Se tiver todas (exceto a lenda), ganha a lenda
    if (totalUniqueBadges >= totalAchievementsPossible - 1) {
        unlock('lenda_city');
    }

    return newBadges;
};

// Funções de Ranking
export const calculateAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
};

export const calculateAvgTime = (totalTime: number, totalQuestions: number) => {
    if (totalQuestions === 0) return 0;
    return (totalTime / totalQuestions).toFixed(1); // Segundos por questão
};

export const BADGES_DEFINITIONS = {
    'perfect_run': { icon: '🌟', name: 'Perfeccionista', desc: 'Completou uma fase com 100% de integridade' },
    'first_mission': { icon: '🎖️', name: 'Recruta', desc: 'Completou a primeira missão' },
    'veteran': { icon: '👑', name: 'Mestre', desc: 'Chegou ao nível 10' }
};

export const checkNewBadges = (currentBadges: string[], integrity: number, level: number): string[] => {
    const newBadges: string[] = [];

    if (integrity === 100 && !currentBadges.includes('perfect_run')) {
        newBadges.push('perfect_run');
    }
    
    if (level >= 10 && !currentBadges.includes('veteran')) {
        newBadges.push('veteran');
    }

    return newBadges;
};