import { usePersistence } from './usePersistence';
import { getGameContent } from '../data/contentManager';
import type { Language } from '../data/contentManager';

export const useGameData = () => {
    const { currentUser } = usePersistence();
    
    // Detecta idioma (padrão PT)
    const currentLang: Language = currentUser?.preferences?.language || 'pt';
    
    // Pega o conteúdo correto baseado no idioma
    const content = getGameContent(currentLang);

    return {
        lang: currentLang,
        phases: content.phases,
        patterns: content.patterns,
        t: content.ui // 't' é o padrão comum para tradução (translator)
    };
};