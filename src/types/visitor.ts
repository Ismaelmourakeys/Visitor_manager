export type HowFound =
  | 'Social Media'
  | 'Friend/Family'
  | 'Walked By'
  | 'Online Search'
  | 'Other';

export type VisitorStatus = 'New' | 'Contact Made' | 'Regular';

export interface Visitor {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  howFound: HowFound;
  invitedBy?: string;
  visitDate: string;
  favoriteHymn?: string;
  status: VisitorStatus;
}
