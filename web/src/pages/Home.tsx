import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Button, ProgressBar } from '../components/ui'
import { getApi } from '../lib/sdk'
import { useMeta } from '../lib/seo'
import { useEffect, useRef, useState } from 'react'
import type { PoolData } from '@abbasiwa/kindlepool-sdk'

const DISCIPLINES = ['ART', 'MUSIC', 'WRITING', 'FILM', 'CODE', 'RESEARCH', 'COMICS', 'SCIENCE', 'DESIGN', 'GAMES']

const MECHANISM = [
  { n: '01', title: 'The problem', body: 'The internet pays for attention, not the work. Creators chase algorithms while the actual craft goes unfunded and unsupported.' },
  { n: '02', title: 'The pool', body: 'A creator posts one specific deliverable with a goal and a deadline. Supporters back the work itself — not a vague promise, not a persona.' },
  { n: '03', title: 'The vote', body: 'When the work ships, supporters judge it. Approval releases the funds; rejection sends them back. Quality is decided by the people who paid.' },
  { n: '04', title: 'The settlement', body: 'Funds live in escrow on Stellar until the outcome is clear. Creator paid, or supporters refunded — automatically, with no middleman in the way.' },
]

function fmt(n: string): string {
  const big = BigInt(n || '0')
  return big >= 1_000_000n ? `${(Number(big) / 1_000_000).toLocaleString()} USDC` : `${big.toLocaleString()} units`
}

function daysLeft(deadline: number): string {
  if (!deadline) return 'Ending soon'
  const days = Math.ceil((deadline * 1000 - Date.now()) / 86400000)
  return days > 0 ? `${days} days left` : 'Ending today'
}

function useCounter(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration])
  return { ref, val }
}

function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const { ref, val } = useCounter(value)
  const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()
  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

