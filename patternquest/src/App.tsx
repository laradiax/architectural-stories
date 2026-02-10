// src/App.tsx
import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PhaseMap } from './components/narrative/PhaseMap';
import { QuizEngine } from './components/game/QuizEngine';
import phasesData from './data/phases.json';
import './styles/global.css';

// Mock de dados para teste visual
const mockUser = {
  name: "Dev. Lara",
  title: "Estagiário Investigador" as const,
  level: 1,
  xp: 0,
  avatarId: "default",
  unlockedBadges: [],
  completedPhases: ["p1_garage"] 
}

const mockSession = {
  integrity: 100,
  score: 0,
  currentPhaseTitle: "Nenhuma"
};

function App() {
  const [view, setView] = useState<'map' | 'game'>('map');
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);

  const handleSelectPhase = (phaseId: string) => {
    console.log(`Fase selecionada: ${phaseId}`);
    alert(`Iniciando fase: ${phaseId}`);
    setActivePhaseId(phaseId);
    setView('game');
  };

  const handleIntegrityLoss = () => {
    console.log("Dano no sistema! -20%");
    mockSession.integrity -= 20;
  };

  const handlePhaseComplete = (score: number, passed: boolean) => {
    alert(`Fase Terminada! Score: ${score}. Passou? ${passed ? 'SIM' : 'NÃO'}`);
    setView('map');
    setActivePhaseId(null);
  };

  // Encontra o objeto da fase atual
  const activePhase = phasesData.find(p => p.id === activePhaseId);

  return (
    <Layout user={mockUser} session={mockSession}>
      {view === 'map' && (
        <PhaseMap 
          completedPhases={mockUser.completedPhases} 
          onSelectPhase={handleSelectPhase} 
        />
      )}
      {view === 'game' && activePhase && (
        <QuizEngine 
          phase={activePhase}
          onIntegrityLoss={handleIntegrityLoss}
          onCompletePhase={handlePhaseComplete}
        />
      )}
    </Layout>
  );
}

export default App;