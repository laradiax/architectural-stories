import type { PlayerTitle } from '../types';

// Configuração de XP para cada Nível
const LEVEL_THRESHOLDS = [0, 200, 600, 1200, 2000];

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
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
};

export const getTitleForLevel = (level: number): PlayerTitle => {
    // Garante que não estoure o array (nível máximo tem o último título)
    const index = Math.min(level - 1, TITLES.length - 1);
    return TITLES[index];
};

export const calculateXPGain = (score: number, firstTime: boolean): number => {
    // Se for replay, ganha apenas 10% (para evitar grind infinito fácil)
    return firstTime ? score : Math.floor(score * 0.1);
};