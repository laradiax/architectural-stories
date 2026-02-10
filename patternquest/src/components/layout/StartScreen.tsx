// src/components/layout/StartScreen.tsx
import React, { useState } from 'react';
import patternsData from '../../data/patterns.json';
import type { UserProfile } from '../../types';
import './start.css';

interface StartScreenProps {
    onLogin: (username: string) => void;
    existingUsers: Record<string, UserProfile>;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onLogin, existingUsers }) => {
    const [activeModal, setActiveModal] = useState<'none' | 'login' | 'manual' | 'library'>('none');
    const [username, setUsername] = useState('');
    
    // Converte users para lista
    const userList = Object.values(existingUsers);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) onLogin(username);
    };

    const handleQuickLogin = (name: string) => onLogin(name);
    const closeModal = () => setActiveModal('none');

    return (
        <div className="start-screen animate-enter">
            
            {/* --- LOGO / BRANDING --- */}
            <div className="game-brand">
                <div className="brand-icon-box">
                    <span>xxx</span>
                </div>
                <h1>Pattern<br/><span className="brand-highlight">Quest</span></h1>
                <p>Resolva os problemas arquiteturais e se torne um Mestre de Arquitetura de Software</p>
            </div>

            {/* --- MENU INICIAL --- */}
            <div className="start-menu">
                <button className="menu-btn btn-play" onClick={() => setActiveModal('login')}>
                    Jogar
                </button>
                <button className="menu-btn btn-secondary" onClick={() => setActiveModal('manual')}>
                    <span>?</span> Manual
                </button>
                <button className="menu-btn btn-secondary" onClick={() => setActiveModal('library')}>
                    <span>📖</span> Padrões Arquiteturais
                </button>
            </div>

            {/* --- MODAL MANUAL (Estrutura da Imagem) --- */}
            {activeModal === 'manual' && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-manual" onClick={e => e.stopPropagation()}>
                        
                        {/* Header */}
                        <div className="manual-header">
                            <div className="manual-title">
                                <h2>Manual de Campo</h2>
                                <span>Protocolo de Investigação V3.0</span>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>

                        {/* Conteúdo com Scroll */}
                        <div className="manual-scroll-area">
                            
                            {/* 1. A Missão */}
                            <div className="mission-card">
                                <div className="section-label">A Missão</div>
                                <p className="mission-text">
                                    Um sistema crítico entrou em colapso e seu código se tornou um labirinto de enigmas. 
                                    Você foi convocado como <span className="hl-primary">Mestre da Arquitetura</span> para decifrar os 
                                    <span className="hl-warning"> Enigmas</span>, diagnosticar as falhas e aplicar a 
                                    <span className="hl-success"> Solução Arquitetural</span> que salvará o projeto.
                                </p>
                            </div>

                            {/* 2. Fluxo */}
                            <div className="flow-title">Fluxo da Investigação</div>
                            <div className="flow-grid">
                                <div className="flow-step-card">
                                    <div className="step-icon yellow">📖</div>
                                    <h3>1. O Enigma</h3>
                                    <p>Analise o relatório do incidente. Onde está o gargalo? Latência, acoplamento excessivo ou falhas de resiliência? Identifique o verdadeiro Enigma.</p>
                                </div>
                                <div className="flow-step-card">
                                    <div className="step-icon blue">?</div>
                                    <h3>2. A Consulta</h3>
                                    <p>Não tente adivinhar. Use a biblioteca para consultar as fichas técnicas dos padrões suspeitos antes de propor sua <span className="hl-success">Solução</span>.</p>
                                </div>
                                <div className="flow-step-card">
                                    <div className="step-icon green">▶</div>
                                    <h3>3. O Veredito</h3>
                                    <p>Aplique sua <span className="hl-success">Solução Arquitetural</span>. Se acertar, você desbloqueará o raciocínio por trás do Enigma e será reconhecido como <span className="hl-primary">Mestre da Arquitetura</span>.</p>
                                </div>
                            </div>

                            {/* 3. Rodapé (Notas e Objetivos) */}
                            <div className="footer-grid">
                                <div className="notes-card">
                                    <div className="step-icon blue" style={{fontSize: '1.2rem'}}>ℹ</div>
                                    <p style={{fontSize: '0.9rem', color: '#cbd5e1'}}>
                                        <strong>Sem Penalidade:</strong> Consultar as fichas técnicas e padrões não retira pontos. Um verdadeiro Mestre da Arquitetura sempre valida suas hipóteses.
                                    </p>
                                </div>
                                <div className="objective-card">
                                    <div className="obj-bg-icon">🏆</div>
                                    <div className="obj-header">
                                        <span className="obj-label">Objetivo Final</span>
                                        <span className="obj-val">5 Distritos</span>
                                    </div>
                                    <div className="deco-progress">
                                        <div className="deco-fill"></div>
                                    </div>
                                    <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>
                                        Resolva todos os Enigmas para conquistar o título honorário.
                                    </p>
                                </div>
                            </div>

                            {/* Botão Jogar Dentro do Manual */}
                            <button className="menu-btn btn-play" style={{marginTop: '1rem'}} onClick={() => setActiveModal('login')}>
                                JOGAR
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL LOGIN --- */}
            {activeModal === 'login' && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-manual" style={{maxWidth: '450px', overflow: 'hidden'}} onClick={e => e.stopPropagation()}>
                        <div className="manual-header">
                            <div className="manual-title">
                                <h2>Login</h2>
                                <span>Acesso Restrito</span>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>
                        
                        <div className="manual-scroll-area">
                             {/* Lista de Usuários */}
                             {userList.length > 0 && (
                                <div className="flex flex-col gap-2 mb-4">
                                    <p className="section-label">Contas Locais</p>
                                    {userList.map(u => (
                                        <button 
                                            key={u.name}
                                            onClick={() => handleQuickLogin(u.name)}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{textAlign: 'left'}}>
                                                <span style={{fontWeight: 'bold', display: 'block'}}>{u.name}</span>
                                                <span style={{fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase'}}>{u.title}</span>
                                            </div>
                                            <span>➔</span>
                                        </button>
                                    ))}
                                    <div style={{height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0'}}></div>
                                </div>
                            )}

                            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}} onSubmit={handleLoginSubmit}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left'}}>
                                    <label style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase'}}>
                                        Novo Investigador
                                    </label>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Digite seu codinome..."
                                        autoFocus
                                        required
                                        style={{
                                            padding: '1rem',
                                            background: '#020617',
                                            border: '1px solid #1e293b',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                                <button type="submit" className="menu-btn btn-play">
                                    Iniciar Sessão
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL LIBRARY --- */}
            {activeModal === 'library' && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-manual" onClick={e => e.stopPropagation()}>
                        <div className="manual-header">
                            <div className="manual-title">
                                <h2>Biblioteca</h2>
                                <span>Padrões Arquiteturais</span>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>
                        <div className="manual-scroll-area">
                            <div className="flow-grid" style={{gridTemplateColumns: '1fr'}}>
                                {patternsData.map(p => (
                                    <div key={p.id} className="flow-step-card" style={{borderLeft: '4px solid var(--color-tech)'}}>
                                        <h4 style={{color: 'var(--color-tech)', fontSize: '1.2rem', fontWeight: 'bold'}}>{p.name}</h4>
                                        <p>{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};