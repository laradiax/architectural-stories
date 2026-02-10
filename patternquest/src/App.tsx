// src/App.tsx
import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PhaseMap } from './components/narrative/PhaseMap';
import './styles/global.css';

// Mock de dados para teste visual
const mockUser = {
  name: "Dev. Alex",
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
  const [view, setView] = useState('map');

  const handleSelectPhase = (phaseId: string) => {
    console.log(`Fase selecionada: ${phaseId}`);
    alert(`Iniciando fase: ${phaseId}`);
    // Futuramente aqui mudaremos o setView('narrative') ou setView('game')
  };

  return (
    <Layout user={mockUser} session={mockSession}>
      {view === 'map' && (
        <PhaseMap 
          completedPhases={mockUser.completedPhases} 
          onSelectPhase={handleSelectPhase} 
        />
      )}
    </Layout>
  );
}

export default App;