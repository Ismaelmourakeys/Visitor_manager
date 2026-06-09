// VisitorCard.tsx
import type { Visitor } from '../../../types/visitor';
import { Badge } from '../Badge/Badge';
import './VisitorCard.css';

interface VisitorCardProps {
    visitor: Visitor;
    onViewDetails: (id: string) => void;
}

export function VisitorCard({ visitor, onViewDetails }: VisitorCardProps) {
    return (
        <div className="visitor-card">
            <div className="visitor-info">
                <div className="visitor-name">
                    {visitor.fullName}
                    {visitor.status === 'New' && <Badge status="New" />}
                    {visitor.status === 'Contact Made' && <Badge status="Contact Made" />}
                </div>
                <div className="visitor-meta">
                    Visited: {new Date(visitor.visitDate).toLocaleDateString('en-US', {
                        month: 'short', day: '2-digit', year: 'numeric'
                    })}
                </div>
            </div>

            <div className="visitor-phone">📞 {visitor.phone}</div>

            {visitor.favoriteHymn && (
                <div className="visitor-hymn">
                    <span className="hymn-label">FAVORITE HYMN</span>
                    <span>{visitor.favoriteHymn}</span>
                </div>
            )}

            <button
                className="btn-view"
                onClick={() => onViewDetails(visitor.id)}
            >
                View Details
            </button>
        </div>
    );
}