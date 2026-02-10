import React from 'react';
import { UserProfile, GameSession } from '../../types';
import './layout.css';

interface HUDProps {
  user: UserProfile;
  session: GameSession;
}

export const HUD: React.FC<HUDProps> = ({ user, session }) => {
  // Define cor da barra baseada na integridade
  const getIntegrityColorClass = () => {
    if (session.integrity <= 30) return 'critical';
    return '';
  };

  return (
    <header className="hud-container">
      <div className="hud-content">
        
        {/* Lado Esquerdo: Perfil */}
        <div className="hud-profile">
          <div className="hud-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="hud-info">
            <h3>{user.name}</h3>
            <span>{user.title}</span>
          </div>
        </div>

        {/* Lado Direito: Stats */}
        <div className="hud-stats">
          
          {/* Barra de Integridade */}
          <div className="stat-item">
            <span className="stat-label">Integridade do Sistema</span>
            <div className="integrity-bar-container">
              <div 
                className={`integrity-fill ${getIntegrityColorClass()}`} 
                style={{ width: `${session.integrity}%` }}
              />
            </div>
          </div>

          {/* Pontuação */}
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <div className="score-value">
              {session.score.toString().padStart(4, '0')}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};