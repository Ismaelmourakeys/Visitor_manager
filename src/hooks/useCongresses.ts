import { useState, useEffect } from 'react';
import {
    collection, addDoc, onSnapshot,
    query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Congress } from '../types/congress';

export function useCongresses(churchId: string | undefined) {
    const [congresses, setCongresses] = useState<Congress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!churchId) { setLoading(false); return; }

        const ref = collection(db, 'churches', churchId, 'congresses');
        const q = query(ref, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            const data = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })) as Congress[];
            setCongresses(data);
            setLoading(false);
        });

        return unsubscribe;
    }, [churchId]);

    async function addCongress(congress: Omit<Congress, 'id'>) {
        if (!churchId) return;
        const ref = collection(db, 'churches', churchId, 'congresses');
        const clean = Object.fromEntries(
            Object.entries(congress).map(([k, v]) => [k, v === undefined ? null : v])
        );
        await addDoc(ref, { ...clean, createdAt: serverTimestamp() });
    }

    async function deleteCongress(id: string) {
        if (!churchId) return;
        await deleteDoc(doc(db, 'churches', churchId, 'congresses', id));
    }

    async function updateCongress(id: string, data: Partial<Congress>) {
        if (!churchId) return;
        await updateDoc(doc(db, 'churches', churchId, 'congresses', id), data);
    }

    return { congresses, loading, addCongress, deleteCongress, updateCongress };
}