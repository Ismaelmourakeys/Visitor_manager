import type { Visitor } from '../../types/visitor';
import { Badge } from '../Badge/Badge';
import './VisitorCard.css';

interface VisitorCardProps {
  visitor: Visitor;
  onViewDetails: (visitor: Visitor) => void;
}

export function VisitorCard({ visitor, onViewDetails }: VisitorCardProps) {
  const formattedDate = new Date(visitor.visitDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="visitor-card">
      <div className="visitor-card__left">
        <div className="visitor-card__name-row">
          <span className="visitor-card__name">{visitor.fullName}</span>
          <Badge status={visitor.status} />
        </div>
        <span className="visitor-card__date">📅 {formattedDate}</span>
      </div>

      <div className="visitor-card__meta">
        {visitor.visitedTimes && (
          <span className="visitor-card__meta-item">
            <span className="visitor-card__meta-label">VISITAS</span>
            {visitor.visitedTimes}
          </span>
        )}
        {visitor.position && (
          <span className="visitor-card__meta-item">
            <span className="visitor-card__meta-label">CARGO</span>
            {visitor.position}
          </span>
        )}
        {visitor.howFound && (
          <span className="visitor-card__meta-item">
            <span className="visitor-card__meta-label">COMO CONHECEU</span>
            {visitor.howFound}
          </span>
        )}
      </div>

      <button
        className="visitor-card__btn"
        onClick={() => onViewDetails(visitor)}
      >
        Ver Detalhes
      </button>
    </div>
  );
}