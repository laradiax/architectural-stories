import React from 'react';
import './dialog.css';

interface SystemDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'danger' | 'success'; // Define a cor do ícone/botão
  onConfirm: () => void;
  onCancel: () => void;
  isConfirmation?: boolean; // Se false, mostra apenas botão OK (estilo alert)
}

export const SystemDialog: React.FC<SystemDialogProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  isConfirmation = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="sys-modal-overlay">
      <div className={`sys-modal-card ${type}`}>
        
        {/* Cabeçalho */}
        <div className="sys-modal-header">
          <span className="sys-icon">
            {type === 'danger' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
          </span>
          <h3>{title}</h3>
        </div>

        {/* Corpo */}
        <div className="sys-modal-body">
          <p>{message}</p>
        </div>

        {/* Rodapé com Ações */}
        <div className="sys-modal-footer">
          {isConfirmation && (
            <button className="sys-btn sys-btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
          
          <button 
            className={`sys-btn sys-btn-${type}`} 
            onClick={onConfirm}
          >
            {isConfirmation ? 'Confirmar' : 'Entendido'}
          </button>
        </div>

      </div>
    </div>
  );
};