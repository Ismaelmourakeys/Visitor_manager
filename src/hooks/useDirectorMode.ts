import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useDirectorMode(churchId: string | undefined) {
    const [presentedVisitorIds, setPresentedVisitorIds] = useState<Set<string>>(new Set());
    const [presentedCongressIds, setPresentedCongressIds] = useState<Set<string>>(new Set());
    const [playedCongressIds, setPlayedCongressIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Ouve mudanças em tempo real no Firestore
    useEffect(() => {
        if (!churchId) { setLoading(false); return; }

        const ref = doc(db, 'churches', churchId, 'meta', 'directorSession');

        const unsubscribe = onSnapshot(ref, snap => {
            if (snap.exists()) {
                const data = snap.data();
                setPresentedVisitorIds(new Set(data.presentedVisitorIds ?? []));
                setPresentedCongressIds(new Set(data.presentedCongressIds ?? []));
                setPlayedCongressIds(new Set(data.playedCongressIds ?? []));
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [churchId]);

    async function save(
        visitorIds: Set<string>,
        congressIds: Set<string>,
        playedIds: Set<string>,
    ) {
        if (!churchId) return;
        await setDoc(
            doc(db, 'churches', churchId, 'meta', 'directorSession'),
            {
                presentedVisitorIds: Array.from(visitorIds),
                presentedCongressIds: Array.from(congressIds),
                playedCongressIds: Array.from(playedIds),
            },
            { merge: true }
        );
    }

    async function toggleVisitor(id: string) {
        const next = new Set(presentedVisitorIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setPresentedVisitorIds(next);
        await save(next, presentedCongressIds, playedCongressIds);
    }

    async function toggleCongress(id: string) {
        const next = new Set(presentedCongressIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setPresentedCongressIds(next);
        await save(presentedVisitorIds, next, playedCongressIds);
    }

    async function togglePlayed(id: string) {
        const next = new Set(playedCongressIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setPlayedCongressIds(next);
        await save(presentedVisitorIds, presentedCongressIds, next);
    }

    async function resetSession() {
        const empty = new Set<string>();
        setPresentedVisitorIds(empty);
        setPresentedCongressIds(empty);
        setPlayedCongressIds(empty);
        await save(empty, empty, empty);
    }

    return {
        presentedVisitorIds,
        presentedCongressIds,
        playedCongressIds,
        loading,
        toggleVisitor,
        toggleCongress,
        togglePlayed,
        resetSession,
    };
}