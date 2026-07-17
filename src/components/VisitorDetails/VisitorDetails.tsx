import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Visitor } from '../../types/visitor';
import { Badge } from '../Badge/Badge';
import './VisitorDetails.css';

interface VisitorDetailsProps {
  visitor: Visitor;
  churchId: string;
  onClose: () => void;
  onDeleted: () => void;
  onUpdated: (updated: Visitor) => void;
}

export function VisitorDetails({ visitor, churchId, onClose, onDeleted, onUpdated }: VisitorDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...visitor });

  function set(field: keyof Visitor, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const formattedDate = new Date(visitor.visitDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'churches', churchId, 'visitors', visitor.id));
      onDeleted();
      onClose();
    } catch {
      alert('Erro ao deletar visitante.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const { id, ...data } = form;
      await updateDoc(doc(db, 'churches', churchId, 'visitors', visitor.id), {
        ...data,
        phone: form.phone || null,
        email: form.email || null,
        position: form.position || null,
        howFound: form.howFound || null,
      });
      onUpdated(form);
      setEditing(false);
    } catch {
      alert('Erro ao atualizar visitante.');
    } finally {
      setLoading(false);
    }
  }

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
          {!editing ? (
            // ── Modo visualização ──
            <>
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
              <div className="modal__divider">Contato</div>
              <div className="modal__row">
                <span className="modal__label">📞 Telefone</span>
                {visitor.phone
                  ? <a href={`tel:${visitor.phone}`}>{visitor.phone}</a>
                  : <span className="modal__empty">Não informado</span>}
              </div>
              <div className="modal__row">
                <span className="modal__label">✉️ Email</span>
                {visitor.email
                  ? <a href={`mailto:${visitor.email}`}>{visitor.email}</a>
                  : <span className="modal__empty">Não informado</span>}
              </div>
            </>
          ) : (
            // ── Modo edição ──
            <>
              <div className="modal__edit-field">
                <label>Nome completo</label>
                <input value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
              <div className="modal__edit-row">
                <div className="modal__edit-field">
                  <label>Telefone</label>
                  <input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="(00) 00000-0000" />
                </div>
                <div className="modal__edit-field">
                  <label>Email</label>
                  <input value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
                </div>
              </div>
              <div className="modal__edit-row">
                <div className="modal__edit-field">
                  <label>Cargo</label>
                  <input value={form.position || ''} onChange={e => set('position', e.target.value)} placeholder="Ex: Presbítero" />
                </div>
                <div className="modal__edit-field">
                  <label>Quantas vezes visitou</label>
                  <select value={form.visitedTimes || ''} onChange={e => set('visitedTimes', e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="1 vez">1 vez</option>
                    <option value="2 vezes">2 vezes</option>
                    <option value="3 vezes ou mais">3 vezes ou mais</option>
                  </select>
                </div>
              </div>
              <div className="modal__edit-field">
                <label>Como conheceu a igreja</label>
                <input
                  value={form.howFound ? String(form.howFound) : ''}
                  onChange={e => set('howFound', e.target.value)}
                  placeholder="Ex: Indicação de amigo"
                />
              </div>
              <div className="modal__edit-row">
                <div className="modal__edit-field">
                  <label>Data da Visita</label>
                  <input type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} />
                </div>
                <div className="modal__edit-field">
                  <label>Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="New">Novo</option>
                    <option value="Contact Made">Recorrente</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirmação de exclusão */}
        {deleting && (
          <div className="modal__confirm-delete">
            <p>Tem certeza que deseja excluir <strong>{visitor.fullName}</strong>?</p>
            <div className="modal__confirm-actions">
              <button onClick={() => setDeleting(false)}>Cancelar</button>
              <button className="modal__confirm-delete-btn" onClick={handleDelete} disabled={loading}>
                {loading ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        )}

        <div className="modal__footer">
          {!editing ? (
            <>
              <button className="modal__btn-delete" onClick={() => setDeleting(true)}>
                🗑 Excluir
              </button>
              <div style={{ flex: 1 }} />
              <button className="modal__btn-edit" onClick={() => setEditing(true)}>
                ✏️ Editar
              </button>
              <button className="modal__btn-close" onClick={onClose}>
                Fechar
              </button>
            </>
          ) : (
            <>
              <button className="modal__btn-delete" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <div style={{ flex: 1 }} />
              <button className="modal__btn-close" onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : '✅ Salvar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}