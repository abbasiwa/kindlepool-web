import { motion } from 'framer-motion'
import { Card, Button, Badge } from './ui'
import { useWallet } from '../lib/wallet'
import { getApi } from '../lib/sdk'
import { ArbitrateModal } from './ArbitrateModal'
import { useEffect, useState } from 'react'
import { Scale, AlertTriangle, ArrowUpRight, Check, X, Clock } from 'lucide-react'

export interface DisputeData {
  id: number
  disputeId: number
  poolId: number
  poolTitle: string
  raisedBy: string
  reason: number
  reasonText: string
  evidenceHash: string
  fee: string
  status: 'open' | 'resolved_creator' | 'resolved_supporters' | 'appealed'
  createdAt: number
  resolvedAt: number | null
  appealCount: number
  votesForCreator: number
  votesAgainstCreator: number
  totalVotes: number
}

export function DisputePanel() {
  const { connected } = useWallet()
  const [disputes, setDisputes] = useState<DisputeData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDispute, setActiveDispute] = useState<number | null>(null)
  const [arbitrating, setArbitrating] = useState<DisputeData | null>(null)

  // Fetch dispute events (raised + resolved) from the indexer via the SDK.
  useEffect(() => {
    let cancelled = false
    Promise.all([
      getApi().getEvents({ type: 'p_disp', limit: 50 }).catch(() => ({ data: [] as any[] })),
      getApi().getEvents({ type: 'p_resl', limit: 50 }).catch(() => ({ data: [] as any[] })),
    ])
      .then(([raised, resolved]) => {
        if (cancelled) return
        const disputes = (raised.data ?? []).map(mapEventToDispute)
        const resolvedByPool = new Map<number, number>()
        for (const e of resolved.data ?? []) {
          const raw = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
          const payload = raw?.payload ?? raw ?? {}
          const poolId = payload.pool_id ?? 0
          resolvedByPool.set(poolId, payload.resolution ?? 0)
        }
        for (const d of disputes) {
          const resolution = resolvedByPool.get(d.poolId)
          if (resolution === 1) d.status = 'resolved_creator'
          else if (resolution === 2) d.status = 'resolved_supporters'
        }
        setDisputes(disputes)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const statusColors: Record<string, 'warning' | 'success' | 'default'> = {
    open: 'warning', resolved_creator: 'success', resolved_supporters: 'default', appealed: 'warning',
  }

  const statusLabels: Record<string, string> = {
    open: 'Open', resolved_creator: 'Creator Wins', resolved_supporters: 'Supporters Win', appealed: 'Appealed',
  }

  if (!connected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Scale className="text-warm-300" size={24} />
          <div>
            <h2 className="text-xl font-bold">Dispute Resolution</h2>
            <p className="text-sm text-muted-100">Community arbitration for contested pools</p>
          </div>
        </div>
        <Card className="text-center py-8">
          <p className="text-muted-100">Connect your wallet to view and vote on disputes.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="text-warm-300" size={24} />
        <div>
          <h2 className="text-xl font-bold">Dispute Resolution</h2>
          <p className="text-sm text-muted-100">Community arbitration for contested pools</p>
        </div>
      </div>

      {loading ? (
        <Card className="text-center py-8">
          <p className="text-muted-100">Loading disputes...</p>
        </Card>
      ) : disputes.length === 0 ? (
        <Card className="text-center py-8 space-y-3">
          <Scale size={32} className="mx-auto text-muted-100" />
          <p className="text-muted-100">No active disputes.</p>
        </Card>
      ) : (
        disputes.map((d) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }}>
            <Card className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    d.status === 'open' || d.status === 'appealed' ? 'bg-warning/20' : d.status === 'resolved_creator' ? 'bg-success/20' : 'bg-cream-300'
                  }`}>
                    {d.status === 'open' || d.status === 'appealed' ? <Clock className="text-warning" size={20} /> :
                     d.status === 'resolved_creator' ? <Check className="text-success" size={20} /> :
                     <X className="text-muted-200" size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold">{d.poolTitle}</h4>
                    <p className="text-xs text-muted-100">Dispute #{d.id} · Raised by {d.raisedBy}</p>
                  </div>
                </div>
                <Badge variant={statusColors[d.status]}>{statusLabels[d.status]}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm bg-cream-200 rounded-xl px-4 py-2">
                <AlertTriangle size={14} className="text-warm-300 shrink-0" />
                <span>{d.reasonText}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-100">Arbitrator Votes</span>
                  <span className="font-medium">{d.totalVotes} total</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-success font-medium w-20">For Creator: {d.votesForCreator}</span>
                  <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{
                      width: `${d.totalVotes > 0 ? (d.votesForCreator / d.totalVotes) * 100 : 50}%`
                    }} />
                  </div>
                  <span className="text-xs text-error font-medium w-24 text-right">For Supporters: {d.votesAgainstCreator}</span>
                </div>
              </div>

              {(d.status === 'open' || d.status === 'appealed') && (
                <Button size="sm" variant="secondary" onClick={() => setArbitrating(d)}>
                  <ArrowUpRight size={14} /> Vote as Arbitrator
                </Button>
              )}

              <button
                onClick={() => setActiveDispute(activeDispute === d.id ? null : d.id)}
                className="text-xs text-muted-100 hover:text-text-light transition-colors"
              >
                {activeDispute === d.id ? 'Show less' : 'Show details'}
              </button>

              {activeDispute === d.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 text-xs text-muted-100 bg-cream-200 rounded-xl p-3 overflow-hidden"
                >
                  <div className="flex justify-between"><span>Evidence Hash</span><span className="font-mono">{d.evidenceHash}</span></div>
                  <div className="flex justify-between"><span>Fee Collected</span><span>{d.fee} USDC</span></div>
                  <div className="flex justify-between"><span>Appeals</span><span>{d.appealCount}/2</span></div>
                  <div className="flex justify-between"><span>Created</span><span>{new Date(d.createdAt).toLocaleDateString()}</span></div>
                  {d.resolvedAt && <div className="flex justify-between"><span>Resolved</span><span>{new Date(d.resolvedAt).toLocaleDateString()}</span></div>}
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))
      )}

      {arbitrating && (
        <ArbitrateModal
          open
          onClose={() => setArbitrating(null)}
          poolId={arbitrating.poolId}
          disputeId={arbitrating.disputeId}
          poolTitle={arbitrating.poolTitle}
          onVoteCast={() => setArbitrating(null)}
        />
      )}
    </div>
  )
}

function mapEventToDispute(event: any): DisputeData {
  // Indexer stores event rows as { topics:[type], payload } — fields live in payload.
  const raw = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
  const data = raw?.payload ?? raw ?? {}
  return {
    id: event.id ?? 0,
    // The on-chain dispute id (contract now emits it in p_disp). Fall back to
    // pool_id for older events (resolve_dispute needs the real id).
    disputeId: data.dispute_id ?? data.pool_id ?? 0,
    poolId: data.pool_id ?? 0,
    poolTitle: `Pool #${data.pool_id ?? 0}`,
    raisedBy: (data.raised_by ?? 'unknown').slice(0, 8) + '...',
    reason: data.reason ?? 0,
    reasonText: data.reason === 1 ? 'Work not delivered' : 'Work rejected unfairly',
    evidenceHash: data.evidence_hash ?? '',
    fee: data.fee ?? '0',
    status: 'open',
    createdAt: event.ts ?? Date.now(),
    resolvedAt: null,
    appealCount: 0,
    votesForCreator: 0,
    votesAgainstCreator: 0,
    totalVotes: 0,
  }
}
