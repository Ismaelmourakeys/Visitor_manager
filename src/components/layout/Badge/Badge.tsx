// Badge.tsx
//import './Badge.css'; // ou inline styles

interface BadgeProps {
    status: 'New' | 'Contact Made' | 'Regular';
}

const colors = {
    'New': { bg: '#d1fae5', text: '#065f46' },
    'Contact Made': { bg: '#fef9c3', text: '#854d0e' },
    'Regular': { bg: '#dbeafe', text: '#1e40af' },
};

export function Badge({ status }: BadgeProps) {
    const { bg, text } = colors[status];
    return (
        <span style={{
            background: bg,
            color: text,
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
        }}>
            {status}
        </span>
    );
}