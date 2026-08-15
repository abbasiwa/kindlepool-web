import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, ProgressBar, Badge } from '../components/ui'
import { useState, useMemo, useEffect } from 'react'
import { getApi } from '../lib/sdk'
import { useMeta } from '../lib/seo'
import { ArrowLeft } from 'lucide-react'
import type { PoolData, SupporterData } from '@abbasiwa/kindlepool-sdk'

export function PoolDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const poolId = Number(id)
  const [pool, setPool] = useState<PoolData | null>(null)
  const [supporters, setSupporters] = useState<SupporterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useMeta({
    title: pool ? `Pool #${pool.id}` : 'Pool',
    description: pool ? `A KindlePool micro-sponsor pool: ${pool.goal} goal, ${pool.total_supporters} supporters.` : undefined,
    path: `/pool/${poolId}`,
    type: 'product',
    jsonLd: pool ? [{
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `KindlePool #${pool.id}`,
      description: `Micro-sponsor pool on Stellar Soroban with goal ${pool.goal}.`,
      offers: { '@type': 'Offer', price: pool.total_deposited, priceCurrency: 'USD' },
    }] : [],
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const api = getApi()
        const [p, supp] = await Promise.all([
          api.getPool(poolId),
          api.getPoolSupporters(poolId).catch(() => ({ data: [] as SupporterData[] })),
        ])
        if (!cancelled) {
          setPool(p)
          setSupporters(supp.data ?? [])
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? 'Failed to load pool')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [poolId])

  const goal = pool ? BigInt(pool.goal || '0') : 0n
  const raised = pool ? BigInt(pool.total_deposited || '0') : 0n

  const badgeVariant = !pool ? 'default'
    : pool.status === 'open' ? 'default'
    : pool.status === 'awaiting_vote' || pool.status === 'disputed' || pool.status === 'appealed' ? 'warning'
    : pool.status === 'paid' ? 'success'
    : 'error'

  const deadlineLabel = useMemo(() => {
    if (!pool || !pool.deadline) return 'Ending today'
    const ms = pool.deadline * 1000
    const days = Math.ceil((ms - Date.now()) / 86400000)
    return days > 0 ? `${days} days left` : 'Ending today'
  }, [pool])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-40 bg-surface-hover rounded animate-pulse" />
        <div className="h-40 bg-surface-hover rounded-2xl animate-pulse" />
        <div className="h-24 bg-surface-hover rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (error || !pool) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-display font-semibold text-text-primary tracking-tight">Pool not found</h2>
        <p className="text-text-muted mt-2">{error ?? `No pool with ID #${id} exists.`}</p>
        <button onClick={() => navigate(-1)} className="text-accent-primary mt-4 inline-block hover:text-accent-hover transition-colors">
          ← Go back
        </button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-text-primary tracking-tight">Pool #{pool.id}</h1>
            <p className="text-text-muted mt-1 font-mono text-sm">{pool.creator.slice(0, 6)}...{pool.creator.slice(-4)}</p>
          </div>
          <Badge variant={badgeVariant}>{pool.status.replace('_', ' ')}</Badge>
        </div>
      </div>

      <Card elevated className="p-7 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-display font-semibold text-text-primary">
            {raised.toLocaleString()} <span className="text-base font-normal text-text-muted">/ {goal.toLocaleString()} units</span>
          </span>
          <span className="text-sm text-text-muted">{deadlineLabel}</span>
        </div>
        <ProgressBar value={Number(raised)} max={Number(goal) || 1} />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-sm">
          <div className="rounded-xl border border-border-subtle p-3 sm:p-4"><div className="font-semibold text-success">Yes: {pool.yes_votes.toLocaleString()}</div></div>
          <div className="rounded-xl border border-border-subtle p-3 sm:p-4"><div className="font-semibold text-danger">No: {pool.no_votes.toLocaleString()}</div></div>
          <div className="rounded-xl border border-border-subtle p-3 sm:p-4"><div className="font-semibold text-text-primary">{pool.total_supporters} supporters</div></div>
        </div>
      </Card>

      {pool.work_hash && (
        <Card className="space-y-2">
          <h3 className="font-semibold">Submitted Work</h3>
          <p className="text-sm text-text-muted break-all">Hash: {pool.work_hash}</p>
          {pool.vote_deadline && (
            <p className="text-sm text-text-muted">Voting ends: {new Date(pool.vote_deadline * 1000).toLocaleDateString()}</p>
          )}
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-text-primary tracking-tight">Supporters ({supporters.length})</h2>
        {supporters.length === 0 ? (
          <p className="text-text-muted text-sm">No supporters yet.</p>
        ) : (
          <div className="space-y-2">
            {supporters.map((s) => (
              <div key={s.address} className="flex items-center justify-between py-2 px-4 bg-surface-hover rounded-xl">
                <span className="text-sm font-mono">{`${s.address.slice(0, 8)}...${s.address.slice(-4)}`}</span>
                <span className="text-sm text-text-muted">{s.amount} units</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
