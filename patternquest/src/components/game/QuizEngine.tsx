import React, { useState, useEffect, useRef } from 'react';
import type { Phase, Pattern, LocalizedText } from '../../types/game';
import { playSound } from '../../utils/audio';
import './game.css';

interface QuizEngineProps {
  phase: Phase;
  patterns: Pattern[];
  soundEnabled: boolean;
  onCompletePhase: (score: number, passed: boolean, stats: { correct: number; total: number; timeLeft: number }) => void;
  language: 'pt' | 'en';
  onScoreUpdate?: (newScore: number) => void;
  onIntegrityLoss?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ 
  phase,
  patterns,
  onCompletePhase,
  soundEnabled,
  language = 'pt',
  onScoreUpdate,
  onIntegrityLoss
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [phaseScore, setPhaseScore] = useState(0);
  const [options, setOptions] = useState<any[]>([]);
  
  // Refs para acumular stats sem re-renderizar
  const statsRef = useRef({ correct: 0, timeLeftTotal: 0 });

  const currentQuestion = phase.questions[currentQIndex];

  const getTxt = (obj: LocalizedText | string) => {
    if (typeof obj === 'string') return obj;
    return obj[language] || obj['pt'];
  };

  const getPatternName = (id: string) => {
    const pattern = patterns.find(p => p.id === id);
    return pattern ? getTxt(pattern.name) : id.toUpperCase();
  };

  // 1. Setup da Questão
  useEffect(() => {
    if (!currentQuestion) return;
    
    const allOptions = [
      { id: currentQuestion.correctId, label: 'Correto', isCorrect: true },
      ...currentQuestion.wrongOptions.map(opt => ({ id: opt, label: opt, isCorrect: false }))
    ].sort(() => Math.random() - 0.5); 

    setOptions(allOptions);
    setTimeLeft(30);
    setIsAnswered(false);
    setSelectedOption(null);

  }, [currentQIndex, currentQuestion]);

  // 2. Timer
  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  // 3. Handler de Resposta
  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(optionId); 

    if (isCorrect) {
      // Pontuação
      let points = 50;
      if (timeLeft > 20) points = 100;
      else if (timeLeft > 10) points = 70;

      setPhaseScore(prev => {
          const newScore = prev + points;
          if (onScoreUpdate) onScoreUpdate(newScore); // <--- AVISA O APP AQUI
          return newScore;
      });
      playSound('success.mp3', soundEnabled);
      
      // Atualiza Stats Ref
      statsRef.current.correct += 1;
      statsRef.current.timeLeftTotal += timeLeft;

    } else {
      playSound('error.mp3', soundEnabled);
      if (onIntegrityLoss) onIntegrityLoss();
    }

    // Avançar
    setTimeout(() => {
      if (currentQIndex < phase.questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        // FIM DA FASE
        const passed = phaseScore >= phase.requiredScore; // Lógica simples
        onCompletePhase(phaseScore, passed, {
            correct: statsRef.current.correct,
            total: phase.questions.length,
            timeLeft: statsRef.current.timeLeftTotal
        });
      }
    }, 2000);
  };

  if (!currentQuestion) return <div>Carregando...</div>;

  return (
    <div className="quiz-container animate-enter">
      
      <div className="quiz-header">
        <span className="question-meta">
          Caso {currentQIndex + 1} / {phase.questions.length}
        </span>
        <div className="timer-container">
          <div 
            className={`timer-fill ${timeLeft < 10 ? 'danger' : timeLeft < 20 ? 'warning' : ''}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
        <span className="question-meta">{timeLeft}s</span>
      </div>

      <div className="problem-card">
        <h2>{getTxt(currentQuestion.title)}</h2>
        <p className="problem-text">{getTxt(currentQuestion.problem)}</p>
      </div>

      <div className="options-grid">
        {options.map((opt) => {
          let btnClass = 'option-btn';
          if (isAnswered) {
            if (opt.isCorrect) btnClass += ' correct'; 
            else if (selectedOption === opt.id) btnClass += ' wrong'; 
          }

          return (
            <button
              key={opt.id}
              className={btnClass}
              onClick={() => handleAnswer(opt.id, opt.isCorrect)} 
              disabled={isAnswered}
            >
              {getPatternName(opt.id)}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="feedback-panel animate-enter">
            <p className="feedback-text">
                💡 {getTxt(currentQuestion.reason)}
            </p>
        </div>
      )}

    </div>
  );
};