import React from 'react';
import './result.css';

interface PhaseResultProps {
    passed: boolean;
    failReason?: 'integrity' | 'score';
    score: number;
    requiredScore: number;
    integrity: number;
    onContinue: () => void; // Voltar ao mapa
    onRetry: () => void;    // Tentar de novo
}

export const PhaseResult: React.FC<PhaseResultProps> = ({
    passed,
    failReason,
    score,
    requiredScore,
    integrity,
    onContinue,
    onRetry
}) => {
    const getMessage = () => {
        if (passed) return 'O sistema foi estabilizado. A arquitetura está segura.';
        if (failReason === 'integrity') return 'A integridade do sistema chegou a zero. O colapso foi inevitável.';
        if (failReason === 'score') return `O sistema está estável, mas o diagnóstico foi impreciso. Você precisa de ${requiredScore} pontos.`;
        return 'Missão falhou.';
    };

    return (
        <div className="result-overlay animate-enter">
            <div className={`result-card ${passed ? 'success' : 'failure'}`}>
                
                {/* Ícone Animado */}
                <div className="result-icon">
                    {passed ? '🏆' : (failReason === 'integrity' ? '💥' : '⚠️')}
                </div>

                <h2 className="result-title">
                    {passed ? 'Missão Cumprida' : 'Falha na Missão'}
                </h2>

                <p className="result-msg">
                    {getMessage()}
                </p>

                {/* Stats */}
                <div className="result-stats">
                    <div className="stat-box">
                        <span className={`stat-value ${score < requiredScore ? 'text-danger' : ''}`}>
                            {score}
                        </span>
                        <span className="stat-label">Score Final</span>
                    </div>
                    
                    <div className="stat-box">
                        <span className={`stat-value ${integrity === 0 ? 'text-danger' : ''}`}>
                            {integrity}%
                        </span>
                        <span className="stat-label">Integridade</span>
                    </div>
                </div>

                {/* Ações */}
                <div className="result-actions">
                    {passed ? (
                        <button className="btn btn-primary" onClick={onContinue}>
                            Voltar ao Mapa
                        </button>
                    ) : (
                        <>
                            <button 
                                className="btn btn-primary" 
                                style={{ backgroundColor: 'var(--color-danger)', boxShadow: 'none' }} 
                                onClick={onRetry}
                            >
                                Reiniciar Diagnóstico
                            </button>
                            
                            <button className="btn btn-ghost" onClick={onContinue}>
                                Abandonar Missão
                            </button>
                        </>
                    )}
                </div>

                {/* Meta Info */}
                {!passed && (
                    <div className="mt-4 text-xs text-slate-400">
                        Objetivo: {requiredScore} pontos
                    </div>
                )}
            </div>
        </div>
    );
};