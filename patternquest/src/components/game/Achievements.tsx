import React, { useState } from 'react';
import { ACHIEVEMENTS_LIST } from '../../data/achievements';
import type { AchievementDef } from '../../data/achievements';
import './achievements.css'; 

interface AchievementsModalProps {
    unlockedIds: string[];
    onClose: () => void;
}

// Dicionário para traduzir as categorias
const CATEGORY_NAMES: Record<string, string> = {
    diagnosis: '🧩 Diagnóstico Arquitetural',
    narrative: '📜 Jornada & Carreira',
    performance: '⚡ Performance & Agilidade',
    exploration: '🔍 Exploração',
    special: '🏆 Especiais & Lendárias',
    pattern: '🏗️ Padrões de Projeto',
    hexagonal: '⚛️ Arquitetura Hexagonal'
};

// Dicionário para traduzir e colorir as raridades
const RARITY_CONFIG: Record<string, { label: string, color: string }> = {
    common: { label: 'Comum', color: '#24517c' },      // Cinza Azulado
    rare: { label: 'Raro', color: '#6beaee' },        // Azul
    legendary: { label: 'Lendário', color: '#f59e0b' } // Dourado
};

export const Achievements: React.FC<AchievementsModalProps> = ({ unlockedIds, onClose }) => {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Agrupa conquistas por categoria
    const groupedAchievements = ACHIEVEMENTS_LIST.reduce((acc, ach) => {
        if (!acc[ach.category]) acc[ach.category] = [];
        acc[ach.category].push(ach);
        return acc;
    }, {} as Record<string, AchievementDef[]>);

    // Lista de categorias para o menu de filtro
    const categories = ['all', ...Object.keys(groupedAchievements)];

    return (
        <div className="sys-modal-overlay">
            <div className="sys-modal-card wide">
                <div className="sys-modal-header">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h3>🏆 Galeria de Conquistas</h3>
                        <span className="progress-badge">
                            {unlockedIds.length} / {ACHIEVEMENTS_LIST.length} Desbloqueadas
                        </span>
                    </div>
                </div>

                {/* Filtros de Categoria */}
                <div className="category-filters">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat === 'all' ? 'Todas' : CATEGORY_NAMES[cat] || cat}
                        </button>
                    ))}
                </div>
                
                <div className="achievements-scroll-area">
                    {Object.entries(groupedAchievements).map(([category, list]) => {
                        // Se houver filtro ativo e não for 'all' nem a categoria atual, pula
                        if (activeFilter !== 'all' && activeFilter !== category) return null;

                        return (
                            <div key={category} className="category-section">
                                <h4 className="category-title">{CATEGORY_NAMES[category] || category}</h4>
                                <div className="achievements-grid">
                                    {list.map(ach => {
                                        const isUnlocked = unlockedIds.includes(ach.id);
                                        const rarityInfo = RARITY_CONFIG[ach.rarity] || RARITY_CONFIG.common;

                                        return (
                                            <div 
                                                key={ach.id} 
                                                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${ach.rarity}`}
                                            >
                                                <div className="ach-icon">
                                                    {isUnlocked ? ach.icon : '🔒'}
                                                </div>
                                                <div className="ach-content">
                                                    <div className="ach-header">
                                                        <h4>{ach.name}</h4>
                                                        {/* Badge de Raridade */}
                                                        <span 
                                                            className="rarity-badge"
                                                            style={{ 
                                                                backgroundColor: isUnlocked ? rarityInfo.color : '#ccc',
                                                                borderColor: rarityInfo.color
                                                            }}
                                                        >
                                                            {rarityInfo.label}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="ach-desc">
                                                        {isUnlocked 
                                                            ? ach.description 
                                                            : `Desafio: ${ach.description}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="sys-modal-footer">
                    <button className="sys-btn" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};