import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Visitor } from '../types/visitor';

export interface Notification {
    id: string;
    visitor: Visitor;
    timestamp: Date;
    read: boolean;
}

export function useNotifications(
    visitors: Visitor[],
    loading: boolean,
    churchId: string | undefined,
) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toasts, setToasts] = useState<Notification[]>([]);
    const [lastSeenAt, setLastSeenAt] = useState<Date | null>(null);
    const [metaLoading, setMetaLoading] = useState(true);
    const prevCountRef = useRef<number | null>(null);
    const isFirstLoad = useRef(true);

    // Busca o lastSeenAt do Firestore quando logar
    useEffect(() => {
        if (!churchId) { setMetaLoading(false); return; }

        getDoc(doc(db, 'churches', churchId, 'meta', 'session')).then(snap => {
            if (snap.exists()) {
                const ts = snap.data().lastSeenAt;
                setLastSeenAt(ts ? new Date(ts) : null);
            }
            setMetaLoading(false);
        });
    }, [churchId]);

    // Salva o lastSeenAt no Firestore
    async function saveLastSeen(date: Date) {
        if (!churchId) return;
        await setDoc(
            doc(db, 'churches', churchId, 'meta', 'session'),
            { lastSeenAt: date.toISOString() },
            { merge: true }
        );
    }

    // Quando os visitantes carregam, gera notificações dos que são novos
    useEffect(() => {
        if (loading || metaLoading) return;

        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            prevCountRef.current = visitors.length;

            // Visitantes novos desde o último acesso
            const newVisitors = lastSeenAt
                ? visitors.filter(v => {
                    const createdAt = (v as any).createdAt;
                    if (!createdAt) return false;
                    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
                    return date > lastSeenAt;
                })
                : [];

            if (newVisitors.length > 0) {
                const initial: Notification[] = newVisitors.map(v => ({
                    id: crypto.randomUUID(),
                    visitor: v,
                    timestamp: (() => {
                        const createdAt = (v as any).createdAt;
                        return createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
                    })(),
                    read: false,
                }));
                setNotifications(initial);
                setToasts(initial.slice(0, 3)); // máximo 3 toasts de uma vez
            }
            return;
        }

        // Novos visitantes em tempo real (após a carga inicial)
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
    }, [visitors.length, loading, metaLoading]);

    // Remove toast após 5 segundos
    useEffect(() => {
        if (toasts.length === 0) return;
        const timer = setTimeout(() => {
            setToasts(prev => prev.slice(0, -1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [toasts]);

    function markAsRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }

    function markAsUnread(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: false } : n)
        );
    }

    function toggleRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
        );
    }

    // Marca todas como lidas E salva o timestamp no Firestore
    async function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        const now = new Date();
        setLastSeenAt(now);
        await saveLastSeen(now);
    }

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
        markAllRead,
        markAllUnread,
        toggleRead,
        markAsRead,
        markAsUnread,
        dismissToast,
    };
}