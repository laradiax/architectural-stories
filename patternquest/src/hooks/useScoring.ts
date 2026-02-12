import { useCallback } from 'react';
import type { UserProfile, UserStats } from '../types/game';
import { checkAchievements, calculateLevel, getTitleForLevel, XP_TABLE } from '../utils/gamification';

interface SessionResult {
    phaseId: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    timeLeftTotal: number; // Soma do tempo que sobrou
    isReplay: boolean;
}

export const useScoring = () => {

    // 1. Calcula Pontuação da Questão
    const calculateQuestionScore = useCallback((timeLeft: number, maxTime: number) => {
        // Base: 50pts + Bônus de tempo (até 50pts)
        const timeRatio = timeLeft / maxTime;
        const timeBonus = Math.floor(50 * timeRatio);
        return 50 + timeBonus;
    }, []);

    // 2. Processa o Resultado Final da Fase
    const processPhaseResult = useCallback((user: UserProfile, result: SessionResult) => {
        
        // --- A. Atualizar Estatísticas (Para o Ranking) ---
        // Tempo Gasto = (Tempo Max * Questões) - Tempo Sobrado
        const timeSpentInPhase = (30 * result.totalQuestions) - result.timeLeftTotal;

        const newStats: UserStats = {
            totalQuestions: (user.stats?.totalQuestions || 0) + result.totalQuestions,
            totalCorrect: (user.stats?.totalCorrect || 0) + result.correctCount,
            totalTime: (user.stats?.totalTime || 0) + timeSpentInPhase,
            consecutiveCorrect: result.correctCount === result.totalQuestions 
                ? (user.stats?.consecutiveCorrect || 0) + result.correctCount 
                : 0,
            phasesReplayed: (user.stats?.phasesReplayed || 0) + (result.isReplay ? 1 : 0)
        };

        // --- B. Verificar Conquistas ---
        const newBadges = checkAchievements(user, {
            ...result,
            timeLeftTotal: result.timeLeftTotal // Passa o tempo sobrado para calcular média
        });
        
        const allBadges = Array.from(new Set([...user.unlockedBadges, ...newBadges]));

        // --- C. Calcular XP e Nível ---
        let xpGained = result.isReplay 
            ? Math.floor(result.score * XP_TABLE.REPLAY_FACTOR) 
            : result.score;
        
        // Bônus Perfect
        if (result.correctCount === result.totalQuestions) {
            xpGained += XP_TABLE.PERFECT_BONUS;
        }

        const newXP = user.xp + xpGained;
        const newLevel = calculateLevel(newXP);
        const newTitle = getTitleForLevel(newLevel);

        // --- D. Integridade Global ---
        const integrityBonus = result.isReplay ? 5 : 25;
        const newIntegrity = Math.min(100, (user.integrity || 0) + integrityBonus);

        // Retorna objeto pronto para salvar
        return {
            updatedUser: {
                ...user,
                xp: newXP,
                level: newLevel,
                title: newTitle,
                integrity: newIntegrity,
                stats: newStats,
                unlockedBadges: allBadges,
                completedPhases: result.isReplay 
                    ? user.completedPhases 
                    : [...user.completedPhases, result.phaseId]
            },
            xpGained,
            newBadges
        };

    }, []);

    return {
        calculateQuestionScore,
        processPhaseResult
    };
};