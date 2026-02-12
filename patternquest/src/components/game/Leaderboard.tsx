import React from 'react';
import { usePersistence } from '../../hooks/usePersistence';
import { calculateAccuracy, calculateAvgTime } from '../../utils/gamification';
import './game.css'; 

interface LeaderboardProps {
    onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
    const { allUsers } = usePersistence();

    // Ordena por XP (Maior para menor)
    const sortedUsers = Object.values(allUsers).sort((a, b) => b.xp - a.xp);

    return (
        <div className="sys-modal-overlay">
            <div className="sys-modal-card">
                <div className="sys-modal-header">
                    <h3>🏆 Ranking de Investigadores</h3>
                </div>
                
                <div className="sys-modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-primary)', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>#</th>
                                <th style={{ padding: '10px' }}>Agente</th>
                                <th style={{ padding: '10px' }}>Nível</th>
                                <th style={{ padding: '10px' }}>XP</th>
                                <th style={{ padding: '10px' }}>Precisão</th>
                                <th style={{ padding: '10px' }}>Tempo Médio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => {
                                // Proteção contra stats undefined (para users antigos)
                                const stats = user.stats || { totalCorrect: 0, totalQuestions: 0, totalTime: 0 };
                                const accuracy = calculateAccuracy(stats.totalCorrect, stats.totalQuestions);
                                const avgTime = calculateAvgTime(stats.totalTime, stats.totalQuestions);

                                return (
                                    <tr key={user.name} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                                        <td style={{ padding: '10px' }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.name}</td>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{display:'flex', flexDirection:'column'}}>
                                                <span>Lv.{user.level}</span>
                                                <span style={{fontSize:'0.7rem', color:'gray'}}>{user.title}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{user.xp}</td>
                                        <td style={{ padding: '10px' }}>{accuracy}%</td>
                                        <td style={{ padding: '10px' }}>{avgTime}s</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="sys-modal-footer">
                    <button className="sys-btn sys-btn-info" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};