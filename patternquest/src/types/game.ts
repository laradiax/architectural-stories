// Níveis de Profissional
export type PlayerTitle = 
  | 'Estagiário Investigador' 
  | 'Desenvolvedor Júnior' 
  | 'Desenvolvedor Pleno' 
  | 'Arquiteto Sênior' 
  | 'Mestre Arquiteto';

// Estrutura do Perfil do Usuário
export interface UserProfile {
  name: string;
  title: PlayerTitle;
  level: number;
  xp: number;
  unlockedBadges: string[]; // IDs das conquistas
  completedPhases: string[]; // IDs das fases
}

// Estrutura de uma Questão
export interface Question {
  id: string;
  title: string;
  problem: string;
  correctId: string; // ID do padrão correto
  wrongOptions: string[]; // IDs dos padrões incorretos
  reason: string; // Explicação técnica
  difficulty: 'easy' | 'medium' | 'hard';
}

// Estrutura de uma Fase
export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  narrativeIntro: string;
  dominantPattern: string; // ex: 'Layers'
  requiredScore: number;
  questions: Question[];
}

// Estrutura do Padrão (Biblioteca)
export interface Pattern {
  id: string;
  name: string;
  desc: string;
  pros: string;
  cons: string;
  type: 'structural' | 'distributed' | 'messaging'; // Categorização opcional
}