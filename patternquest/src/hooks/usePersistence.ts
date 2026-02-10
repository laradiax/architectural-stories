import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { calculateLevel, getTitleForLevel } from '../utils/gamification';

const STORAGE_KEY = 'PATTERN_QUEST_SAVE_V1';

const INITIAL_PROFILE_TEMPLATE: Omit<UserProfile, 'name'> = {
    title: "Estagiário Investigador",
    level: 1,
    xp: 0,
    avatarId: "default",
    unlockedBadges: [],
    completedPhases: []
};

type SaveDatabase = Record<string, UserProfile>;

export const usePersistence = () => {
    const [allUsers, setAllUsers] = useState<SaveDatabase>({});
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Carregar ao iniciar
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setAllUsers(JSON.parse(savedData));
            } catch (e) {
                console.error("Erro ao carregar save V2:", e);
                setAllUsers({});
            }
        }
        setIsLoaded(true);
    }, []);

    // Helper interno para persistir no localStorage
    const persistData = (data: SaveDatabase) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setAllUsers(data);
    };

    // 2. Função de Login / Cadastro
    const login = (username: string) => {
        const key = username.trim();
        
        if (allUsers[key]) {
            // Usuário JÁ EXISTE: Carrega ele
            setCurrentUser(allUsers[key]);
        } else {
            // Usuário NOVO: Cria e salva
            const newUser: UserProfile = {
                ...INITIAL_PROFILE_TEMPLATE,
                name: key
            };
            const newDb = { ...allUsers, [key]: newUser };
            persistData(newDb);
            setCurrentUser(newUser);
        }
    };

    // 3. Logout
    const logout = () => {
        setCurrentUser(null);
    };

    // 4. Salvar Progresso (Chamado ao completar fase)
    const saveProgress = (phaseId: string, score: number) => {
        if (!currentUser) return;
            // Verifica se é a primeira vez completando essa fase
            const isFirstTime = !currentUser.completedPhases.includes(phaseId);
            
            // Calcula novo XP
            // (Replay dá 10% de XP, Primeira vez dá 100%)
            const xpGained = isFirstTime ? score : Math.floor(score * 0.1);
            const newXP = currentUser.xp + xpGained;
            
            // Recalcula Nível e Título
            const newLevel = calculateLevel(newXP);
            const newTitle = getTitleForLevel(newLevel);

            // Atualiza lista de fases completadas
            const newCompletedPhases = isFirstTime 
                ? [...currentUser.completedPhases, phaseId]
                : currentUser.completedPhases;

            const updatedUser: UserProfile = {
                ...currentUser,
                xp: newXP,
                level: newLevel,
                title: newTitle,
                completedPhases: newCompletedPhases
            };

        // Atualiza o estado atual e o banco de dados
        setCurrentUser(updatedUser);
        
        const newDb = {
            ...allUsers,
            [currentUser.name]: updatedUser
        };
        persistData(newDb);
    };

    // 5. Resetar Save (Para testes)
    const resetSave = () => {
        if (window.confirm("Isso apagará TODOS os usuários. Tem certeza?")) {
            localStorage.removeItem(STORAGE_KEY);
            setAllUsers({});
            setCurrentUser(null);
        }
    };

    return { currentUser,
        allUsers,       
        isLoaded, 
        login, 
        logout,
        saveProgress, 
        resetSave };
};