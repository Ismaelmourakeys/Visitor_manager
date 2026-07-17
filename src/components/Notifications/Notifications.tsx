import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '../../hooks/useNotifications';
import type { Visitor } from '../../types/visitor';
import './Notifications.css';

interface NotificationsProps {
    notifications: Notification[];
    unreadCount: number;
    toasts: Notification[];
    showPanel: boolean;
    onTogglePanel: () => void;
    onMarkAllRead: () => void;
    onMarkAllUnread: () => void;
    onToggleRead: (id: string) => void;
    onMarkAsRead: (id: string) => void;
    onDismissToast: (id: string) => void;
    onViewVisitor: (visitor: Visitor) => void;
}

export function Notifications({
    notifications, unreadCount, toasts,
    showPanel, onTogglePanel,
    onMarkAllRead, onMarkAllUnread,
    onToggleRead, onMarkAsRead,
    onDismissToast, onViewVisitor,
}: NotificationsProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                if (showPanel) onTogglePanel();
                setMenuOpenId(null);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showPanel]);

    function formatTime(date: Date) {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function handleViewVisitor(n: Notification) {
        onMarkAsRead(n.id); // marca como lido ao abrir
        onViewVisitor(n.visitor);
        onTogglePanel();
    }

    const allRead = notifications.length > 0 && notifications.every(n => n.read);

    return (
        <>
            {/* Toasts */}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            className="toast"
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 80 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="toast__icon">🙏</div>
                            <div className="toast__content">
                                <strong>Novo visitante!</strong>
                                <span>{toast.visitor.fullName}</span>
                            </div>
                            <div className="toast__actions">
                                <button
                                    className="toast__view"
                                    onClick={() => {
                                        onViewVisitor(toast.visitor);
                                        onDismissToast(toast.id);
                                    }}
                                >
                                    Ver
                                </button>
                                <button
                                    className="toast__close"
                                    onClick={() => onDismissToast(toast.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Sino + Painel */}
            <div className="notif" ref={panelRef}>
                <button className="notif__bell" onClick={onTogglePanel} title="Notificações">
                    🔔
                    {unreadCount > 0 && (
                        <span className="notif__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                </button>

                <AnimatePresence>
                    {showPanel && (
                        <motion.div
                            className="notif__panel"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="notif__header">
                                <span>Notificações {unreadCount > 0 && <span className="notif__header-count">{unreadCount}</span>}</span>
                                <div className="notif__header-actions">
                                    {notifications.length > 0 && (
                                        allRead ? (
                                            <button className="notif__action-btn" onClick={onMarkAllUnread}>
                                                Marcar todas como não lidas
                                            </button>
                                        ) : (
                                            <button className="notif__action-btn" onClick={onMarkAllRead}>
                                                Marcar todas como lidas
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="notif__list">
                                {notifications.length === 0 ? (
                                    <div className="notif__empty">
                                        <span>🔕</span>
                                        <p>Nenhuma notificação ainda</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n.id}
                                            className={`notif__item ${!n.read ? 'notif__item--unread' : ''}`}
                                        >
                                            <div
                                                className="notif__item-main"
                                                onClick={() => handleViewVisitor(n)}
                                            >
                                                <div className="notif__item-icon">🙏</div>
                                                <div className="notif__item-content">
                                                    <strong>{n.visitor.fullName}</strong>
                                                    <span>
                                                        {n.visitor.position ? `${n.visitor.position} • ` : ''}
                                                        {n.visitor.visitedTimes || 'Nova visita'}
                                                    </span>
                                                    <time>{formatTime(n.timestamp)}</time>
                                                </div>
                                                {!n.read && <div className="notif__item-dot" />}
                                            </div>

                                            {/* Menu de ações */}
                                            <div className="notif__item-menu">
                                                <button
                                                    className="notif__item-menu-btn"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setMenuOpenId(menuOpenId === n.id ? null : n.id);
                                                    }}
                                                >
                                                    ⋯
                                                </button>
                                                <AnimatePresence>
                                                    {menuOpenId === n.id && (
                                                        <motion.div
                                                            className="notif__item-dropdown"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    handleViewVisitor(n);
                                                                    setMenuOpenId(null);
                                                                }}
                                                            >
                                                                👁 Ver detalhes
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    onToggleRead(n.id);
                                                                    setMenuOpenId(null);
                                                                }}
                                                            >
                                                                {n.read ? '🔵 Marcar como não lida' : '✅ Marcar como lida'}
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}