export const theme = {
  colors: {
    primary:     '#2d6a4f',
    primaryDark: '#1b4332',
    dark:        '#1a1a2e',
    darkMid:     '#16213e',
    text:        '#1f2937',
    textMuted:   '#6b7280',
    bg:          '#f5f5f5',
    white:       '#ffffff',
    border:      '#e5e7eb',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm:   '6px',
    md:   '10px',
    lg:   '16px',
    full: '999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
  },
} as const;

export type Theme = typeof theme;