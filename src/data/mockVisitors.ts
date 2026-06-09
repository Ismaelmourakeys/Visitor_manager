import type { Visitor } from '../types/visitor';

// 🔌 BACKEND: remover esse arquivo e substituir por uma chamada API
// Exemplo: const visitors = await fetch('/api/visitors').then(r => r.json())

export const mockVisitors: Visitor[] = [
  {
    id: '1',
    fullName: 'Severinildes Castanhola',
    phone: '(555) 123-4567',
    email: 'sarah@email.com',
    visitedTimes: '1 vez',
    howFound: 'Indicação de amigo',
    position: 'Missionária',
    visitDate: '2023-10-15',
    status: 'New',
  },
  {
    id: '2',
    fullName: 'Samuel L. Jackson',
    phone: '(555) 987-6543',
    email: 'samuel.jackson@email.com',
    visitedTimes: '2 vezes',
    howFound: 'Redes Sociais',
    visitDate: '2023-10-08',
    status: 'Contact Made',
  },
  {
    id: '3',
    fullName: 'Elena Pastel',
    phone: '(555) 234-5678',
    visitedTimes: '3 vezes ou mais',
    howFound: 'Passando pela rua',
    visitDate: '2023-09-24',
    status: 'Contact Made',
  },
  {
    id: '4',
    fullName: 'Ronald Mc.Donalds',
    phone: '(19) 99124-0015',
    visitedTimes: '1 vez',
    howFound: 'Indicação de amigo',
    visitDate: '2023-09-20',
    status: 'New',
  },
  {
    id: '5',
    fullName: 'Ana Beatriz Barbosa',
    phone: '(19) 98123-4321',
    visitedTimes: '1 vez',
    howFound: 'Pesquisa Online',
    visitDate: '2023-10-10',
    status: 'Regular',
  },
];