// src/App.tsx
import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PhaseMap } from './components/narrative/PhaseMap';
import { QuizEngine } from './components/game/QuizEngine';
import { PhaseResult } from './components/game/PhaseResult';
import phasesData from './data/phases.json';
import { usePersistence } from './hooks/usePersistence';
import { Briefing } from './components/narrative/Briefing';
import './styles/global.css';

function App() {
  const { user, isLoaded, saveProgress, resetSave } = usePersistence();
  const [view, setView] = useState<'map' | 'briefing' | 'game' | 'result'>('map');
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [sessionIntegrity, setSessionIntegrity] = useState(100);
  const [sessionScore, setSessionScore] = useState(0);
  const [lastResult, setLastResult] = useState<{passed: boolean; reason?: 'integrity'|'score'} | null>(null);

  if (!isLoaded) return <div className="app-container flex-center">Carregando perfil...</div>;

  // 1. Selecionar Fase (Abre Briefing)
  const handleSelectPhase = (phaseId: string) => {
    console.log(`Fase selecionada: ${phaseId}`);
    alert(`Iniciando fase: ${phaseId}`);
    setActivePhaseId(phaseId);
    setView('briefing');
  };

  // 2. Aceitar Missão (Começa o Jogo)
  const handleStartMission = () => {
    setSessionIntegrity(100);
    setSessionScore(0);
    setView('game');
  };

  // 3. Cancelar no Briefing
  const handleCancelBriefing = () => {
    setActivePhaseId(null);
    setView('map');
  };

  const handleIntegrityLoss = () => {
    console.log("Dano no sistema! -20%");
    setSessionIntegrity(prev => Math.max(0, prev - 20));
  };

  // 4. Fim da Fase
  const handlePhaseComplete = (score: number, passed: boolean) => {
    const integrityPassed = sessionIntegrity > 0;
    const finalPassed = passed && integrityPassed;
    setSessionScore(score);

    if (finalPassed && activePhaseId) {
        saveProgress(activePhaseId, score);
    }
    
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

  // 5. Reinicia a Fase
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
    <Layout user={user} session={currentSession}>
      {view === 'map' && (
        <PhaseMap 
          completedPhases={user.completedPhases} 
          onSelectPhase={handleSelectPhase} 
        />
      )}
      {view === 'briefing' && activePhase && (
        <Briefing 
            phase={activePhase}
            onStartMission={handleStartMission}
            onCancel={handleCancelBriefing}
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