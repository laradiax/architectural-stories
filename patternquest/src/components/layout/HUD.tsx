import React from 'react';
import type { UserProfile, GameSession } from '../../types';
import './layout.css';

interface HUDProps {
  user: UserProfile;
  session: GameSession;
  onLogout: () => void;
  onSettings: () => void;
  onBackToMap: () => void;
  showBackButton: boolean;
}

export const HUD: React.FC<HUDProps> = ({ user, session, onLogout, onSettings, onBackToMap, 
    showBackButton }) => {
  // Define cor da barra baseada na integridade
  const getIntegrityColorClass = () => {
    if (session.integrity <= 30) return 'critical';
    return '';
  };

  return (
    <header className="hud-container">
      <div className="hud-content">
        
        {/* Lado Esquerdo: Perfil e nível*/}
        <div className="hud-profile">
          <div className="hud-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="hud-info">
            <h3>{user.name}</h3>
            <span style={{color: 'var(--color-primary)'}}>
                Lv.{user.level} {user.title}
            </span>
          </div>
        </div>

        {/* Lado Direito: Stats */}
        <div className="hud-stats">
                <div className="stat-item">
                    <span className="stat-label">Score Missão</span>
                    <div className="score-value">
                    {session.score.toString().padStart(3, '0')}
                    </div>
                </div>

                <div className="stat-item">
                    <span className="stat-label">Integridade</span>
                    <div className="integrity-bar-container">
                    <div 
                        className={`integrity-fill ${getIntegrityColorClass()}`} 
                        style={{ width: `${session.integrity}%` }}
                    />
                    </div>
                </div>
            </div>

            <div className="hud-controls">
                
                {/* BOTÃO VOLTAR AO MAPA (Novo) */}
                {showBackButton && (
                    <button 
                        className="hud-btn-icon" 
                        onClick={onBackToMap}
                        title="Abortar / Voltar ao Mapa"
                        style={{color: 'var(--color-narrative)'}} // Laranja para destacar navegação
                    >
                        🗺️
                    </button>
                )}

                <button 
                    className="hud-btn-icon btn-settings" 
                    onClick={onSettings}
                    title="Configurações"
                >
                    ⚙️
                </button>
                <button 
                    className="hud-btn-icon btn-logout" 
                    onClick={onLogout}
                    title="Encerrar Sessão"
                >
                    🚪
                </button>
            </div>
        </div>
    </header>
  );
};