export function Home() {
  const navigate = useNavigate()
  const [pools, setPools] = useState<PoolData[]>([])
  const [poolsLoaded, setPoolsLoaded] = useState(false)
  useMeta({
    title: 'KindlePool',
    description: 'Fund the work, not the creator. Trustless micro-sponsor pools on Stellar — escrow, community votes, and automatic refunds.',
    path: '/home',
  })

  useEffect(() => {
    let cancelled = false
    getApi()
      .listPools({ limit: 6, sort: 'most_funded' })
      .then((r) => { if (!cancelled) setPools(r.data ?? []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setPoolsLoaded(true) })
    return () => { cancelled = true }
  }, [])

  const totalSupporters = pools.reduce((acc, p) => acc + (Number(p.total_supporters) || 0), 0)
  const raisedTotal = pools.reduce((acc, p) => acc + Number(BigInt(p.total_deposited || '0')), 0)

  const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── 1. HERO — full-bleed dark editorial split ── */}
      <section className="relative band-dark w-screen left-1/2 -translate-x-1/2 -mt-5 md:-mt-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start lg:items-center min-h-[100svh]">
          <div className="grid lg:grid-cols-12 gap-10 w-full pt-28 pb-16 sm:py-24 lg:py-28">
            <div className="lg:col-span-7 space-y-10">
            <h1 className="display-hero font-display font-bold">
              <motion.span className="block" variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6, delay: 0.05 }}>
                Fund the work,
              </motion.span>
              <motion.span className="block" variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6, delay: 0.15 }}>
                <span className="font-serif-italic font-normal text-leaf-400">not the creator.</span>
              </motion.span>
            </h1>
            <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6, delay: 0.25 }} className="max-w-xl text-lg sm:text-xl leading-relaxed text-ink-200">
              Micro-sponsor pools for specific work. Money sits in escrow on-chain, releases only when the community approves, and refunds itself when it fails.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6, delay: 0.35 }} className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" onClick={() => navigate('/explore')}>Explore the pools</Button>
              <Button size="xl" variant="ghost" className="!text-white hover:bg-white/10" onClick={() => navigate('/how-it-works')}>Read the mechanism →</Button>
            </motion.div>
          </div>

          {/* Ledger panel — desktop only */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="kicker kicker-light">ON-CHAIN LEDGER</span>
                <span className="flex items-center gap-2 text-[11px] font-mono text-leaf-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse" /> LIVE
                </span>
              </div>

              {!poolsLoaded ? (
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                </div>
              ) : pools.length === 0 ? (
                <div className="py-6 text-center space-y-2">
                  <p className="font-serif-italic text-2xl text-ink-100">An empty ledger — for now.</p>
                  <p className="text-sm text-ink-300">The first pools are being funded. Watch this space.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pools.slice(0, 3).map((p) => (
                    <button key={p.id} onClick={() => navigate(`/pool/${p.id}`)} className="w-full text-left rounded-xl border border-white/10 p-4 hover:border-leaf-400/50 hover:bg-white/[0.06] transition-colors space-y-2 group">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-ink-100">POOL #{p.id}</span>
                        <span className="text-xs font-mono text-leaf-400">{p.total_supporters} backers</span>
                      </div>
                      <ProgressBar value={Number(p.total_deposited || '0')} max={Number(p.goal || '1')} className="!bg-white/10 [&>div]:!bg-leaf-400" />
                      <div className="flex items-center justify-between text-xs font-mono text-ink-300">
                        <span>{fmt(p.total_deposited)} / {fmt(p.goal)}</span>
                        <span className="group-hover:text-leaf-400 transition-colors">{daysLeft(p.deadline)} →</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE — disciplines ticker ── */}
      <div className="hairline-t hairline-b py-5 overflow-hidden">
        <div className="marquee-track gap-16 pr-16">
          {[...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <span key={i} className="font-display text-lg font-medium text-text-secondary whitespace-nowrap tracking-wide">
              {d} <span className="text-accent-primary mx-3">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. MANIFESTO statement ── */}
      <section className="max-w-5xl mx-auto px-6 space-y-10">
        <p className="kicker">THE THESIS</p>
        <motion.h2
          className="display-xl font-display font-semibold"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Support is loud, but <span className="font-serif-italic font-normal text-accent-primary">sustenance is quiet.</span>{' '}
          Every week a creator ships work that was never funded, while platforms monetise the attention around it.
        </motion.h2>
        <motion.p
          className="max-w-2xl text-lg text-text-secondary leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          KindlePool returns the money to the work itself. A pool is not a subscription to a persona — it is a contract for a deliverable, secured on-chain, with an escape hatch that refunds supporters the moment the deal breaks.
        </motion.p>
      </section>

      {/* ── 4. THE MECHANISM — numbered index, alternating bands ── */}
      <section className="space-y-0">
        <div className="max-w-6xl mx-auto px-6 pb-10">
          <p className="kicker">THE MECHANISM</p>
        </div>
        {MECHANISM.map((step, i) => {
          const dark = i % 2 === 1
          return (
            <motion.div
              key={step.n}
              className={dark ? 'band-deep' : 'bg-surface-1'}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <div className={`max-w-6xl mx-auto px-6 py-12 sm:py-16 grid md:grid-cols-12 gap-6 items-center ${dark ? 'hairline-b hairline-light' : 'hairline-b'}`}>
                <div className="md:col-span-2">
                  <span className={`index-num text-5xl sm:text-6xl ${dark ? 'text-leaf-400' : ''}`}>{step.n}</span>
                </div>
                <div className="md:col-span-3">
                  <h3 className={`display-lg font-display font-semibold ${dark ? 'text-ink-50' : 'text-text-primary'}`}>{step.title}</h3>
                </div>
                <div className="md:col-span-7">
                  <p className={`text-base sm:text-lg leading-relaxed ${dark ? 'text-ink-200' : 'text-text-secondary'}`}>{step.body}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </section>

      {/* ── 5. TRUST — split screen ── */}
      <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="kicker">WHY IT HOLDS</p>
          <h2 className="display-lg font-display font-semibold">
            Escrow you can read, <span className="font-serif-italic font-normal text-accent-primary">not trust you must extend.</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Funds never sit in a platform wallet. They rest in a smart contract on Stellar until an outcome is decided — paid out on approval, or returned automatically on failure. There is no invoice to chase and no support ticket for a refund.
          </p>
          <div className="space-y-3 pt-2">
            {[
              ['AUTOMATED REFUNDS', 'Unmet goals and rejected work refund supporters without a single message to support.'],
              ['COMMUNITY VOTING', 'Only the people who funded a pool decide whether the work cleared the bar.'],
              ['CREATOR LIMITS', 'A creator cannot approve their own work — no self-dealing, ever.'],
            ].map(([label, body]) => (
              <div key={label} className="hairline-t pt-4 flex gap-4">
                <span className="font-mono text-xs text-accent-primary shrink-0 pt-1">{label}</span>
                <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="rounded-3xl band-dark p-8 sm:p-12 space-y-8"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-serif-italic text-2xl sm:text-3xl leading-snug text-ink-50">
            “The pool either pays the creator or pays the people back. There is no third outcome.”
          </p>
          <div className="hairline-t hairline-light pt-5 flex items-center justify-between">
            <span className="font-mono text-xs text-ink-300">KINDPOOL — FUNDING MODEL</span>
            <span className="font-mono text-xs text-leaf-400">0.5% ON SUCCESS ONLY</span>
          </div>
        </motion.div>
      </section>

      {/* ── 6. LIVE PROOF — editorial table ── */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">LIVE PROOF</p>
            <h2 className="display-lg font-display font-semibold mt-3">Pools on the floor</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>See all →</Button>
        </div>

        {!poolsLoaded ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="hairline-b py-6 flex gap-6">
                <div className="h-4 w-20 bg-surface-hover rounded animate-pulse" />
                <div className="h-4 flex-1 bg-surface-hover rounded animate-pulse" />
                <div className="h-4 w-24 bg-surface-hover rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : pools.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border-strong py-16 px-6 text-center space-y-3">
            <p className="font-serif-italic text-3xl text-text-primary">No pools yet.</p>
            <p className="text-text-muted">The first deliverables are being scoped. Be the first to back specific work.</p>
          </div>
        ) : (
          <div>
            {pools.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => navigate(`/pool/${p.id}`)}
                className="w-full text-left group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="hairline-t py-6 grid grid-cols-12 gap-4 items-center hover:bg-surface-2/60 px-3 -mx-3 rounded-xl transition-colors">
                  <div className="col-span-12 sm:col-span-5 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-text-muted">#{String(p.id).padStart(3, '0')}</span>
                      <span className="font-display font-semibold text-text-primary text-lg">Pool {p.id}</span>
                    </div>
                    <p className="font-mono text-xs text-text-muted">{p.creator.slice(0, 6)}…{p.creator.slice(-4)}</p>
                  </div>
                  <div className="col-span-12 sm:col-span-4 space-y-2">
                    <ProgressBar value={Number(p.total_deposited || '0')} max={Number(p.goal || '1')} />
                    <div className="text-xs font-mono text-text-muted">{fmt(p.total_deposited)} / {fmt(p.goal)}</div>
                  </div>
                  <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-sm text-text-secondary">{p.total_supporters} backers</span>
                    <span className="text-xs font-mono text-text-muted group-hover:text-accent-primary transition-colors">{daysLeft(p.deadline)} →</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* ── 7. FACTS — animated counters ── */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 hairline-t pt-12">
        {[
          { value: pools.length, suffix: '', label: 'Pools on the floor' },
          { value: totalSupporters, suffix: '', label: 'Supporters backing work' },
          { value: raisedTotal, suffix: '', label: 'Units escrowed on-chain' },
          { value: 0.5, decimals: 1, suffix: '%', label: 'Platform fee — success only' },
        ].map((f) => (
          <div key={f.label} className="space-y-2">
            <div className="display-xl font-display font-semibold text-text-primary tabular-nums">
              <Counter value={f.value} decimals={f.decimals ?? 0} suffix={f.suffix} />
            </div>
            <p className="kicker !tracking-wide">{f.label}</p>
          </div>
        ))}
      </section>

      {/* ── 8. CLOSING CTA ── */}
      <section className="relative overflow-hidden rounded-3xl band-deep">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative px-6 py-20 sm:py-28 text-center space-y-8 max-w-3xl mx-auto">
          <p className="kicker kicker-light">THE OPEN INVITATION</p>
          <h2 className="display-xl font-display font-bold text-ink-50">
            Start funding <span className="font-serif-italic font-normal text-leaf-400">the work.</span>
          </h2>
          <p className="text-ink-200 max-w-xl mx-auto leading-relaxed">
            Back a specific deliverable, or raise a pool for your own. Either way, the money behaves like it should — escrowed, voted on, and refundable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="xl" onClick={() => navigate('/explore')}>Explore the pools</Button>
            <Button size="xl" variant="outline" className="!text-ink-50 !border-ink-50/40 hover:!bg-white/10" onClick={() => navigate('/how-it-works')}>How it works</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
