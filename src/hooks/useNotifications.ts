import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Visitor } from '../types/visitor';
import type { Congress } from '../types/congress';

export interface Notification {
    id: string;
    visitor?: Visitor;
    congress?: Congress;
    kind: 'visitor' | 'congress';
    timestamp: Date;
    read: boolean;
}

function getCreatedAt(item: Visitor | Congress): Date | null {
    const raw = (item as any).createdAt;
    if (!raw) return null;
    if (raw instanceof Timestamp) return raw.toDate();
    if (raw?.toDate) return raw.toDate();
    if (typeof raw === 'string') return new Date(raw);
    return null;
}

export function useNotifications(
    visitors: Visitor[],
    congresses: Congress[],
    loading: boolean,
    churchId: string | undefined,
) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toasts, setToasts] = useState<Notification[]>([]);
    const [lastSeenAt, setLastSeenAt] = useState<Date | null>(null);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [metaLoading, setMetaLoading] = useState(true);

    const notifiedIds = useRef<Set<string>>(new Set());
    const initialized = useRef(false);

    useEffect(() => {
        if (!churchId) { setMetaLoading(false); return; }

        getDoc(doc(db, 'churches', churchId, 'meta', 'session')).then(snap => {
            if (snap.exists()) {
                const data = snap.data();
                if (data.lastSeenAt) setLastSeenAt(new Date(data.lastSeenAt));
                if (data.readIds) setReadIds(new Set(data.readIds));
            } else {
                const now = new Date();
                setLastSeenAt(now);
                setDoc(
                    doc(db, 'churches', churchId, 'meta', 'session'),
                    { lastSeenAt: now.toISOString(), readIds: [] },
                    { merge: true }
                );
            }
            setMetaLoading(false);
        });
    }, [churchId]);

    useEffect(() => {
        if (loading || metaLoading || lastSeenAt === null) return;

        // Novos visitantes
        const newVisitors = visitors.filter(v => {
            if (notifiedIds.current.has(`visitor-${v.id}`)) return false;
            if (readIds.has(`visitor-${v.id}`)) return false;
            const createdAt = getCreatedAt(v);
            if (!createdAt) return false;
            return createdAt > lastSeenAt;
        });

        // Novos congressos
        const newCongresses = congresses.filter(c => {
            if (notifiedIds.current.has(`congress-${c.id}`)) return false;
            if (readIds.has(`congress-${c.id}`)) return false;
            const createdAt = getCreatedAt(c);
            if (!createdAt) return false;
            return createdAt > lastSeenAt;
        });

        const allNew: Notification[] = [
            ...newVisitors.map(v => ({
                id: crypto.randomUUID(),
                kind: 'visitor' as const,
                visitor: v,
                timestamp: getCreatedAt(v) ?? new Date(),
                read: false,
            })),
            ...newCongresses.map(c => ({
                id: crypto.randomUUID(),
                kind: 'congress' as const,
                congress: c,
                timestamp: getCreatedAt(c) ?? new Date(),
                read: false,
            })),
        ];

        if (allNew.length === 0) {
            initialized.current = true;
            return;
        }

        const isFirstBatch = !initialized.current;
        initialized.current = true;

        newVisitors.forEach(v => notifiedIds.current.add(`visitor-${v.id}`));
        newCongresses.forEach(c => notifiedIds.current.add(`congress-${c.id}`));

        setNotifications(prev => [...allNew, ...prev]);

        const toastBatch = isFirstBatch ? allNew.slice(0, 3) : allNew;
        setToasts(prev => [...toastBatch, ...prev]);

    }, [visitors, congresses, loading, metaLoading, lastSeenAt, readIds]);

    useEffect(() => {
        if (toasts.length === 0) return;
        const timer = setTimeout(() => {
            setToasts(prev => prev.slice(0, -1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [toasts]);

    async function saveReadIds(ids: Set<string>) {
        if (!churchId) return;
        await setDoc(
            doc(db, 'churches', churchId, 'meta', 'session'),
            { readIds: Array.from(ids) },
            { merge: true }
        );
    }

    async function markAsRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        const notif = notifications.find(n => n.id === id);
        if (notif) {
            const key = notif.kind === 'visitor'
                ? `visitor-${notif.visitor?.id}`
                : `congress-${notif.congress?.id}`;
            const newReadIds = new Set(readIds);
            newReadIds.add(key);
            setReadIds(newReadIds);
            await saveReadIds(newReadIds);
        }
    }

    function markAsUnread(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: false } : n)
        );
    }

    function toggleRead(id: string) {
        const notif = notifications.find(n => n.id === id);
        if (!notif) return;
        notif.read ? markAsUnread(id) : markAsRead(id);
    }

    async function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        const now = new Date();
        setLastSeenAt(now);

        const newReadIds = new Set(readIds);
        notifications.forEach(n => {
            const key = n.kind === 'visitor'
                ? `visitor-${n.visitor?.id}`
                : `congress-${n.congress?.id}`;
            newReadIds.add(key);
        });
        setReadIds(newReadIds);

        await setDoc(
            doc(db, 'churches', churchId!, 'meta', 'session'),
            { lastSeenAt: now.toISOString(), readIds: Array.from(newReadIds) },
            { merge: true }
        );
    }

    function markAllUnread() {
        setNotifications(prev => prev.map(n => ({ ...n, read: false })));
    }

    function dismissToast(id: string) {
        setToasts(prev => prev.filter(n => n.id !== id));
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications, toasts, unreadCount,
        markAllRead, markAllUnread,
        markAsRead, markAsUnread,
        toggleRead, dismissToast,
    };
}