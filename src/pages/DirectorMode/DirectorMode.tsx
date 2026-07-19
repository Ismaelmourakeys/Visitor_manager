import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Visitor } from '../../types/visitor';
import type { Congress } from '../../types/congress';
import type { ChurchData } from '../../hooks/useChurchProfile';
import { useDirectorMode } from '../../hooks/useDirectorMode';
import './DirectorMode.css';

interface DirectorModeProps {
    visitors: Visitor[];
    congresses: Congress[];
    church: ChurchData;
    churchId: string;
    onClose: () => void;
}

type DirectorTab = 'all' | 'visitors' | 'congresses';

export function DirectorMode({
    visitors, congresses, church, churchId, onClose,
}: DirectorModeProps) {
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = visitors.filter(v => v.visitDate === today);
    const todayCongresses = congresses.filter(c => c.date === today);

    const {
        presentedVisitorIds, presentedCongressIds, playedCongressIds,
        loading, toggleVisitor, toggleCongress, togglePlayed, resetSession,
    } = useDirectorMode(churchId);

    const [activeTab, setActiveTab] = useState<DirectorTab>('all');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Contadores de progresso
    const visitorsPresented = todayVisitors.filter(v => presentedVisitorIds.has(v.id)).length;
    const congressesPresented = todayCongresses.filter(c => presentedCongressIds.has(c.id)).length;
    const congressesPlayed = todayCongresses.filter(c => playedCongressIds.has(c.id)).length;
    const totalPresented = visitorsPresented + congressesPresented;
    const total = todayVisitors.length + todayCongresses.length;

    return (
        <div className="director">
            {/* Header fixo */}
            <div className="director__header">
                <div className="director__header-left">
                    {church.logoUrl && (
                        <img src={church.logoUrl} alt={church.churchName} className="director__logo" />
                    )}
                    <div>
                        <span className="director__church-name">{church.churchName}</span>
                        <span className="director__date">
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'long', day: '2-digit', month: 'long',
                            })}
                        </span>
                    </div>
                </div>

                {/* Progresso geral */}
                <div className="director__progress">
                    <div className="director__progress-bar">
                        <div
                            className="director__progress-fill"
                            style={{ width: total > 0 ? `${(totalPresented / total) * 100}%` : '0%' }}
                        />
                    </div>
                    <span className="director__progress-label">
                        {totalPresented} de {total} apresentados
                    </span>
                </div>

                <div className="director__header-actions">
                    <button
                        className="director__reset-btn"
                        onClick={() => setShowResetConfirm(true)}
                    >
                        🔄 Reiniciar
                    </button>
                    <button className="director__close-btn" onClick={onClose}>
                        ✕ Sair (ESC)
                    </button>
                </div>
            </div>

            {/* Abas */}
            <div className="director__tabs">
                {[
                    { key: 'all', label: '🌟 Todos', count: total },
                    { key: 'visitors', label: '👥 Visitantes', count: todayVisitors.length },
                    { key: 'congresses', label: '⛪ Grupos', count: todayCongresses.length },
                ].map(t => (
                    <button
                        key={t.key}
                        className={`director__tab ${activeTab === t.key ? 'director__tab--active' : ''}`}
                        onClick={() => setActiveTab(t.key as DirectorTab)}
                    >
                        {t.label}
                        <span className="director__tab-count">{t.count}</span>
                    </button>
                ))}
            </div>

            {/* Resumo rápido */}
            <div className="director__summary">
                <div className="director__summary-item">
                    <span className="director__summary-value">{visitorsPresented}/{todayVisitors.length}</span>
                    <span className="director__summary-label">Visitantes apresentados</span>
                </div>
                <div className="director__summary-divider" />
                <div className="director__summary-item">
                    <span className="director__summary-value">{congressesPresented}/{todayCongresses.length}</span>
                    <span className="director__summary-label">Igrejas apresentadas</span>
                </div>
                <div className="director__summary-divider" />
                <div className="director__summary-item">
                    <span className="director__summary-value">{congressesPlayed}/{todayCongresses.length}</span>
                    <span className="director__summary-label">Grupos que cantaram</span>
                </div>
            </div>

            {/* Lista */}
            <div className="director__list">
                {loading ? (
                    <div className="director__empty">Carregando...</div>
                ) : total === 0 ? (
                    <div className="director__empty">
                        <span>📋</span>
                        <p>Nenhum registro para hoje ainda.</p>
                        <span>Cadastre visitantes ou grupos pelo painel.</span>
                    </div>
                ) : (
                    <>
                        {/* Visitantes */}
                        {(activeTab === 'all' || activeTab === 'visitors') && todayVisitors.map((visitor, index) => {
                            const isPresented = presentedVisitorIds.has(visitor.id);
                            return (
                                <motion.div
                                    key={`v-${visitor.id}`}
                                    className={`director__item ${isPresented ? 'director__item--done' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <div className="director__item-order">{index + 1}</div>
                                    <div className="director__item-info">
                                        <span className="director__item-badge director__item-badge--visitor">
                                            👤 Visitante
                                        </span>
                                        <strong className="director__item-name">
                                            {visitor.position
                                                ? `${visitor.position} ${visitor.fullName}`
                                                : visitor.fullName}
                                        </strong>
                                        {visitor.howFound && (
                                            <span className="director__item-detail">
                                                Como conheceu: {visitor.howFound}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        className={`director__check-btn ${isPresented ? 'director__check-btn--done' : ''}`}
                                        onClick={() => toggleVisitor(visitor.id)}
                                    >
                                        {isPresented ? '✅ Apresentado' : '⬜ Apresentar'}
                                    </button>
                                </motion.div>
                            );
                        })}

                        {/* Congressos */}
                        {(activeTab === 'all' || activeTab === 'congresses') && todayCongresses.map((congress, index) => {
                            const isPresented = presentedCongressIds.has(congress.id);
                            const isPlayed = playedCongressIds.has(congress.id);
                            const offset = activeTab === 'all' ? todayVisitors.length + index : index;
                            return (
                                <motion.div
                                    key={`c-${congress.id}`}
                                    className={`director__item ${isPresented ? 'director__item--done' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: offset * 0.03 }}
                                >
                                    <div className="director__item-order">{offset + 1}</div>
                                    <div className="director__item-info">
                                        <span className="director__item-badge director__item-badge--congress">
                                            ⛪ {congress.congressType}
                                        </span>
                                        <strong className="director__item-name">{congress.churchName}</strong>
                                        <span className="director__item-detail">{congress.groupName}</span>
                                        {congress.pastors && (
                                            <span className="director__item-detail">🙏 {congress.pastors}</span>
                                        )}
                                        {congress.leaders && (
                                            <span className="director__item-detail">👥 {congress.leaders}</span>
                                        )}
                                        {congress.worship && (
                                            <span className="director__item-detail">🎵 {congress.worship}</span>
                                        )}
                                    </div>
                                    <div className="director__item-actions">
                                        <button
                                            className={`director__check-btn ${isPresented ? 'director__check-btn--done' : ''}`}
                                            onClick={() => toggleCongress(congress.id)}
                                        >
                                            {isPresented ? '✅ Apresentado' : '⬜ Apresentar'}
                                        </button>
                                        <button
                                            className={`director__play-btn ${isPlayed ? 'director__play-btn--done' : ''}`}
                                            onClick={() => togglePlayed(congress.id)}
                                        >
                                            {isPlayed ? '🎵 Cantou' : '▶ Cantar'}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Modal de confirmação de reset */}
            <AnimatePresence>
                {showResetConfirm && (
                    <motion.div
                        className="director__reset-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="director__reset-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3>Reiniciar sessão?</h3>
                            <p>Todas as marcações de "apresentado" e "cantou" serão removidas em todos os dispositivos.</p>
                            <div className="director__reset-actions">
                                <button onClick={() => setShowResetConfirm(false)}>Cancelar</button>
                                <button
                                    className="director__reset-confirm"
                                    onClick={async () => {
                                        await resetSession();
                                        setShowResetConfirm(false);
                                    }}
                                >
                                    Sim, reiniciar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}