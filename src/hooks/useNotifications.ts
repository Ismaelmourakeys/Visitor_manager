import { useState, useEffect, useRef } from 'react';
import type { Visitor } from '../types/visitor';

export interface Notification {
    id: string;
    visitor: Visitor;
    timestamp: Date;
    read: boolean;
}

export function useNotifications(visitors: Visitor[], loading: boolean) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toasts, setToasts] = useState<Notification[]>([]);
    const prevCountRef = useRef<number | null>(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (loading) return;

        if (isFirstLoad.current) {
            prevCountRef.current = visitors.length;
            isFirstLoad.current = false;
            return;
        }

        if (prevCountRef.current !== null && visitors.length > prevCountRef.current) {
            const newVisitors = visitors.slice(0, visitors.length - prevCountRef.current);

            const newNotifications: Notification[] = newVisitors.map(v => ({
                id: crypto.randomUUID(),
                visitor: v,
                timestamp: new Date(),
                read: false,
            }));

            setNotifications(prev => [...newNotifications, ...prev]);
            setToasts(prev => [...newNotifications, ...prev]);
        }

        prevCountRef.current = visitors.length;
    }, [visitors.length, loading]);

    useEffect(() => {
        if (toasts.length === 0) return;
        const timer = setTimeout(() => {
            setToasts(prev => prev.slice(0, -1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [toasts]);

    // Marca uma notificação como lida
    function markAsRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }

    // Marca como não lida
    function markAsUnread(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: false } : n)
        );
    }

    // Alterna entre lido/não lido
    function toggleRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
        );
    }

    // Marca todas como lidas
    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    // Marca todas como não lidas
    function markAllUnread() {
        setNotifications(prev => prev.map(n => ({ ...n, read: false })));
    }

    function dismissToast(id: string) {
        setToasts(prev => prev.filter(n => n.id !== id));
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        toasts,
        unreadCount,
        markAsRead,
        markAsUnread,
        toggleRead,
        markAllRead,
        markAllUnread,
        dismissToast,
    };
}