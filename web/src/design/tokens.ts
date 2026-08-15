/**
 * KindlePool design tokens — single source of truth.
 * Mirrors the CSS custom properties in index.css (@theme).
 * Two layers: primitive (raw values) and semantic (functional usage).
 */

// ── Primitive: neutrals + electric indigo + low-saturation status ──
export const neutrals = {
  50: '#FFFFFF',
  100: '#FFFDF9',
  200: '#FAF0E6',
  300: '#F0E6D8',
  400: '#E8D5C4',
  500: '#D4C5B5',
  600: '#A89A8A',
  700: '#6B5D50',
  800: '#3A332E',
  900: '#1A1614',
}

export const indigo = {
  100: '#ECECFF',
  200: '#D4D4FF',
  300: '#A6A6FF',
  400: '#6F6FFF',
  500: '#3D3DFF', // electric
  600: '#2E2ED6',
  700: '#2323A8',
  800: '#1A1A80',
  900: '#121258',
}

export const status = {
  success: '#4FA97B',
  warning: '#D4A23A',
  error: '#C94F4F',
  info: '#3D8BBF',
}

// ── Semantic ──
export const surface = {
  0: neutrals[100], // canvas
  1: neutrals[50], // cards
  2: neutrals[200], // hover/borders
}

export const text = {
  primary: neutrals[900],
  muted: neutrals[600],
  onAccent: neutrals[50],
}

export const accent = indigo[500]

// ── Spatial scale (no arbitrary values) ──
export const space = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

// ── Type ──
export const font = {
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
}

export const weights = { body: 400, heading: 500, micro: 600 }

// ── Motion ──
export const motion = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
}
