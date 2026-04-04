/**
 * Design System & Theme Configuration
 * Modern, Professional, Attractive Design for SADHNA
 */

export const designSystem = {
  // Color Palette
  colors: {
    // Primary Gradient
    primary: '#4F46E5',
    primaryLight: '#6366F1',
    primaryDark: '#4338CA',
    
    // Secondary (Accent)
    accent: '#EC4899',
    accentLight: '#F472B6',
    accentDark: '#BE185D',
    
    // Success
    success: '#10B981',
    successLight: '#6EE7B7',
    successDark: '#047857',
    
    // Warning
    warning: '#F59E0B',
    warningLight: '#FCD34D',
    warningDark: '#D97706',
    
    // Danger
    danger: '#EF4444',
    dangerLight: '#FCA5A5',
    dangerDark: '#B91C1C',
    
    // Backgrounds
    bgDark: '#0F172A',
    bgDarker: '#020617',
    bgLight: '#FFFFFF',
    bgLighter: '#F8FAFC',
    
    // Text
    textDark: '#1E293B',
    textLight: '#F1F5F9',
    textGray: '#64748B',
    textGrayLight: '#94A3B8',
    
    // Borders
    borderDark: '#334155',
    borderLight: '#E2E8F0',
  },

  // Typography
  typography: {
    fonts: {
      heading: "'Poppins', 'Inter', sans-serif",
      body: "'Inter', 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace"
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // Spacing System
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(79, 70, 229, 0.3)',
    glowPink: '0 0 20px rgba(236, 72, 153, 0.3)'
  },

  // Border Radius
  radius: {
    sm: '0.375rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px'
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out'
  }
};

export default designSystem;
