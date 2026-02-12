export interface UserPreferences {
    theme: 'light' | 'dark';
    language: 'pt' | 'en';
    soundEnabled: boolean;
}

export type PlayerTitle = 
  | 'Estagiário Investigador' 
  | 'Desenvolvedor Júnior' 
  | 'Desenvolvedor Pleno' 
  | 'Arquiteto Sênior' 
  | 'Mestre Arquiteto';

export interface UserProfile {
  name: string;
  password: string;
  title: PlayerTitle;
  level: number;
  avatarId: string;
  xp: number;
  integrity: number;            
  unlockedBadges: string[];
  completedPhases: string[];
  preferences: UserPreferences;
}

export interface GameSession {
  integrity: number; // 0 a 100
  score: number;
  currentPhaseTitle: string;
}

export interface Phase {
    id: string;
    title: string;
    subtitle: string;
    narrativeIntro: string;
    dominantPattern: string;
    requiredScore: number;
    questions: any[]; 
}