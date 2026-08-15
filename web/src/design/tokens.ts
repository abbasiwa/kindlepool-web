/**
 * KindlePool design tokens — single source of truth.
 * Mirrors the CSS custom properties in index.css (@theme).
 *
 * Brand: "Leaf" — green accent on a soft mint canvas (#F0FAF7).
 * Two layers: primitive (raw values) and semantic (functional usage).
 */

// ── Primitive: mint canvas + leaf greens + warm-ink neutrals ──
export const mint = {
  0: '#F0FAF7', // brand canvas
  50: '#F7FCFA',
  100: '#EAF6F1',
  200: '#D9EEE5',
}

export const leaf = {
  50: '#EDF9F1',
  100: '#D6F0DE',
  200: '#ABE0BD',
  300: '#79CC98',
  400: '#49B374',
  500: '#2C9E5F',
  600: '#1F8A50', // brand normal green
  700: '#1A7044', // brand dark green
  800: '#155738',
  900: '#0F4029',
  950: '#092B1C',
}

export const ink = {
  0: '#FFFFFF',
  50: '#FBFCFC',
  100: '#F3F5F4',
  200: '#E6EAE8',
  300: '#D2D8D5',
  400: '#A8B2AE',
  500: '#7E8A85',
  600: '#5C6863',
  700: '#3F4A45',
  800: '#28322E',
  900: '#17201C',
  950: '#0C120F',
}

export const status = {
  success: '#2C9E5F',
  warning: '#D99A2B',
  danger: '#D5484A',
  info: '#3B82A0',
}

// ── Semantic ──
export const surface = {
  canvas: mint[0], // #F0FAF7 brand background
  card: ink[0], // white cards
  raised: mint[50],
  hover: mint[100],
  overlay: 'rgba(12, 18, 15, 0.45)',
}

export const text = {
  primary: ink[900],
  secondary: ink[700],
  muted: ink[500],
  inverse: ink[0],
  onAccent: ink[0],
}

export const accent = {
  DEFAULT: leaf[600], // normal green
  hover: leaf[700], // dark green
  soft: leaf[100],
  foreground: ink[0],
}

export const border = {
  subtle: ink[200],
  default: ink[300],
  strong: ink[400],
}

// ── Spatial scale (4px base) ──
export const space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 128]

// ── Type: modern — Inter body + Space Grotesk display ──
export const font = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  display: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
}

export const weights = { regular: 400, medium: 500, semibold: 600, bold: 700 }

// ── Motion ──
export const motion = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
}
