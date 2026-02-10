// src/App.tsx
import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PhaseMap } from './components/narrative/PhaseMap';
import { QuizEngine } from './components/game/QuizEngine';
import { PhaseResult } from './components/game/PhaseResult';
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
  completedPhases: [] 
}

function App() {
  const [view, setView] = useState<'map' | 'game' | 'result'>('map');
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [sessionIntegrity, setSessionIntegrity] = useState(100);
  const [sessionScore, setSessionScore] = useState(0);
  const [lastResult, setLastResult] = useState<{passed: boolean} | null>(null);

  const handleSelectPhase = (phaseId: string) => {
    console.log(`Fase selecionada: ${phaseId}`);
    alert(`Iniciando fase: ${phaseId}`);
    setActivePhaseId(phaseId);
    setSessionIntegrity(100);
    setSessionScore(0);
    setView('game');
  };

  const handleIntegrityLoss = () => {
    console.log("Dano no sistema! -20%");
    setSessionIntegrity(prev => Math.max(0, prev - 20));
  };

  const handlePhaseComplete = (score: number, passed: boolean) => {
    setSessionScore(score);
    
    const integrityPassed = sessionIntegrity > 0;
    const finalPassed = passed && integrityPassed;
    
    let failReason: 'integrity' | 'score' | undefined;
    if (!integrityPassed) failReason = 'integrity';
    else if (!passed) failReason = 'score';

    setLastResult({ passed: finalPassed, reason: failReason });
    setView('result');
  };

  const handleBackToMap = () => {
    setView('map');
    setActivePhaseId(null);
    setSessionIntegrity(100); // Visual reset
  };

  const handleRetry = () => {
    // Reinicia a mesma fase
    setSessionIntegrity(100);
    setSessionScore(0);
    setView('game');
  };

  // Encontra o objeto da fase atual
  const activePhase = phasesData.find(p => p.id === activePhaseId);

  const currentSession = {
    integrity: sessionIntegrity,
    score: sessionScore,
    currentPhaseTitle: activePhase?.title || "TechCity"
  };

  return (
    <Layout user={mockUser} session={currentSession}>
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
      {view === 'result' && activePhase && lastResult && (
        <PhaseResult 
            passed={lastResult.passed}
            failReason={lastResult.reason}
            score={sessionScore}
            requiredScore={activePhase.requiredScore}
            integrity={sessionIntegrity}
            onContinue={handleBackToMap}
            onRetry={handleRetry}
        />
      )}
    </Layout>
  );
}

export default App;