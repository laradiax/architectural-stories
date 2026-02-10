import React, { useState, useEffect } from 'react';
import type { Phase, Pattern } from '../../types/game';
import './game.css';

interface QuizEngineProps {
  phase: Phase;
  patterns: Pattern[];
  onCompletePhase: (score: number, passed: boolean) => void;
  onIntegrityLoss: () => void; // Callback para reduzir vida no App principal
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ 
  phase,
  patterns,
  onCompletePhase,
  onIntegrityLoss 
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos por questão
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [phaseScore, setPhaseScore] = useState(0);
  const [options, setOptions] = useState<any[]>([]); // Opções embaralhadas

  const currentQuestion = phase.questions[currentQIndex];

  const getPatternName = (id: string) => {
    const pattern = patterns.find(p => p.id === id);
    return pattern ? pattern.name : id.toUpperCase(); // Fallback se não achar
  };

  // 1. Setup da Questão (Embaralhar opções)
  useEffect(() => {
    if (!currentQuestion) return;
    
    // Mistura a correta com as erradas
    const allOptions = [
      { id: currentQuestion.correctId, label: 'Correto', isCorrect: true },
      ...currentQuestion.wrongOptions.map(opt => ({ id: opt, label: opt, isCorrect: false }))
    ].sort(() => Math.random() - 0.5); 

    setOptions(allOptions);
    setTimeLeft(30); // Reseta timer
    setIsAnswered(false);
    setSelectedOption(null);

  }, [currentQIndex, currentQuestion]);

  // 2. Timer
  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  // 3. Handler de Resposta
  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(optionId);

    if (isCorrect) {
      // Calcular Pontuação baseada no Tempo
      let points = 50;
      if (timeLeft > 20) points = 100; // Rápido (<10s gastos)
      else if (timeLeft > 10) points = 70; // Médio

      setPhaseScore(prev => prev + points);
      // Som de Sucesso aqui
    } else {
      // Erro
      onIntegrityLoss();
      // Som de Erro aqui
    }

    // Avançar automaticamente após 2 segundos
    setTimeout(() => {
      if (currentQIndex < phase.questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        // Fim da Fase
        const passed = phaseScore >= phase.requiredScore; // Lógica simples por enquanto
        onCompletePhase(phaseScore, passed);
      }
    }, 2000);
  };

  if (!currentQuestion) return <div>Carregando...</div>;

  return (
    <div className="quiz-container animate-enter">
      
      {/* Cabeçalho com Timer */}
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

      {/* Pergunta */}
      <div className="problem-card">
        <h2>{currentQuestion.title}</h2>
        <p className="problem-text">{currentQuestion.problem}</p>
      </div>

      {/* Opções */}
      <div className="options-grid">
        {options.map((opt) => {
          let btnClass = 'option-btn';
          if (isAnswered) {
            if (opt.isCorrect) btnClass += ' correct'; // Sempre mostra a correta
            else if (selectedOption === opt.id) btnClass += ' wrong'; // Mostra erro se selecionado
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
            <p className="text-center mt-4 font-bold text-slate-500 bg-slate-100 p-4 rounded-lg border border-slate-200">
                💡{currentQuestion.reason}
            </p>
        </div>
      )}

    </div>
  );
};