import type { VisitorStatus } from '../../types/visitor';

interface BadgeProps {
  status: VisitorStatus;
}

const config: Record<VisitorStatus, { bg: string; color: string; label: string }> = {
  'New':          { bg: '#d1fae5', color: '#065f46', label: 'Novo' },        // 🟢 verde
  'Contact Made': { bg: '#fef9c3', color: '#854d0e', label: 'Recorrente' },  // 🟡 amarelo
  'Regular':      { bg: '#dbeafe', color: '#1e40af', label: 'Regular' },     // 🔵 azul
};

export function Badge({ status }: BadgeProps) {
  const { bg, color } = config[status];
  return (
    <span style={{
      background: bg,
      color,
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}