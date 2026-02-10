import React from 'react';
import type { Phase } from '../../types';
import './map.css';


interface PhaseMapProps {
    phases: Phase[];
    completedPhases: string[]; // IDs das fases completadas
    onSelectPhase: (phaseId: string) => void;
}

export const PhaseMap: React.FC<PhaseMapProps> = ({ phases, completedPhases, onSelectPhase }) => {
    
    // Helper para determinar estado
    const getPhaseStatus = (phaseIndex: number, phaseId: string) => {
        const isCompleted = completedPhases.includes(phaseId);
        // Desbloqueado se: é a primeira fase OU a fase anterior foi completada
        const isUnlocked = phaseIndex === 0 || completedPhases.includes(phaseId[phaseIndex - 1]);
        
        if (isCompleted) return 'completed';
        if (isUnlocked) return 'active';
        return 'locked';
    };

    return (
        <div className="map-container animate-enter">
            <header className="map-header">
                <h2>Mapa da Cidade ArchPatterns</h2>
                <p>Selecione um distrito para iniciar a investigação</p>
            </header>

            <div className="city-grid">
                {phases.map((phase: any, index: number) => {
                    const status = getPhaseStatus(index, phase.id);
                    const isLocked = status === 'locked';

                    return (
                        <div 
                            key={phase.id}
                            className={`district-card ${status}`}
                            onClick={() => !isLocked && onSelectPhase(phase.id)}
                        >
                            <div className="district-content">
                                <div className="district-icon">
                                    {/* Ícones conceituais baseados no índice */}
                                    {index === 0 && '🏚️'} {/* Garagem */}
                                    {index === 1 && '🏢'} {/* Comercial */}
                                    {index === 2 && '🏭'} {/* Industrial */}
                                    {index === 3 && '☁️'} {/* Digital */}
                                    {index === 4 && '🗼'} {/* Torre */}
                                </div>
                                
                                <div className="district-info">
                                    <h3>{phase.title}</h3>
                                    <p>{phase.subtitle}</p>
                                </div>
                                
                                <div className="district-meta">
                                    <span className="pattern-tag">
                                        Padrão: {phase.dominantPattern}
                                    </span>
                                </div>
                            </div>

                            {status === 'completed' && (
                                <div className="district-status">
                                    ✓ Área Estabilizada
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};