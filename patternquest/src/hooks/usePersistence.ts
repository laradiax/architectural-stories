import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { calculateLevel, getTitleForLevel } from '../utils/gamification';

const STORAGE_KEY = 'PATTERN_QUEST_SAVE_V1';

const INITIAL_PROFILE: UserProfile = {
    name: "Investigador",
    title: "Estagiário Investigador",
    level: 1,
    xp: 0,
    avatarId: "default",
    unlockedBadges: [],
    completedPhases: []
};

export const usePersistence = () => {
    const [user, setUser] = useState<UserProfile>(INITIAL_PROFILE);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Carregar ao iniciar
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setUser(JSON.parse(savedData));
            } catch (e) {
                console.error("Erro ao carregar save:", e);
                setUser(INITIAL_PROFILE);
            }
        }
        setIsLoaded(true);
    }, []);

    // 2. Salvar Progresso (Chamado ao completar fase)
    const saveProgress = (phaseId: string, score: number) => {
        setUser((prevUser) => {
            // Verifica se é a primeira vez completando essa fase
            const isFirstTime = !prevUser.completedPhases.includes(phaseId);
            
            // Calcula novo XP
            // (Replay dá 10% de XP, Primeira vez dá 100%)
            const xpGained = isFirstTime ? score : Math.floor(score * 0.1);
            const newXP = prevUser.xp + xpGained;
            
            // Recalcula Nível e Título
            const newLevel = calculateLevel(newXP);
            const newTitle = getTitleForLevel(newLevel);

            // Atualiza lista de fases completadas
            const newCompletedPhases = isFirstTime 
                ? [...prevUser.completedPhases, phaseId]
                : prevUser.completedPhases;

            const updatedUser: UserProfile = {
                ...prevUser,
                xp: newXP,
                level: newLevel,
                title: newTitle,
                completedPhases: newCompletedPhases
            };

            // Salva no disco
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
            
            return updatedUser;
        });
    };

    // 3. Resetar Save (Para testes)
    const resetSave = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(INITIAL_PROFILE);
    };

    return { user, isLoaded, saveProgress, resetSave };
};