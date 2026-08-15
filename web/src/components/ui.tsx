import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, forwardRef, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

/* ─── Button ─── */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'

    const variants: Record<string, string> = {
      primary: 'bg-accent-primary text-accent-foreground hover:bg-accent-hover shadow-card hover:shadow-lift active:scale-[0.98]',
      secondary: 'bg-surface-1 text-text-primary border border-border-subtle hover:bg-surface-hover active:scale-[0.98]',
      outline: 'bg-transparent text-accent-primary border border-accent-primary/40 hover:bg-accent-soft active:scale-[0.98]',
      ghost: 'bg-transparent text-text-primary hover:bg-surface-hover active:scale-[0.98]',
      danger: 'bg-danger text-white hover:opacity-90 active:scale-[0.98]',
    }

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-base',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={loading || disabled}
        {...(props as any)}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>{icon}{children}</>
        )}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'

/* ─── Card ─── */
interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  elevated?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover, elevated, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`rounded-2xl bg-surface-1 border border-border-subtle p-6 ${elevated ? 'shadow-card' : ''} ${hover ? 'cursor-pointer shadow-card hover:shadow-lift' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ─── Input ─── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-surface-1 border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all ${error ? 'border-danger' : 'border-border-default'} ${className}`}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  ),
)
Input.displayName = 'Input'

/* ─── Textarea ─── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full px-4 py-2.5 bg-surface-1 border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all resize-none ${error ? 'border-danger' : 'border-border-default'} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  ),
)
Textarea.displayName = 'Textarea'

/* ─── Select ─── */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, children, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 pr-10 bg-surface-1 border border-border-default rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  ),
)
Select.displayName = 'Select'

/* ─── ProgressBar ─── */
interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

export function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className={`h-2 bg-border-subtle rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full rounded-full bg-accent-primary"
      />
    </div>
  )
}

/* ─── Modal ─── */
interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="bg-surface-1 rounded-2xl max-w-lg w-full p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-text-primary">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-text-muted hover:text-text-primary" aria-label="Close">
              ✕
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ─── Tabs ─── */
interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-surface-2 rounded-2xl overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            active === tab.id
              ? 'bg-surface-1 text-accent-primary shadow-card'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/* ─── Switch ─── */
interface SwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-accent-primary' : 'bg-border-strong'}`}
      >
        <span className={`block w-5 h-5 mt-0.5 rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  )
}

/* ─── Skeleton ─── */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg min-h-[1em] ${className}`} />
}

/* ─── Badge ─── */
interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors: Record<string, string> = {
    default: 'bg-surface-2 text-text-secondary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-danger/15 text-danger',
    info: 'bg-info/15 text-info',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  )
}

/* ─── Avatar ─── */
interface AvatarProps {
  address: string
  size?: number
}

export function Avatar({ address, size = 36 }: AvatarProps) {
  const initials = address ? `${address.slice(0, 2)}${address.slice(-2)}`.toUpperCase() : '??'
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-accent-soft text-accent-primary font-display font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </span>
  )
}

/* ─── EmptyState ─── */
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <span className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center text-accent-primary">
        <LeafGlyph size={28} />
      </span>
      <h3 className="font-display font-semibold text-lg text-text-primary">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

export function LeafGlyph({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 19c0-6.5 4-11 11-13 .7-.2 1.4.3 1.3 1C16.8 13 13.5 19 5 19Z" fill="currentColor" opacity="0.9" />
      <path d="M16 6c-.5 3-1.5 5.5-3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
