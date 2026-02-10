import React, { useState } from 'react';
import patternsData from '../../data/patterns.json';
import type { UserProfile } from '../../types';
import './start.css';

interface StartScreenProps {
    onLogin: (username: string, password: string) => { success: boolean; message?: string };
    existingUsers: Record<string, UserProfile>;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onLogin, existingUsers }) => {
    const [activeModal, setActiveModal] = useState<'none' | 'login' | 'manual' | 'library'>('none');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedUserForLogin, setSelectedUserForLogin] = useState<string | null>(null);
    
    // Converte users para lista
    const userList = Object.values(existingUsers);

    const handleAuthSubmit = (e: React.FormEvent, nameToUse: string) => {
        e.preventDefault();
        setErrorMsg('');
        
        const result = onLogin(nameToUse, password);
        
        if (!result.success) {
            setErrorMsg(result.message || 'Erro ao autenticar');
        } else {
        }
    };

    const handleUserClick = (name: string) => {
        setSelectedUserForLogin(name);
        setPassword(''); // Limpa senha anterior
        setErrorMsg('');
    };

    const closeModal = () => {
        setActiveModal('none');
        setUsername('');
        setPassword('');
        setErrorMsg('');
        setSelectedUserForLogin(null);
    };

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
                                <h2>{selectedUserForLogin ? 'Autenticação' : 'Acesso'}</h2>
                                <span>{selectedUserForLogin ? `Bem-vindo de volta, ${selectedUserForLogin}` : 'Selecione ou Crie'}</span>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>
                        
                        {/* CENÁRIO 1: Lista de Usuários (Se ninguém selecionado) */}
                            {!selectedUserForLogin && userList.length > 0 && (
                                <div className="flex flex-col gap-2 mb-4">
                                    <p className="section-label">Contas Locais</p>
                                    {userList.map(u => (
                                        <button 
                                            key={u.name} 
                                            onClick={() => handleUserClick(u.name)}
                                            className="user-list-btn"
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <div>
                                                <span style={{fontWeight: 'bold', display: 'block'}}>{u.name}</span>
                                                <span className="subtitle" style={{fontSize: '0.75rem', textTransform: 'uppercase'}}>{u.title}</span>
                                            </div>
                                            <span>🔒</span>
                                        </button>
                                    ))}
                                    <div style={{height: '1px', background: '#e2e8f0', margin: '1rem 0'}}></div>
                                </div>
                            )}

                            {/* CENÁRIO 2: Login em Usuário Selecionado */}
                            {selectedUserForLogin && (
                                <form onSubmit={(e) => handleAuthSubmit(e, selectedUserForLogin)} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                    <div style={{textAlign: 'left'}}>
                                        <label className="section-label" style={{marginBottom: '0.5rem'}}>Senha para {selectedUserForLogin}</label>
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Digite sua senha..."
                                            autoFocus
                                            required
                                            style={{width: '100%', padding: '1rem', borderRadius: '8px'}}
                                        />
                                    </div>
                                    
                                    {errorMsg && <div style={{color: 'var(--color-danger)', fontSize: '0.9rem', fontWeight: 'bold'}}>{errorMsg}</div>}

                                    <div style={{display: 'flex', gap: '1rem'}}>
                                        <button type="button" className="menu-btn btn-secondary" style={{flex: 1}} onClick={() => setSelectedUserForLogin(null)}>Voltar</button>
                                        <button type="submit" className="menu-btn btn-play" style={{flex: 1}}>Entrar</button>
                                    </div>
                                </form>
                            )}

                            {/* CENÁRIO 3: Novo Registro (Se ninguém selecionado) */}
                            {!selectedUserForLogin && (
                                <form onSubmit={(e) => handleAuthSubmit(e, username)} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                    <p className="section-label">Novo Investigador</p>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left'}}>
                                        <input 
                                            type="text" 
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            placeholder="Codinome (Usuário)..."
                                            required
                                            style={{padding: '1rem', borderRadius: '8px'}}
                                        />
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Crie uma senha..."
                                            required
                                            style={{padding: '1rem', borderRadius: '8px'}}
                                        />
                                    </div>

                                    {errorMsg && <div style={{color: 'var(--color-danger)', fontSize: '0.9rem', fontWeight: 'bold'}}>{errorMsg}</div>}

                                    <button type="submit" className="menu-btn btn-play">
                                        Criar Perfil
                                    </button>
                            </form>
                        )}
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