export function LeafMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--color-mint-100, #EAF6F1)" />
      <path d="M16 46c0-14 8-26 24-30 1.2-.3 2.4.6 2.2 1.9C40.5 28 34 42 18 46 15.8 46.6 14.4 44.4 16 46Z" fill="var(--color-leaf-600, #1F8A50)" />
      <path d="M40 16c-1 8-3 14-7 19" stroke="var(--color-leaf-700, #1A7044)" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 46c5-5 10-9 16-12" stroke="var(--color-leaf-400, #49B374)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ size = 28, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <LeafMark size={size} />
      {showWordmark && (
        <span className="font-display font-semibold text-[1.25rem] tracking-tight text-text-primary">
          Kindle<span className="text-accent-primary">Pool</span>
        </span>
      )}
    </span>
  )
}
