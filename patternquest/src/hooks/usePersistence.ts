import { useState, useEffect } from 'react';
import type { UserProfile, UserPreferences } from '../types';
import { calculateLevel, getTitleForLevel } from '../utils/gamification';

const STORAGE_KEY = 'PATTERN_QUEST_SAVE_V1';

const INITIAL_PREFERENCES = { theme: 'light', language: 'pt', soundEnabled: true };

const INITIAL_PROFILE_TEMPLATE: Omit<UserProfile, 'name'| 'password'> = {
    title: "Estagiário Investigador",
    level: 1,
    xp: 0,
    avatarId: "default",
    unlockedBadges: [],
    completedPhases: [],
    preferences: INITIAL_PREFERENCES
};

type SaveDatabase = Record<string, UserProfile>;

export const usePersistence = () => {
    const [allUsers, setAllUsers] = useState<SaveDatabase>({});
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    //Atualizar preferências
    const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
        if (!currentUser) return;
        
        // Atualiza o estado local e persiste
        const updatedUser = {
            ...currentUser,
            preferences: { ...currentUser.preferences, ...newPrefs }
        };
        
        setCurrentUser(updatedUser);
        
        const newDb = { ...allUsers, [currentUser.name]: updatedUser };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
        setAllUsers(newDb);
    };

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
    const login = (username: string , passwordInput: string): { success: boolean; message?: string } => {
        if (!username) return { success: false, message: 'Nome obrigatório' };
        
        const key = username.trim();
        if (key === "") return { success: false, message: 'Nome inválido' };
        
        if (allUsers[key]) {
            // Usuário JÁ EXISTE: Carrega ele
            const storedUser=allUsers[key];
            if (storedUser.password && storedUser.password !== passwordInput) {
                return { success: false, message: 'Senha incorreta!' };
            }
            setCurrentUser(storedUser);
            return { success: true };
        } else {
            if (!passwordInput || passwordInput.length < 3) {
                return { success: false, message: 'Crie uma senha de pelo menos 3 dígitos.' };
            }
            // Usuário NOVO: Cria e salva
            const newUser: UserProfile = {
                ...INITIAL_PROFILE_TEMPLATE,
                name: key,
                password: passwordInput
            };
            const newDb = { ...allUsers, [key]: newUser };
            persistData(newDb);
            setCurrentUser(newUser);
            return { success: true };
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
        resetSave,
        updatePreferences };
};