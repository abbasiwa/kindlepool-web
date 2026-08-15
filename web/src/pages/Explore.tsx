import { Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, ProgressBar, Badge, Tabs, Input } from '../components/ui'
import { getApi } from '../lib/sdk'
import { useMeta } from '../lib/seo'
import { Search } from 'lucide-react'
import type { PoolData, PoolStatus } from '@abbasiwa/kindlepool-sdk'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'awaiting_vote', label: 'Voting' },
  { id: 'paid', label: 'Funded' },
]

const STATUS_FILTER: Record<string, PoolStatus | undefined> = {
  all: undefined,
  open: 'open',
  awaiting_vote: 'awaiting_vote',
  paid: 'paid',
}

function fmt(n: string): string {
  const big = BigInt(n || '0')
  return big >= 1_000_000n ? `${Number(big) / 1_000_000} USDC` : `${big} units`
}

function daysLeft(deadline: number): string {
  if (!deadline) return 'Ending soon'
  const days = Math.ceil((deadline * 1000 - Date.now()) / 86400000)
  return days > 0 ? `${days} days left` : 'Ending soon'
}

export function Explore() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [pools, setPools] = useState<PoolData[]>([])
  const [loading, setLoading] = useState(true)
  useMeta({ title: 'Explore Pools', description: 'Browse and fund micro-sponsor pools for creators on Stellar.', path: '/explore' })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getApi().listPools({ limit: 50 })
      .then((r) => { if (!cancelled) setPools(r.data ?? []) })
      .catch(() => { if (!cancelled) setPools([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const status = STATUS_FILTER[activeTab]
    const q = search.toLowerCase()
    return pools
      .filter((p) => !status || p.status === status)
      .filter((p) => q === '' || `pool #${p.id}`.includes(q) || p.creator.toLowerCase().includes(q))
  }, [pools, activeTab, search])

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-text-primary tracking-tight">Explore Pools</h1>
        <p className="text-text-muted -mt-3">Browse and fund micro-sponsor pools for creators</p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pools..."
              className="pl-10"
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border-subtle p-6 space-y-4">
              <div className="h-4 bg-surface-hover rounded w-1/2" />
              <div className="h-3 bg-surface-hover rounded w-1/3" />
              <div className="h-2 bg-surface-hover rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong py-20 px-6 text-center">
          <p className="text-text-muted font-medium">No pools found.</p>
          <Link to="/create" className="text-accent-primary mt-2 inline-block hover:text-accent-hover transition-colors">
            Create one →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pool, i) => {
            const badgeVariant = pool.status === 'open' ? 'default' : pool.status === 'awaiting_vote' ? 'warning' : 'success'
            return (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link to={`/pool/${pool.id}`}>
                  <Card hover className="h-full p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-text-primary">Pool #{pool.id}</h3>
                        <p className="text-sm text-text-muted font-mono mt-0.5">{`${pool.creator.slice(0, 6)}...${pool.creator.slice(-4)}`}</p>
                      </div>
                      <Badge variant={badgeVariant}>{pool.status.replace('_', ' ')}</Badge>
                    </div>
                    <ProgressBar value={Number(pool.total_deposited || '0')} max={Number(pool.goal || '1')} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">{fmt(pool.total_deposited)} <span className="text-border-strong">/</span> {fmt(pool.goal)}</span>
                      <span className="text-accent-primary font-medium">{pool.total_supporters} supporters</span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {daysLeft(pool.deadline)}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
