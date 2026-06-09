import type { Visitor } from '../../types/visitor';
import { Badge } from '../Badge/Badge';
import './VisitorDetails.css';

interface VisitorDetailsProps {
  visitor: Visitor;
  onClose: () => void;
}

export function VisitorDetails({ visitor, onClose }: VisitorDetailsProps) {
  const formattedDate = new Date(visitor.visitDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div>
            <h2 className="modal__name">{visitor.fullName}</h2>
            <Badge status={visitor.status} />
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="modal__row">
            <span className="modal__label">📅 Data da Visita</span>
            <span>{formattedDate}</span>
          </div>

          {visitor.visitedTimes && (
            <div className="modal__row">
              <span className="modal__label">🔁 Quantas vezes visitou</span>
              <span>{visitor.visitedTimes}</span>
            </div>
          )}

          {visitor.position && (
            <div className="modal__row">
              <span className="modal__label">🏷️ Cargo</span>
              <span>{visitor.position}</span>
            </div>
          )}

          {visitor.howFound && (
            <div className="modal__row">
              <span className="modal__label">💡 Como conheceu</span>
              <span>{visitor.howFound}</span>
            </div>
          )}

          <div className="modal__divider">Informações de Contato</div>

          {visitor.phone ? (
            <div className="modal__row">
              <span className="modal__label">📞 Telefone / WhatsApp</span>
              <a href={`tel:${visitor.phone}`}>{visitor.phone}</a>
            </div>
          ) : (
            <div className="modal__row">
              <span className="modal__label">📞 Telefone / WhatsApp</span>
              <span className="modal__empty">Não informado</span>
            </div>
          )}

          {visitor.email ? (
            <div className="modal__row">
              <span className="modal__label">✉️ Email</span>
              <a href={`mailto:${visitor.email}`}>{visitor.email}</a>
            </div>
          ) : (
            <div className="modal__row">
              <span className="modal__label">✉️ Email</span>
              <span className="modal__empty">Não informado</span>
            </div>
          )}
        </div>

        <div className="modal__footer">
          <button className="modal__btn-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}