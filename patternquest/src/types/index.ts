export type PlayerTitle = 
  | 'Estagiário Investigador' 
  | 'Desenvolvedor Júnior' 
  | 'Desenvolvedor Pleno' 
  | 'Arquiteto Sênior' 
  | 'Mestre Arquiteto';

export interface UserProfile {
  name: string;
  title: PlayerTitle;
  level: number;
  avatarId: string;
}

export interface GameSession {
  integrity: number; // 0 a 100
  score: number;
  currentPhaseTitle: string;
}