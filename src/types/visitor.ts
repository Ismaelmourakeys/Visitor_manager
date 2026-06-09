export type HowFound =
  | '1 vez'
  | '2 vezes'
  | '3 vezes ou mais';

export type VisitorStatus = 'New' | 'Contact Made' | 'Regular';

export interface Visitor {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  visitedTimes?: string;
  visitDate: string;
  position?: string;
  howFound?: String;
  status: VisitorStatus;
}
