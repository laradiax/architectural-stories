import React from 'react';
import type { UserPreferences } from '../../types/game';
import { translations } from '../../data/i18n';
import './dialog.css'; 

interface SettingsModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onUpdate: (prefs: Partial<UserPreferences>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, preferences, onUpdate, onClose 
}) => {
  if (!isOpen) return null;

  const currentLang = preferences.language || 'pt';
  const t = translations[currentLang];

  return (
    <div className="sys-modal-overlay">
      <div className="sys-modal-card info">
        
        {/* Header */}
        <div className="sys-modal-header">
          <span className="sys-icon" style={{fontSize: '1.5rem'}}>⚙️</span>
          <h3>{t.settingsTitle}</h3>
        </div>

        {/* Body */}
        <div className="sys-modal-body" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            
            {/* TEMA (Dark Mode Toggle) */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: 600}}>{t.settingsTheme}</span>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={preferences.theme === 'dark'}
                        onChange={(e) => onUpdate({ theme: e.target.checked ? 'dark' : 'light' })}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            {/* IDIOMA */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: 600}}>{t.settingsLang}</span>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button 
                        className={`sys-btn ${currentLang === 'pt' ? 'sys-btn-info' : 'sys-btn-ghost'}`}
                        onClick={() => onUpdate({ language: 'pt' })}
                        style={{padding: '0.5rem 1rem'}}
                    >
                        PT
                    </button>
                    <button 
                        className={`sys-btn ${currentLang === 'en' ? 'sys-btn-info' : 'sys-btn-ghost'}`}
                        onClick={() => onUpdate({ language: 'en' })}
                        style={{padding: '0.5rem 1rem'}}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* SOM */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: 600}}>{t.settingsSound}</span>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={preferences.soundEnabled}
                        onChange={(e) => onUpdate({ soundEnabled: !preferences.soundEnabled })}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

        </div>

        {/* Footer */}
        <div className="sys-modal-footer">
            <button className="sys-btn sys-btn-info" onClick={onClose}>
                {t.btnClose}
            </button>
        </div>
      </div>
      
      {/* Estilo local para o Toggle Switch (iOS style) usando Var Globais */}
      <style>{`
        .switch { position: relative; display: inline-block; width: 48px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input:checked + .slider { background-color: var(--color-primary); }
        input:checked + .slider:before { transform: translateX(22px); }
      `}</style>
    </div>
  );
};