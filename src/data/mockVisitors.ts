import type { Visitor } from '../types/visitor';

export const mockVisitors: Visitor[] = [
    {
        id: '1',
        fullName: 'Sarah Jenkins',
        phone: '(555) 123-4567',
        email: 'sarah@email.com',
        howFound: 'Friend/Family',
        invitedBy: 'Maria Silva',
        visitDate: '2023-10-15',
        favoriteHymn: 'Amazing Grace',
        status: 'New',
    },
    {
        id: '2',
        fullName: 'Marcus Reed',
        phone: '(555) 987-6543',
        howFound: 'Social Media',
        visitDate: '2023-10-08',
        favoriteHymn: 'How Great Thou Art',
        status: 'Contact Made',
    },
    {
        id: '3',
        fullName: 'Elena Patel',
        phone: '(555) 234-5678',
        howFound: 'Walked By',
        visitDate: '2023-09-24',
        favoriteHymn: 'Be Thou My Vision',
        status: 'Contact Made',
    },
];