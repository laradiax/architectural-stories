import React, { ReactNode } from 'react';
import { HUD } from './HUD';
import type { UserProfile, GameSession } from '../../types';

interface LayoutProps {
  children: ReactNode;
  user?: UserProfile;   // Opcional pois na tela de login pode não ter user
  session?: GameSession;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, session }) => {
  return (
    <div className="app-main">
      {user && session && (
        <HUD user={user} session={session} />
      )}
      
      <main className="app-container animate-enter">
        {children}
      </main>
    </div>
  );
};