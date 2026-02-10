import phasesPT from './phases-pt.json';
import phasesEN from './phases-en.json';
import patternsPT from './patterns-pt.json';
import patternsEN from './patterns-en.json';
import { translations } from './i18n'; 
import type { Phase, Pattern } from '../types';

export type Language = 'pt' | 'en';

// Hook ou Função Helper para pegar dados
export const getGameContent = (lang: Language) => {
    return {
        phases: (lang === 'pt' ? phasesPT : phasesEN) as Phase[],
        patterns: (lang === 'pt' ? patternsPT : patternsEN) as Pattern[],
        ui: translations[lang]
    };
};