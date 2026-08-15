import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, Tabs, ProgressBar, Badge, Button } from '../components/ui'
import { useAuth } from '../lib/auth'
import { getApi } from '../lib/sdk'
import { useNavigate } from 'react-router-dom'
import type { PoolData } from '@abbasiwa/kindlepool-sdk'

const tabs = [
  { id: 'created', label: 'Created' },
  { id: 'funded', label: 'Funded' },
  { id: 'history', label: 'History' },
]

function fmt(n: string): string {
  const big = BigInt(n || '0')
  return big >= 1_000_000n ? `${Number(big) / 1_000_000} USDC` : `${big} units`
}

function badgeOf(status: string): 'default' | 'warning' | 'success' | 'error' {
  if (status === 'open') return 'default'
  if (status === 'paid') return 'success'
  if (status === 'expired' || status === 'cancelled') return 'error'
  return 'warning'
}

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('created')
  const [created, setCreated] = useState<PoolData[]>([])
  const [funded, setFunded] = useState<PoolData[]>([])
  const [loading, setLoading] = useState(true)

  const wallet = user?.walletAddress ?? user?.linkedWallets?.[0] ?? null

  useEffect(() => {
    if (!wallet) return
    let cancelled = false
    setLoading(true)
    Promise.all([
      getApi().getPoolsByCreator(wallet).catch(() => ({ data: [] as PoolData[] })),
      getApi().getPoolsBySupporter(wallet).catch(() => ({ data: [] as PoolData[] })),
    ])
      .then(([c, f]) => {
        if (cancelled) return
        setCreated(c.data ?? [])
        setFunded(f.data ?? [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [wallet])

  const history = created.filter((p) => p.status === 'paid' || p.status === 'expired' || p.status === 'cancelled')

  if (!wallet) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-text-muted">
          Link a Stellar wallet in Settings to see the pools you've created and funded.
        </p>
        <Button onClick={() => navigate('/settings')}>Go to Settings</Button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="text-center !p-4">
          <div className="text-2xl font-display font-semibold text-text-primary tracking-tight text-accent-primary">{created.length}</div>
          <div className="text-sm text-text-muted">Created</div>
        </Card>
        <Card className="text-center !p-4">
          <div className="text-2xl font-display font-semibold text-text-primary tracking-tight text-accent-primary">{funded.length}</div>
          <div className="text-sm text-text-muted">Funded</div>
        </Card>
        <Card className="text-center !p-4">
          <div className="text-2xl font-display font-semibold text-text-primary tracking-tight text-accent-primary">—</div>
          <div className="text-sm text-text-muted">Success Rate</div>
        </Card>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <p className="text-center text-text-muted py-8">Loading…</p>
      ) : activeTab === 'created' ? (
        <div className="space-y-4">
          {created.length === 0 ? (
            <p className="text-center text-text-muted py-8">No pools created yet.</p>
          ) : (
            created.map((pool) => (
              <Link key={pool.id} to={`/pool/${pool.id}`}>
                <Card hover className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">Pool #{pool.id}</h3>
                      <p className="text-sm text-text-muted">{pool.total_supporters} supporters</p>
                    </div>
                    <Badge variant={badgeOf(pool.status)}>{pool.status.replace('_', ' ')}</Badge>
                  </div>
                  <ProgressBar value={Number(pool.total_deposited || '0')} max={Number(pool.goal || '1')} />
                  <div className="text-sm text-text-muted">{fmt(pool.total_deposited)} / {fmt(pool.goal)}</div>
                </Card>
              </Link>
            ))
          )}
        </div>
      ) : activeTab === 'funded' ? (
        <div className="space-y-4">
          {funded.length === 0 ? (
            <p className="text-center text-text-muted py-8">No pools funded yet.</p>
          ) : (
            funded.map((pool) => (
              <Link key={pool.id} to={`/pool/${pool.id}`}>
                <Card hover className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">Pool #{pool.id}</h3>
                      <p className="text-sm text-text-muted font-mono">{`${pool.creator.slice(0, 8)}...`}</p>
                    </div>
                    <Badge variant={badgeOf(pool.status)}>{pool.status.replace('_', ' ')}</Badge>
                  </div>
                  <ProgressBar value={Number(pool.total_deposited || '0')} max={Number(pool.goal || '1')} />
                  <div className="text-sm text-text-muted">Raised: {fmt(pool.total_deposited)}</div>
                </Card>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center text-text-muted py-8">No completed pools yet.</p>
          ) : (
            history.map((pool) => (
              <Link key={pool.id} to={`/pool/${pool.id}`}>
                <Card hover className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">Pool #{pool.id}</h3>
                      <p className="text-sm text-text-muted font-mono">{`${pool.creator.slice(0, 8)}...`}</p>
                    </div>
                    <Badge variant={badgeOf(pool.status)}>{pool.status.replace('_', ' ')}</Badge>
                  </div>
                  <div className="text-sm text-text-muted">{fmt(pool.total_deposited)} · {pool.total_supporters} supporters</div>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </motion.div>
  )
}
