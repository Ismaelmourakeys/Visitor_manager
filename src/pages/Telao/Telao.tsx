import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Visitor } from '../../types/visitor';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './Telao.css';

interface TelaoProps {
    visitors: Visitor[];
    church: ChurchData;
    onClose: () => void;
}

export function Telao({ visitors, church, onClose }: TelaoProps) {
    const today = new Date().toISOString().split('T')[0];

    const todayVisitors = visitors.filter(v => v.visitDate === today);
    const isPlural = todayVisitors.length > 1;

    // Fecha com ESC
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    function buildGreeting(visitor: Visitor) {
        const parts: string[] = [];

        if (visitor.position) {
            parts.push(`${visitor.position} ${visitor.fullName}`);
        } else {
            parts.push(visitor.fullName);
        }

        if (visitor.howFound) {
            parts.push(`conheceu nossa igreja: ${visitor.howFound}`);
        }

        return parts;
    }

    return (
        <div className="telao">
            {/* Botão fechar */}
            <button className="telao__close" onClick={onClose}>
                ✕ Sair do Telão (ESC)
            </button>

            <div className="telao__content">
                {/* Logo + Nome da Igreja */}
                <motion.div
                    className="telao__church"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {church.logoUrl && (
                        <img
                            src={church.logoUrl}
                            alt={church.churchName}
                            className="telao__logo"
                        />
                    )}
                    <span className="telao__church-name">{church.churchName}</span>
                </motion.div>

                {/* Título */}
                <motion.h1
                    className="telao__title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {todayVisitors.length === 0
                        ? 'Nenhum visitante hoje ainda 🙏'
                        : isPlural
                            ? 'Sejam bem-vindos! 🎉'
                            : 'Seja bem-vindo! 🎉'}
                </motion.h1>

                {/* Lista de visitantes */}
                {todayVisitors.length > 0 && (
                    <div className="telao__visitors">
                        <AnimatePresence>
                            {todayVisitors.map((visitor, index) => {
                                const [namepart, howFoundPart] = buildGreeting(visitor);
                                return (
                                    <motion.div
                                        key={visitor.id}
                                        className="telao__visitor-card"
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                                    >
                                        <div className="telao__visitor-number">{index + 1}</div>
                                        <div className="telao__visitor-info">
                                            <span className="telao__visitor-name">{namepart}</span>
                                            {howFoundPart && (
                                                <span className="telao__visitor-how">
                                                    {howFoundPart}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Rodapé */}
                <motion.p
                    className="telao__footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    {church.city} • {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                    })}
                </motion.p>
            </div>
        </div>
    );
}