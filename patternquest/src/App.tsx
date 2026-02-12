import { useState, useEffect } from 'react';
import { Layout } from './components/layout/layout';
import { SystemDialog } from './components/layout/SystemDialog';
import { StartScreen } from './components/layout/StartScreen';
import { PhaseMap } from './components/narrative/PhaseMap';
import { QuizEngine } from './components/game/QuizEngine';
import { PhaseResult } from './components/game/PhaseResult';
import { Briefing } from './components/narrative/Briefing';
import { SettingsModal } from './components/layout/SettingsModal';
import { Leaderboard } from './components/game/Leaderboard'; 
import { Achievements } from './components/game/Achievements'; // Ajustei o nome para o padrão

import { usePersistence } from './hooks/usePersistence';
import { useGameData } from './hooks/useGameData';
import { useScoring } from './hooks/useScoring';
import { playSound } from './utils/audio';
import './styles/global.css';

function App() {
  const { currentUser, saveUserData, updatePreferences, allUsers, isLoaded, login, logout, resetSave } = usePersistence();
  const { phases, patterns, t } = useGameData();
  const { processPhaseResult } = useScoring();

  // Estados de Navegação e UI
  const [view, setView] = useState<'start' | 'map' | 'briefing' | 'game' | 'result'>('start');
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  
  // Modais
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Estados da Sessão Atual
  const [sessionScore, setSessionScore] = useState(0);
  const [lastResult, setLastResult] = useState<{passed: boolean; reason?: 'score' | 'integrity'} | null>(null);
  const [sessionIntegrity, setSessionIntegrity] = useState(100);

  const soundEnabled = currentUser?.preferences?.soundEnabled ?? true;
  const prefs = currentUser?.preferences || { theme: 'light', language: 'pt', soundEnabled: true };

  // Estado para confirmações
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'danger' | 'success';
    isConfirmation: boolean;
    onConfirmAction: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirmation: false,
    onConfirmAction: () => {},
  });

  // Efeito de Som Global
  useEffect(() => {
      const handleGlobalClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('button, .option-btn, .district-card')) {
          playSound('click.mp3', soundEnabled);
        }
      };
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }, [soundEnabled]);

  // Efeito de Tema
  useEffect(() => {
    if (prefs.theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
  }, [currentUser?.preferences?.theme]);

  // Efeito de Login
  useEffect(() => {
      if (currentUser) {
          if (view === 'start') setView('map');
      } else {
          setView('start');
      }
    }, [currentUser]);

  if (!isLoaded) return <div className="app-container flex-center">Carregando sistema...</div>;

  // --- Funções de Controle ---

  const showConfirm = (title: string, message: string, action: () => void, type: 'danger' | 'info' = 'info') => {
    setDialogConfig({ isOpen: true, title, message, type, isConfirmation: true, onConfirmAction: action });
  };

  const closeDialog = () => setDialogConfig(prev => ({ ...prev, isOpen: false }));
  
  const handleDialogConfirm = () => { dialogConfig.onConfirmAction(); closeDialog(); };

  const handleLogin = (u: string, p: string) => login(u, p);

  const handleLogout = () => {
    showConfirm(t.dialogLogoutTitle, t.dialogLogoutMsg, () => { logout(); setView('start'); }, 'danger');
  };

  const handleReturnToMap = () => {
    if (view === 'game') {
        showConfirm(t.dialogAbortTitle, t.dialogAbortMsg, () => {
            setActivePhaseId(null);
            setSessionScore(0);
            setView('map');
        }, 'danger');
    } else {
        setActivePhaseId(null);
        setView('map');
    }
  };

  const handleSelectPhase = (id: string) => { setActivePhaseId(id); setView('briefing'); };
  
  const handleStartMission = () => { 
    setSessionScore(0);
    setSessionIntegrity(100); // <--- RESET
    setView('game');
  };
  
  const handleCancelBriefing = () => { setActivePhaseId(null); setView('map'); };

  // --- Lógica de Fim de Fase ---
  const handlePhaseComplete = (score: number, passed: boolean, stats: any) => {
    const finalPassed = passed;
    setSessionScore(score);

    if (finalPassed && activePhaseId && currentUser) {
        // Processa XP e Conquistas
        const { updatedUser, newBadges } = processPhaseResult(currentUser, {
            phaseId: activePhaseId,
            score: score,
            correctCount: stats.correct,
            totalQuestions: stats.total,
            timeLeftTotal: stats.timeLeft,
            isReplay: currentUser.completedPhases.includes(activePhaseId)
        });

        // Salva
        saveUserData(updatedUser);

        if (newBadges.length > 0) {
            console.log("Conquistas:", newBadges);
            // Opcional: Mostrar modal de conquista
        }
    }
    
    setLastResult({ passed: finalPassed, reason: passed ? undefined : 'score' });
    setView('result');
  };

  const handleBackToMap = () => { setView('map'); setActivePhaseId(null); };
  
  const handleRetry = () => { setSessionScore(0); setView('game');setSessionIntegrity(100); };

  const handleIntegrityLoss = () => {
      setSessionIntegrity(prev => {
          const newVal = Math.max(0, prev - 50);
          
          if (newVal === 0) {
              setTimeout(() => {
                  setLastResult({ passed: false, reason: 'integrity' }); // Motivo: integridade
                  setView('result');
              }, 1000);
          }
          return newVal;
      });
  };

  // --- Renderização ---
  const activePhase = phases.find(p => p.id === activePhaseId);
  
  const currentSession = {
      integrity: view === 'game' ? sessionIntegrity : (currentUser?.integrity || 0), // <--- LÓGICA HÍBRIDA
      score: sessionScore,
      currentPhaseTitle: activePhase?.title || "ArchPattern City",
      scoreLabel: view === 'game' ? "Score Missão" : "XP Total"
  };
  return (
    <>
      {!currentUser && <StartScreen onLogin={handleLogin} existingUsers={allUsers} />}

      {currentUser && (
        <Layout 
            user={currentUser} 
            session={currentSession}
            onLogout={handleLogout}
            onSettings={() => setIsSettingsOpen(true)}
            onShowRanking={() => setIsLeaderboardOpen(true)} 
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
                <button onClick={() => setIsAchievementsOpen(true)} className="sys-btn sys-btn-info">
                  🏅 Ver Conquistas
                </button>
                <div style={{textAlign: 'center', marginTop: '2rem', display:'flex', gap:'1rem', justifyContent:'center'}}>
                    <button onClick={resetSave} style={{fontSize: '0.7rem', cursor: 'pointer', opacity: 0.5, background:'none', border:'none', color:'#fff'}}>
                        [Reset]
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
                onCompletePhase={handlePhaseComplete}
                onScoreUpdate={setSessionScore} // Passa o setter para atualizar o HUD em tempo real
                onIntegrityLoss={handleIntegrityLoss}
                soundEnabled={soundEnabled}
                language={currentUser?.preferences?.language || 'pt'}
            />
          )}

          {view === 'result' && activePhase && lastResult && (
            <PhaseResult 
                passed={lastResult.passed}
                failReason={lastResult.reason}
                score={sessionScore}
                requiredScore={activePhase.requiredScore}
                integrity={currentUser.integrity}
                onContinue={handleBackToMap}
                onRetry={handleRetry}
            />
          )}
        </Layout>
      )}

      {/* Modais Globais */}
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

      {isLeaderboardOpen && (
          <Leaderboard onClose={() => setIsLeaderboardOpen(false)} />
      )}

      {isAchievementsOpen && currentUser && (
          <Achievements 
            unlockedIds={currentUser.unlockedBadges} 
            onClose={() => setIsAchievementsOpen(false)} 
          />
      )}
    </>
  );
}

export default App;