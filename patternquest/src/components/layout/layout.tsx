import React from 'react';
import type { ReactNode } from 'react';
import { HUD } from './HUD';
import type { UserProfile, GameSession } from '../../types';

interface LayoutProps {
  children: ReactNode;
  user: UserProfile;   
  session?: GameSession;
  onLogout: () => void;
  onSettings: () => void;
  onBackToMap: () => void;
  isMapActive: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, session, onLogout, onSettings, onBackToMap, isMapActive}) => {
  return (
    <div className="app-main">
        <div className="layout-container">
        <HUD 
          user={user} 
          session={session} 
          onLogout={onLogout} 
          onSettings={onSettings}
          onBackToMap={onBackToMap}
          showBackButton={!isMapActive} // Mostra se NÃO estiver no mapa
        />
      </div>
      <main className="app-container animate-enter">
        {children}
      </main>
    </div>
  );
};