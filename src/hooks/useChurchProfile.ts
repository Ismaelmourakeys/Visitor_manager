import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ChurchData {
    churchName: string;
    city: string;
    pastor: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
}

export function useChurchProfile(uid: string | undefined) {
    const [church, setChurch] = useState<ChurchData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }

        getDoc(doc(db, 'churches', uid)).then(snapshot => {
            if (snapshot.exists()) {
                setChurch(snapshot.data() as ChurchData);
            } else {
                setChurch(null);
            }
            setLoading(false);
        });
    }, [uid]);

    function refresh() {
        if (!uid) return;
        setLoading(true);
        getDoc(doc(db, 'churches', uid)).then(snapshot => {
            if (snapshot.exists()) {
                setChurch(snapshot.data() as ChurchData);
            }
            setLoading(false);
        });
    }

    return { church, loading, refresh };
}