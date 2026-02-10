import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { StartScreen } from './components/layout/StartScreen';
import { PhaseMap } from './components/narrative/PhaseMap';
import { QuizEngine } from './components/game/QuizEngine';
import { PhaseResult } from './components/game/PhaseResult';
import phasesData from './data/phases.json';
import { usePersistence } from './hooks/usePersistence';
import { Briefing } from './components/narrative/Briefing';
import './styles/global.css';

function App() {
  const { currentUser, allUsers, isLoaded, login, logout, saveProgress, resetSave } = usePersistence();
  const [view, setView] = useState<'start' |'map' | 'briefing' | 'game' | 'result'>('map');
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  // Estado da sessão (temporário)
  const [sessionIntegrity, setSessionIntegrity] = useState(100);
  const [sessionScore, setSessionScore] = useState(0);
  const [lastResult, setLastResult] = useState<{passed: boolean; reason?: 'integrity'|'score'} | null>(null);

  // Efeito para navegar baseado no estado do login
    useEffect(() => {
      if (currentUser) {
          // Se acabou de logar e estava na tela inicial, vai pro mapa
          if (view === 'start') setView('map');
      } else {
          // Se deslogou, volta pro início
          setView('start');
      }
    }, [currentUser]);

  if (!isLoaded) return <div className="app-container flex-center">Carregando perfil...</div>;

  const handleLogin = (username: string, password: string) => {
    return login(username, password); 
  };

  const handleLogout = () => {
    logout();
    setView('start');
  };

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
    <>
      {/* TELA DE LOGIN / START */}
      {!currentUser && (
        <StartScreen 
            onLogin={handleLogin} 
            existingUsers={allUsers} // Passamos a lista para o menu
        />
      )}

      {/* ÁREA LOGADA */}
      {currentUser && (
        <Layout user={currentUser} session={currentSession}>
          
          {view === 'map' && (
            <>
                <PhaseMap 
                  completedPhases={currentUser.completedPhases} 
                  onSelectPhase={handleSelectPhase} 
                />
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-ghost" 
                        style={{fontSize: '0.9rem', marginRight: '1rem'}}
                    >
                        Encerrar Sessão (Logout)
                    </button>
                    <button onClick={resetSave} style={{fontSize: '0.7rem', cursor: 'pointer', opacity: 0.5}}>
                        [DEBUG] Resetar Tudo
                    </button>
                </div>
            </>
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
      )}
    </>
  );
}

export default App;