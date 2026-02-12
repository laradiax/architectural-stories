import React from 'react';
import type { UserProfile, GameSession } from '../../types/game';
import './layout.css';

interface HUDProps {
  user: UserProfile;
  session: GameSession;
  onLogout: () => void;
  onSettings: () => void;
  onBackToMap: () => void;
  onShowRanking: () => void;
  showBackButton: boolean; // Indica se está jogando (true) ou no mapa (false)
}

export const HUD: React.FC<HUDProps> = ({ 
    user, session, onLogout, onSettings, onBackToMap, onShowRanking, showBackButton 
}) => {
  
  const renderHearts = (integrity: number) => {
    const totalHearts = 5;
    const filledHearts = Math.ceil(integrity / 20);
    return (
        <div style={{ display: 'flex', gap: '4px', fontSize: '1.2rem', alignItems: 'center' }}>
            {[...Array(totalHearts)].map((_, i) => (
                <span key={i} style={{ opacity: i < filledHearts ? 1 : 0.3, filter: i < filledHearts ? 'none' : 'grayscale(100%)' }}>
                    {i < filledHearts ? '❤️' : '💔'}
                </span>
            ))}
        </div>
    );
  };

  return (
    <header className="hud-container">
      <div className="hud-content">
        
        {/* Esquerda: Perfil */}
        <div className="hud-profile">
          <div className="hud-avatar">
            {user.avatarId && user.avatarId.length > 2 ? user.avatarId : user.name.charAt(0)}
          </div>
          <div className="hud-info">
            <h3>{user.name}</h3>
            <span style={{color: 'var(--color-primary)', fontSize: '0.8rem'}}>
                Lv.{user.level} {user.title}
            </span>
          </div>
        </div>

        {/* Direita: Stats e Controles */}
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
            
            <div className="hud-stats">
                {/* 1. XP Total (Sempre Visível) */}
                <div className="stat-item" style={{ borderRight: '1px solid #444', paddingRight: '1rem' }}>
                    <span className="stat-label">XP Total</span>
                    <div className="score-value" style={{ color: '#fbbf24' }}>
                        {user.xp}
                    </div>
                </div>

                {/* 2. Score da Missão (Só aparece se estiver jogando) */}
                {showBackButton && (
                    <div className="stat-item animate-enter">
                        <span className="stat-label">Missão Atual</span>
                        <div className="score-value" style={{ color: '#fff' }}>
                            {session.score}
                        </div>
                    </div>
                )}

                {/* 3. Integridade (Sempre visível ou só na missão?) */}
                <div className="stat-item">
                    <span className="stat-label">Integridade</span>
                    {renderHearts(session.integrity)}
                </div>
            </div>

            <div className="hud-controls">
                <button className="hud-btn-icon" onClick={onShowRanking} title="Ranking">🏆</button>
                
                {showBackButton && (
                    <button className="hud-btn-icon" onClick={onBackToMap} title="Voltar ao Mapa" style={{color: 'var(--color-narrative)'}}>
                        🗺️
                    </button>
                )}

                <button className="hud-btn-icon btn-settings" onClick={onSettings}>⚙️</button>
                <button className="hud-btn-icon btn-logout" onClick={onLogout}>🚪</button>
            </div>

        </div>
      </div>
    </header>
  );
};