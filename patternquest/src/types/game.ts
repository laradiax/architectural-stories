// --- Tipos Básicos ---
export interface LocalizedText {
    pt: string;
    en: string;
}

export type PlayerTitle = 
  | 'Estagiário Investigador' 
  | 'Desenvolvedor Júnior' 
  | 'Desenvolvedor Pleno' 
  | 'Arquiteto Sênior' 
  | 'Mestre Arquiteto';

export type QuestionType = 'pattern_match' | 'boolean' | 'code_gap';

// --- Preferências e Estatísticas ---
export interface UserPreferences {
    theme: 'light' | 'dark';
    language: 'pt' | 'en';
    soundEnabled: boolean;
}

export interface UserStats {
    totalQuestions: number;
    totalCorrect: number;
    totalTime: number;
    consecutiveCorrect: number;
    phasesReplayed: number;
}

// --- Perfil do Usuário (Completo) ---
export interface UserProfile {
    name: string;
    password?: string;
    title: PlayerTitle;
    level: number;
    xp: number;
    integrity: number;       // Vida Global (0-100)
    avatarId: string;        // Avatar
    stats: UserStats;        // Estatísticas
    unlockedBadges: string[]; // Conquistas
    completedPhases: string[];
    preferences: UserPreferences;
}

// --- Conteúdo do Jogo (Fases e Questões) ---
export interface Question {
    id: string;
    type?: QuestionType;
    title: LocalizedText;
    problem: LocalizedText;
    codeSnippet?: string;
    correctId: string;
    wrongOptions: string[];
    reason: LocalizedText;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Phase {
    id: string;
    title: LocalizedText;
    subtitle: LocalizedText;
    narrativeIntro: LocalizedText;
    dominantPattern: string;
    requiredScore: number;
    theme: string;
    questions: Question[];
}

export interface Pattern {
    id: string;
    name: LocalizedText;
    desc: LocalizedText;
    pros: LocalizedText;
    cons: LocalizedText;
    type: 'structural' | 'distributed' | 'messaging' | 'anti-pattern' | 'interface' | 'creation' | 'behavioral' | 'integration' | 'data' | 'transactional';
}

// --- Sessão Temporária ---
export interface GameSession {
    integrity: number;
    score: number;
    currentPhaseTitle: LocalizedText | string;
}