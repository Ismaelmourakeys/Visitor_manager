import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Visitor } from '../../types/visitor';
import type { Congress } from '../../types/congress';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './Telao.css';

interface TelaoProps {
    visitors: Visitor[];
    congresses: Congress[];
    church: ChurchData;
    presentedVisitorIds: Set<string>;
    presentedCongressIds: Set<string>;
    onClose: () => void;
}

const PER_PAGE = 4;

type TelaoTab = 'all' | 'visitors' | 'congresses';

type TelaoItem =
    | { kind: 'visitor'; data: Visitor }
    | { kind: 'congress'; data: Congress };

export function Telao({
    visitors, congresses, church,
    presentedVisitorIds, presentedCongressIds,
    onClose,
}: TelaoProps) {
    const today = new Date().toISOString().split('T')[0];

    // Filtra apenas os NÃO apresentados do dia
    const todayVisitors = visitors.filter(v =>
        v.visitDate === today && !presentedVisitorIds.has(v.id)
    );
    const todayCongresses = congresses.filter(c =>
        c.date === today && !presentedCongressIds.has(c.id)
    );

    const [activeTab, setActiveTab] = useState<TelaoTab>('all');
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);

    const allItems: TelaoItem[] = [
        ...todayVisitors.map(v => ({ kind: 'visitor' as const, data: v })),
        ...todayCongresses.map(c => ({ kind: 'congress' as const, data: c })),
    ];

    const currentItems: TelaoItem[] =
        activeTab === 'all' ? allItems :
            activeTab === 'visitors' ? todayVisitors.map(v => ({ kind: 'visitor' as const, data: v })) :
                todayCongresses.map(c => ({ kind: 'congress' as const, data: c }));

    const totalPages = Math.ceil(currentItems.length / PER_PAGE);
    const currentSlice = currentItems.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

    useEffect(() => { setPage(0); }, [activeTab]);

    // Reset página se itens forem removidos e página atual não existir mais
    useEffect(() => {
        if (page >= totalPages && totalPages > 0) setPage(totalPages - 1);
        if (totalPages === 0) setPage(0);
    }, [totalPages, page]);

    useEffect(() => {
        if (totalPages <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setPage(p => (p + 1) % totalPages);
        }, 10000);
        return () => clearInterval(timer);
    }, [totalPages, activeTab]);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === '1') setActiveTab('all');
            if (e.key === '2') setActiveTab('visitors');
            if (e.key === '3') setActiveTab('congresses');
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [page, totalPages]);

    function goNext() {
        setDirection(1);
        setPage(p => (p + 1) % totalPages);
    }

    function goPrev() {
        setDirection(-1);
        setPage(p => (p - 1 + totalPages) % totalPages);
    }

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
    };

    function renderTitle() {
        const total = currentItems.length;
        if (total === 0) {
            if (activeTab === 'visitors') return 'Todos os visitantes foram saudados! 🙏';
            if (activeTab === 'congresses') return 'Todos os grupos foram apresentados! 🙏';
            return 'Todos foram saudados! 🙏';
        }
        if (activeTab === 'congresses') {
            return total > 1 ? 'Grupos presentes hoje! 🎉' : 'Grupo presente hoje! 🎉';
        }
        return total > 1 ? 'Sejam bem-vindos! 🎉' : 'Seja bem-vindo! 🎉';
    }

    return (
        <div className="telao">
            <button className="telao__close" onClick={onClose}>✕ Sair (ESC)</button>

            <div className="telao__content">
                {/* Igreja */}
                <motion.div
                    className="telao__church"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {church.logoUrl && (
                        <img src={church.logoUrl} alt={church.churchName} className="telao__logo" />
                    )}
                    <span className="telao__church-name">{church.churchName}</span>
                </motion.div>

                {/* Abas */}
                <motion.div
                    className="telao__tabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        className={`telao__tab ${activeTab === 'all' ? 'telao__tab--active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        🌟 Todos
                        {allItems.length > 0 && (
                            <span className="telao__tab-count">{allItems.length}</span>
                        )}
                    </button>
                    <button
                        className={`telao__tab ${activeTab === 'visitors' ? 'telao__tab--active' : ''}`}
                        onClick={() => setActiveTab('visitors')}
                    >
                        👥 Visitantes
                        {todayVisitors.length > 0 && (
                            <span className="telao__tab-count">{todayVisitors.length}</span>
                        )}
                    </button>
                    <button
                        className={`telao__tab ${activeTab === 'congresses' ? 'telao__tab--active' : ''}`}
                        onClick={() => setActiveTab('congresses')}
                    >
                        ⛪ Grupos
                        {todayCongresses.length > 0 && (
                            <span className="telao__tab-count">{todayCongresses.length}</span>
                        )}
                    </button>
                </motion.div>

                {/* Título */}
                <motion.h1
                    className="telao__title"
                    key={`${activeTab}-${currentItems.length}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {renderTitle()}
                </motion.h1>

                {/* Carrossel */}
                {currentItems.length > 0 && (
                    <div className="telao__carousel">
                        {totalPages > 1 && (
                            <button className="telao__arrow telao__arrow--left" onClick={goPrev}>‹</button>
                        )}

                        <div className="telao__slide-wrap">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={`${activeTab}-${page}`}
                                    className="telao__visitors"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                >
                                    {currentSlice.map((item, index) => (
                                        <motion.div
                                            key={`${item.kind}-${item.data.id}`}
                                            className={`telao__visitor-card ${item.kind === 'congress' ? 'telao__congress-card' : ''}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.4 }}
                                        >
                                            <div className="telao__visitor-number">
                                                {page * PER_PAGE + index + 1}
                                            </div>
                                            <div className="telao__visitor-info">
                                                {item.kind === 'visitor' ? (
                                                    <>
                                                        <span className="telao__visitor-name">
                                                            {item.data.position
                                                                ? `${item.data.position} ${item.data.fullName}`
                                                                : item.data.fullName}
                                                        </span>
                                                        {item.data.howFound && (
                                                            <span className="telao__visitor-how">
                                                                conheceu nossa igreja: {item.data.howFound}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="telao__congress-type">
                                                            {item.data.congressType}
                                                        </span>
                                                        <span className="telao__visitor-name">
                                                            {item.data.churchName}
                                                        </span>
                                                        <span className="telao__visitor-how">
                                                            {item.data.groupName}
                                                        </span>
                                                        {item.data.pastors && (
                                                            <span className="telao__congress-detail">
                                                                🙏 {item.data.pastors.includes(',') || item.data.pastors.includes(' e ')
                                                                    ? `Pastores: ${item.data.pastors}`
                                                                    : `Pastor(a): ${item.data.pastors}`}
                                                            </span>
                                                        )}
                                                        {item.data.leaders && (
                                                            <span className="telao__congress-detail">
                                                                👥 {item.data.leaders.includes(',') || item.data.leaders.includes(' e ')
                                                                    ? `Líderes: ${item.data.leaders}`
                                                                    : `Líder: ${item.data.leaders}`}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <button className="telao__arrow telao__arrow--right" onClick={goNext}>›</button>
                        )}
                    </div>
                )}

                {/* Dots */}
                {totalPages > 1 && (
                    <div className="telao__dots">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={`telao__dot ${i === page ? 'telao__dot--active' : ''}`}
                                onClick={() => { setDirection(i > page ? 1 : -1); setPage(i); }}
                            />
                        ))}
                    </div>
                )}

                {/* Rodapé */}
                <motion.p
                    className="telao__footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {church.city} • {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                    })}
                </motion.p>
            </div>
        </div>
    );
}