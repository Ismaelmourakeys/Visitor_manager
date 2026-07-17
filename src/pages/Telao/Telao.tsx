import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Visitor } from '../../types/visitor';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './Telao.css';

interface TelaoProps {
    visitors: Visitor[];
    church: ChurchData;
    onClose: () => void;
}

const PER_PAGE = 4;

export function Telao({ visitors, church, onClose }: TelaoProps) {
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = visitors.filter(v => v.visitDate === today);
    const isPlural = todayVisitors.length > 1;

    const totalPages = Math.ceil(todayVisitors.length / PER_PAGE);
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);

    // Visitantes da página atual
    const currentVisitors = todayVisitors.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

    // Avança automaticamente a cada 30 segundos se tiver mais de uma página
    useEffect(() => {
        if (totalPages <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setPage(p => (p + 1) % totalPages);
        }, 100000);
        return () => clearInterval(timer);
    }, [totalPages]);

    // Fecha com ESC
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
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

    return (
        <div className="telao">
            {/* Botão fechar */}
            <button className="telao__close" onClick={onClose}>
                ✕ Sair (ESC)
            </button>

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

                {/* Título */}
                <motion.h1
                    className="telao__title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {todayVisitors.length === 0
                        ? 'Nenhum visitante hoje ainda 🙏'
                        : isPlural ? 'Sejam bem-vindos! 🎉' : 'Seja bem-vindo! 🎉'}
                </motion.h1>

                {/* Carrossel */}
                {todayVisitors.length > 0 && (
                    <div className="telao__carousel">

                        {/* Botão anterior */}
                        {totalPages > 1 && (
                            <button className="telao__arrow telao__arrow--left" onClick={goPrev}>
                                ‹
                            </button>
                        )}

                        {/* Slide */}
                        <div className="telao__slide-wrap">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={page}
                                    className="telao__visitors"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                >
                                    {currentVisitors.map((visitor, index) => (
                                        <motion.div
                                            key={visitor.id}
                                            className="telao__visitor-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.4 }}
                                        >
                                            <div className="telao__visitor-number">
                                                {page * PER_PAGE + index + 1}
                                            </div>
                                            <div className="telao__visitor-info">
                                                <span className="telao__visitor-name">
                                                    {visitor.position
                                                        ? `${visitor.position} ${visitor.fullName}`
                                                        : visitor.fullName}
                                                </span>
                                                {visitor.howFound && (
                                                    <span className="telao__visitor-how">
                                                        conheceu nossa igreja: {visitor.howFound}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Botão próximo */}
                        {totalPages > 1 && (
                            <button className="telao__arrow telao__arrow--right" onClick={goNext}>
                                ›
                            </button>
                        )}
                    </div>
                )}

                {/* Indicadores de página */}
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