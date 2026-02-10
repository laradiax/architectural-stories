// src/components/narrative/Briefing.tsx
import React from 'react';
import type { Phase } from '../../types';
import './briefing.css';

interface BriefingProps {
    phase: Phase;
    onStartMission: () => void;
    onCancel: () => void;
}

export const Briefing: React.FC<BriefingProps> = ({ phase, onStartMission, onCancel }) => {
    return (
        <div className="briefing-overlay animate-enter">
            <div className="dossier-card">
                
                {/* Cabeçalho "Top Secret" */}
                <div className="dossier-header">
                    <span className="dossier-title">Guilda dos Arquitetos // Arquivo Confidencial</span>
                    <span className="mission-code">REQ-{phase.id.toUpperCase()}</span>
                </div>

                {/* Corpo do Dossiê */}
                <div className="dossier-body">
                    <h1 className="mission-title">{phase.title}</h1>
                    <span className="mission-subtitle">{phase.subtitle}</span>

                    <div className="mission-brief">
                        {phase.narrativeIntro}
                    </div>

                    <div className="objectives-box">
                        <span className="obj-label">Parâmetros da Missão</span>
                        <ul className="obj-list">
                            <li>Diagnosticar falhas estruturais</li>
                            <li>Restaurar integridade do sistema</li>
                            <li>Pontuação Mínima: {phase.requiredScore} pts</li>
                            <li>Padrão Sugerido: {phase.dominantPattern}</li>
                        </ul>
                    </div>

                    <div className="stamp">CONFIDENCIAL</div>
                </div>

                {/* Ações */}
                <div className="dossier-footer">
                    <button className="btn btn-ghost" onClick={onCancel}>
                        Recusar
                    </button>
                    <button className="btn btn-primary" onClick={onStartMission}>
                        ACEITAR MISSÃO_
                    </button>
                </div>
            </div>
        </div>
    );
};