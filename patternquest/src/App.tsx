import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { SystemDialog } from './components/layout/SystemDialog';
import { StartScreen } from './components/layout/StartScreen';
import { PhaseMap } from './components/narrative/PhaseMap';
import { QuizEngine } from './components/game/QuizEngine';
import { PhaseResult } from './components/game/PhaseResult';
import { usePersistence } from './hooks/usePersistence';
import { Briefing } from './components/narrative/Briefing';
import { SettingsModal } from './components/layout/SettingsModal';
import { useGameData } from './hooks/useGameData';
import './styles/global.css';

function App() {
  const { currentUser, updatePreferences, allUsers, isLoaded, login, logout, saveProgress, resetSave } = usePersistence();
  const { phases, patterns, t } = useGameData();
  const [view, setView] = useState<'start' |'map' | 'briefing' | 'game' | 'result'>('map');
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Estado da sessão (temporário)
  const [sessionIntegrity, setSessionIntegrity] = useState(100);
  const [sessionScore, setSessionScore] = useState(0);
  const [lastResult, setLastResult] = useState<{passed: boolean; reason?: 'integrity'|'score'} | null>(null);
  const prefs = currentUser?.preferences || { theme: 'light', language: 'pt', soundEnabled: true };

  //Estado para confirmações
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'danger' | 'success';
    isConfirmation: boolean;
    onConfirmAction: () => void; // Guarda a função que será executada
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirmation: false,
    onConfirmAction: () => {},
  });

  //Efeito para aplicar tema
  useEffect(() => {
    if (prefs.theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
  }, [currentUser?.preferences?.theme]);

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

  // Funcções de controle (config, sair, voltar)

    // Helper para abrir o diálogo facilmente
  const showConfirm = (title: string, message: string, action: () => void, type: 'danger' | 'info' = 'info') => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      type,
      isConfirmation: true,
      onConfirmAction: action
    });
  };

  const showAlert = (title: string, message: string) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      type: 'info',
      isConfirmation: false,
      onConfirmAction: () => setDialogConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleDialogConfirm = () => {
    dialogConfig.onConfirmAction();
    closeDialog();
  };

  const handleLogin = (username: string, password: string) => {
    return login(username, password); 
  };

  const handleLogout = () => {
    showConfirm(
      t.dialogLogoutTitle,
      t.dialogLogoutMsg,
      () => {
        logout();
        setView('start');
      },
      'danger'
    );
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleReturnToMap = () => {
    // Se estiver JOGANDO, precisa confirmar para não perder progresso sem querer
    if (view === 'game') {
        showConfirm(
            t.dialogAbortTitle,
            t.dialogAbortMsg,
            () => {
                setActivePhaseId(null);
                setSessionIntegrity(100);
                setSessionScore(0);
                setView('map');
            },
            'danger'
        );
    } else {
        // Se estiver no Briefing ou Resultado, volta direto
        setActivePhaseId(null);
        setView('map');
    }
  };

  // 1. Selecionar Fase (Abre Briefing)
  const handleSelectPhase = (phaseId: string) => {
    console.log(`Fase selecionada: ${phaseId}`);
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
  const activePhase = phases.find(p => p.id === activePhaseId);

  const currentSession = {
    integrity: sessionIntegrity,
    score: sessionScore,
    currentPhaseTitle: activePhase?.title || "ArchPattern City"
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
        <Layout 
            user={currentUser} 
            session={currentSession}
            onLogout={handleLogout}
            onSettings={handleSettings}
            onBackToMap={handleReturnToMap}
            isMapActive={view === 'map'}
        >
          
          {view === 'map' && (
            <>
                <PhaseMap
                  phases={phases}
                  completedPhases={currentUser.completedPhases} 
                  onSelectPhase={handleSelectPhase} 
                />
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
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
            patterns={patterns}
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
      <SystemDialog 
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        type={dialogConfig.type}
        isConfirmation={dialogConfig.isConfirmation}
        onConfirm={handleDialogConfirm}
        onCancel={closeDialog}
      />
      {currentUser && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            preferences={currentUser.preferences}
            onUpdate={updatePreferences}
            onClose={() => setIsSettingsOpen(false)}
          />
      )}
    </>
  );
}

export default App;