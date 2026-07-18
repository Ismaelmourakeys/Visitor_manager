import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Visitor } from '../types/visitor';

export interface Notification {
    id: string;
    visitor: Visitor;
    timestamp: Date;
    read: boolean;
}

function getCreatedAt(visitor: Visitor): Date | null {
    const raw = (visitor as any).createdAt;
    if (!raw) return null;
    if (raw instanceof Timestamp) return raw.toDate();
    if (raw?.toDate) return raw.toDate();
    if (typeof raw === 'string') return new Date(raw);
    return null;
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

    // IDs já notificados — evita duplicatas ao receber updates do onSnapshot
    const notifiedIds = useRef<Set<string>>(new Set());
    const initialized = useRef(false);

    // 1. Carrega lastSeenAt do Firestore
    useEffect(() => {
        if (!churchId) { setMetaLoading(false); return; }

        getDoc(doc(db, 'churches', churchId, 'meta', 'session')).then(snap => {
            if (snap.exists() && snap.data().lastSeenAt) {
                setLastSeenAt(new Date(snap.data().lastSeenAt));
            } else {
                // Primeira vez — lastSeenAt = agora, pra não notificar histórico
                const now = new Date();
                setLastSeenAt(now);
                setDoc(
                    doc(db, 'churches', churchId, 'meta', 'session'),
                    { lastSeenAt: now.toISOString() },
                    { merge: true }
                );
            }
            setMetaLoading(false);
        });
    }, [churchId]);

    // 2. Detecta visitantes novos toda vez que a lista muda (tempo real)
    useEffect(() => {
        if (loading || metaLoading || lastSeenAt === null) return;

        const newVisitors = visitors.filter(v => {
            // Já foi notificado antes
            if (notifiedIds.current.has(v.id)) return false;

            const createdAt = getCreatedAt(v);
            if (!createdAt) return false;

            // Só notifica se foi criado DEPOIS do lastSeenAt
            return createdAt > lastSeenAt;
        });

        if (newVisitors.length === 0) {
            initialized.current = true;
            return;
        }

        const isFirstBatch = !initialized.current;
        initialized.current = true;

        const newNotifications: Notification[] = newVisitors.map(v => ({
            id: crypto.randomUUID(),
            visitor: v,
            timestamp: getCreatedAt(v) ?? new Date(),
            read: false,
        }));

        // Marca como notificados
        newVisitors.forEach(v => notifiedIds.current.add(v.id));

        setNotifications(prev => [...newNotifications, ...prev]);

        // Toasts: no primeiro batch mostra no máximo 3
        // Em atualizações tempo real mostra todos
        const toastBatch = isFirstBatch
            ? newNotifications.slice(0, 3)
            : newNotifications;

        setToasts(prev => [...toastBatch, ...prev]);

    }, [visitors, loading, metaLoading, lastSeenAt]);

    // 3. Remove toasts automaticamente após 5s
    useEffect(() => {
        if (toasts.length === 0) return;
        const timer = setTimeout(() => {
            setToasts(prev => prev.slice(0, -1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [toasts]);

    async function saveLastSeen(date: Date) {
        if (!churchId) return;
        await setDoc(
            doc(db, 'churches', churchId, 'meta', 'session'),
            { lastSeenAt: date.toISOString() },
            { merge: true }
        );
    }

    async function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        const now = new Date();
        setLastSeenAt(now);
        // Atualiza o lastSeenAt no Firestore pra todos os dispositivos
        await saveLastSeen(now);
    }

    function markAllUnread() {
        setNotifications(prev => prev.map(n => ({ ...n, read: false })));
    }

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
        markAsRead,
        markAsUnread,
        toggleRead,
        dismissToast,
    };
}