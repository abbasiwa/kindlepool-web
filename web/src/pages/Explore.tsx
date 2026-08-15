import { Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, ProgressBar, Badge, Tabs, Input } from '../components/ui'
import { getApi } from '../lib/sdk'
import { useMeta } from '../lib/seo'
import { Search } from 'lucide-react'
import type { PoolData, PoolStatus } from '@mikwansa/kindlepool-sdk'

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
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-3xl font-bold">Explore Pools</h1>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-100" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pools..."
              className="pl-9"
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-16 text-muted-100"><p>Loading pools…</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-100">
          <p>No pools found.</p>
          <Link to="/create" className="text-warm-300 mt-2 inline-block hover:text-warm-400 transition-colors">
            Create one →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pool, i) => {
            const badgeVariant = pool.status === 'open' ? 'default' : pool.status === 'awaiting_vote' ? 'warning' : 'success'
            return (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link to={`/pool/${pool.id}`}>
                  <Card hover className="space-y-4 h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">Pool #{pool.id}</h3>
                        <p className="text-sm text-muted-100 font-mono">{`${pool.creator.slice(0, 8)}...${pool.creator.slice(-4)}`}</p>
                      </div>
                      <Badge variant={badgeVariant}>{pool.status.replace('_', ' ')}</Badge>
                    </div>
                    <ProgressBar value={Number(pool.total_deposited || '0')} max={Number(pool.goal || '1')} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-100">{fmt(pool.total_deposited)} / {fmt(pool.goal)}</span>
                      <span className="text-warm-300 font-medium">{pool.total_supporters}</span>
                    </div>
                    <div className="text-xs text-muted-100">
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
