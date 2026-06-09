import type { Visitor } from '../../types/visitor';
import { Badge } from '../Badge/Badge';
import './VisitorCard.css';

interface VisitorCardProps {
  visitor: Visitor;
  onViewDetails: (id: string) => void;
}

export function VisitorCard({ visitor, onViewDetails }: VisitorCardProps) {
  const formattedDate = new Date(visitor.visitDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="visitor-card">
      <div className="visitor-card__left">
        <div className="visitor-card__name-row">
          <span className="visitor-card__name">{visitor.fullName}</span>
          <Badge status={visitor.status} />
        </div>
        <span className="visitor-card__date">Visited: {formattedDate}</span>
      </div>

      <div className="visitor-card__phone">
        <span className="visitor-card__icon">📞</span>
        {visitor.phone}
      </div>

      {visitor.favoriteHymn && (
        <div className="visitor-card__hymn">
          <span className="visitor-card__hymn-label">FAVORITE HYMN</span>
          <span>{visitor.favoriteHymn}</span>
        </div>
      )}

      <button
        className="visitor-card__btn"
        onClick={() => onViewDetails(visitor.id)}
      >
        View Details
      </button>
    </div>
  );
}
