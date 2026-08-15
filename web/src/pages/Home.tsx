import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, ProgressBar, Card } from '../components/ui'
import { LeafGlyph } from '../components/ui'
import { getApi } from '../lib/sdk'
import { useMeta } from '../lib/seo'
import { Sparkles, Users, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PoolData } from '@abbasiwa/kindlepool-sdk'

const features = [
  { icon: <Sparkles size={22} />, title: 'Fund Specific Work', desc: 'Support a particular project, not a creator. Your money goes to the work you believe in.' },
  { icon: <Users size={22} />, title: 'Community Voted', desc: 'Supporters vote on quality. Funds release only if the work meets the community standard.' },
  { icon: <ShieldCheck size={22} />, title: 'Automated Refunds', desc: "If the goal isn't met or work is rejected, funds automatically return to supporters." },
]

function fmt(n: string): string {
  const big = BigInt(n || '0')
  return big >= 1_000_000n ? `${(Number(big) / 1_000_000).toLocaleString()} USDC` : `${big.toLocaleString()} units`
}

function daysLeft(deadline: number): string {
  if (!deadline) return 'Ending soon'
  const days = Math.ceil((deadline * 1000 - Date.now()) / 86400000)
  return days > 0 ? `${days} days left` : 'Ending soon'
}

export function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<PoolData[]>([])
  useMeta({ description: 'Micro-sponsor pools for creators on Stellar Soroban. Fund specific work, auto-refunds if goals fail.', path: '/' })

  useEffect(() => {
    let cancelled = false
    getApi().listPools({ limit: 3, sort: 'most_funded' })
      .then((r) => { if (!cancelled) setFeatured(r.data ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-0 via-mint-50 to-surface-0 border border-border-subtle">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-soft blur-3xl opacity-60" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-leaf-200/30 blur-3xl" />
        <div className="relative px-6 sm:px-12 py-16 sm:py-24 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <LeafGlyph size={14} /> On Stellar Soroban
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary leading-[1.05] tracking-tight">
            Fund the <span className="text-accent-primary">work</span>,
            <br />
            not the creator
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl">
            Micro-sponsor pools for creators. Money pools trustlessly on Stellar, releases only if quality thresholds are met, and auto-refunds otherwise.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="xl" onClick={() => navigate('/explore')}>Explore Pools</Button>
            <Button size="xl" variant="secondary" onClick={() => navigate('/how-it-works')}>How It Works</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <Card hover className="h-full p-7 space-y-4">
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-primary">
                {f.icon}
              </span>
              <h3 className="font-display font-semibold text-lg text-text-primary">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Trending */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight">Trending Pools</h2>
            <p className="text-text-muted mt-1">Discover what creators are raising right now</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>View all →</Button>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong py-20 px-6 text-center">
            <LeafGlyph size={32} className="mx-auto mb-4 text-accent-primary" />
            <p className="text-text-muted font-medium">No pools yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map((pool, i) => (
              <motion.div key={pool.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <div onClick={() => navigate(`/pool/${pool.id}`)}>
                  <Card hover className="h-full p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-text-primary">Pool #{pool.id}</h3>
                        <p className="text-sm text-text-muted font-mono mt-0.5">{`${pool.creator.slice(0, 6)}...${pool.creator.slice(-4)}`}</p>
                      </div>
                      <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl bg-accent-soft text-accent-primary">
                        <LeafGlyph size={18} />
                      </span>
                    </div>
                    <ProgressBar value={Number(pool.total_deposited || '0')} max={Number(pool.goal || '1')} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">{fmt(pool.total_deposited)} <span className="text-border-strong">/</span> {fmt(pool.goal)}</span>
                      <span className="text-accent-primary font-medium">{pool.total_supporters} supporters</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{daysLeft(pool.deadline)}</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/pool/${pool.id}`) }}>
                        View
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
