export type CongressType =
    | 'Irmãs'
    | 'Mocidade'
    | 'Varões'
    | 'Adolescentes'
    | 'Crianças'
    | 'Culto Eventual'
    | 'Outro';

export interface Congress {
    id: string;
    churchName: string;
    groupName: string;
    leaders?: string;
    pastors?: string;
    worship?: string;
    congressType: CongressType;
    date: string;
    createdAt?: any;
}