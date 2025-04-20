// src/lib/constants/colors.ts

export const STATUS_COLORS = {
    PLAYBOOK: {
      base: '[var(--accent)]',
      light: '[var(--accent)]',
      border: 'border-[var(--accent)]',
      bg: 'bg-[var(--accent)]',
      bgHover: 'hover:bg-[var(--accent)]/90',
      bgFaded: 'bg-[var(--accent)]/20',
      bgFadedHover: 'hover:bg-[var(--accent)]/30',
      text: 'text-[var(--accent)]',
      textLight: 'text-[var(--accent)]'
    },
    SUGGESTED: {
      base: '[var(--primary)]',
      light: '[var(--primary)]',
      border: 'border-[var(--primary)]',
      bg: 'bg-[var(--primary)]',
      bgHover: 'hover:bg-[var(--primary)]/90',
      bgFaded: 'bg-[var(--primary)]/20',
      bgFadedHover: 'hover:bg-[var(--primary)]/30',
      text: 'text-[var(--primary)]',
      textLight: 'text-[var(--primary)]'
    },
   
    PRACTICE: {
        base: '[var(--warning)]',
        light: '[var(--warning)]',
        border: 'border-[var(--warning)]',
        bg: 'bg-[var(--warning)]',
        bgHover: 'hover:bg-[var(--warning)]/90',
        bgFaded: 'bg-[var(--warning)]/20',
        bgFadedHover: 'hover:bg-[var(--warning)]/30',
        gradient: 'bg-[var(--warning)]/10',
        text: 'text-[var(--warning)]',
        textLight: 'text-[var(--warning)]'
    } as const,

    REVIEW: {
      base: '[var(--success)]',
      light: '[var(--success)]',
      border: 'border-[var(--success)]',
      bg: 'bg-[var(--success)]',
      bgHover: 'hover:bg-[var(--success)]/90',
      bgFaded: 'bg-[var(--success)]/20',
      bgFadedHover: 'hover:bg-[var(--success)]/30',
      text: 'text-[var(--success)]',
      textLight: 'text-[var(--success)]'
    },
    DISCARDED: {
      base: '[var(--muted)]',
      light: '[var(--muted)]',
      border: 'border-[var(--muted)]',
      bg: 'bg-[var(--muted)]',
      bgHover: 'hover:bg-[var(--muted)]/90',
      bgFaded: 'bg-[var(--muted)]/20',
      bgFadedHover: 'hover:bg-[var(--muted)]/30',
      text: 'text-[var(--muted-foreground)]',
      textLight: 'text-[var(--muted-foreground)]'
    },
    PARKED: {
      base: '[var(--secondary)]',
      light: '[var(--secondary)]',
      border: 'border-[var(--secondary)]',
      bg: 'bg-[var(--secondary)]',
      bgHover: 'hover:bg-[var(--secondary)]/90',
      bgFaded: 'bg-[var(--secondary)]/20',
      bgFadedHover: 'hover:bg-[var(--secondary)]/30',
      text: 'text-[var(--secondary-foreground)]',
      textLight: 'text-[var(--secondary-foreground)]'
    }
  } as const;
  
  // Helper function to get color classes
  export function getStatusColorClasses(status: keyof typeof STATUS_COLORS, variant: 'solid' | 'faded' = 'solid') {
    const colors = STATUS_COLORS[status];
    if (variant === 'faded') {
      return `${colors.bgFaded} ${colors.bgFadedHover} ${colors.text}`;
    }
    return `${colors.bg} ${colors.bgHover} text-[var(--primary-foreground)]`;
  }