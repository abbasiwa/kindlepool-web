import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Button, ProgressBar, Badge, Modal, Input } from '../components/ui'
import { useWallet } from '../lib/wallet'
import { useToast } from '../lib/toast'
import { useState, useMemo, useEffect } from 'react'
import { getApi } from '../lib/sdk'
import { contract, walletSigner } from '../lib/contract'
import { useMeta } from '../lib/seo'
import { useAuth } from '../lib/auth'
import { LoginPrompt } from '../components/LoginPrompt'
import { RaiseDisputeModal } from '../components/RaiseDisputeModal'
import { ArrowLeft, Check, X, Upload, AlertTriangle } from 'lucide-react'
import type { PoolData, SupporterData } from '@mikwansa/kindlepool-sdk'

const WORK_HASH = '2222222222222222222222222222222222222222222222222222222222222222'

export function PoolDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { connected, address, signAndSubmit } = useWallet()
  const { user } = useAuth()
  const { toast } = useToast()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

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

  const [showDeposit, setShowDeposit] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [showVote, setShowVote] = useState(false)
  const [showSubmitWork, setShowSubmitWork] = useState(false)
  const [showDispute, setShowDispute] = useState(false)
  const [showFinalize, setShowFinalize] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
  const remaining = goal - raised
  const isCreator = !!address && pool?.creator === address

  const badgeVariant = !pool ? 'default'
    : pool.status === 'open' ? 'default'
    : pool.status === 'awaiting_vote' || pool.status === 'disputed' || pool.status === 'appealed' ? 'warning'
    : pool.status === 'paid' ? 'success'
    : 'error'

  const handleDeposit = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    const amt = Number(depositAmount)
    if (!amt || amt <= 0) { toast('Enter a valid amount', 'error'); return }
    if (BigInt(amt * 1_000_000) > remaining) { toast('Amount exceeds remaining goal', 'error'); return }
    setSubmitting(true)
    try {
      const hash = await contract().deposit(
        { pool_id: poolId, supporter: address, amount: BigInt(amt * 1_000_000) },
        address,
        walletSigner(signAndSubmit),
      )
      toast(`Deposited ${depositAmount} USDC — tx ${hash.slice(0, 12)}…`, 'success')
      setShowDeposit(false)
      setDepositAmount('')
      // refresh
      const p = await getApi().getPool(poolId)
      setPool(p)
    } catch (err: any) {
      console.error('deposit failed', err)
      toast(err?.message ?? 'Deposit failed', 'error')
    } finally { setSubmitting(false) }
  }

  const handleVote = async (approve: boolean) => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    setSubmitting(true)
    try {
      const hash = await contract().vote(
        { pool_id: poolId, voter: address, approve },
        address,
        walletSigner(signAndSubmit),
      )
      toast(`${approve ? 'Approved' : 'Rejected'} — tx ${hash.slice(0, 12)}…`, 'success')
      setShowVote(false)
    } catch (err: any) {
      console.error('vote failed', err)
      toast(err?.message ?? 'Vote failed', 'error')
    } finally { setSubmitting(false) }
  }

  const handleSubmitWork = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    setSubmitting(true)
    try {
      const hash = await contract().submitWork(poolId, WORK_HASH, address, walletSigner(signAndSubmit))
      toast(`Work submitted — tx ${hash.slice(0, 12)}…`, 'success')
      setShowSubmitWork(false)
    } catch (err: any) {
      console.error('submit work failed', err)
      toast(err?.message ?? 'Failed to submit work', 'error')
    } finally { setSubmitting(false) }
  }

  const handleFinalize = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    setSubmitting(true)
    try {
      const hash = await contract().finalize(poolId, address, walletSigner(signAndSubmit))
      toast(`Finalized — tx ${hash.slice(0, 12)}…`, 'success')
      setShowFinalize(false)
    } catch (err: any) {
      console.error('finalize failed', err)
      toast(err?.message ?? 'Finalize failed', 'error')
    } finally { setSubmitting(false) }
  }

  const handleCancel = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    if (!confirm('Cancel this pool and refund all supporters?')) return
    setSubmitting(true)
    try {
      const hash = await contract().cancelPool(address, poolId, address, walletSigner(signAndSubmit))
      toast(`Pool cancelled — tx ${hash.slice(0, 12)}…`, 'success')
    } catch (err: any) {
      console.error('cancel failed', err)
      toast(err?.message ?? 'Cancel failed', 'error')
    } finally { setSubmitting(false) }
  }

  const handleClaimRefund = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    setSubmitting(true)
    try {
      const hash = await contract().claimRefund(address, poolId, address, walletSigner(signAndSubmit))
      toast(`Refund claimed — tx ${hash.slice(0, 12)}…`, 'success')
    } catch (err: any) {
      console.error('claim refund failed', err)
      toast(err?.message ?? 'Claim refund failed', 'error')
    } finally { setSubmitting(false) }
  }

  const deadlineLabel = useMemo(() => {
    if (!pool || !pool.deadline) return 'Ending today'
    const ms = pool.deadline * 1000
    const days = Math.ceil((ms - Date.now()) / 86400000)
    return days > 0 ? `${days} days left` : 'Ending today'
  }, [pool])

  if (loading) {
    return <div className="text-center py-16"><p className="text-muted-100">Loading pool…</p></div>
  }

  if (error || !pool) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Pool not found</h2>
        <p className="text-muted-100 mt-2">{error ?? `No pool with ID #${id} exists.`}</p>
        <button onClick={() => navigate(-1)} className="text-warm-300 mt-4 inline-block hover:text-warm-400 transition-colors">
          ← Go back
        </button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-100 hover:text-text-light transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pool #{pool.id}</h1>
            <p className="text-muted-100 mt-1">{pool.creator} · {pool.contract_id ? 'KindlePool' : ''}</p>
          </div>
          <Badge variant={badgeVariant}>{pool.status.replace('_', ' ')}</Badge>
        </div>
        {isCreator && <p className="text-sm text-warm-300">You are the creator of this pool.</p>}
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {raised.toString()} <span className="text-base font-normal text-muted-100">/ {goal.toString()} units</span>
          </span>
          <span className="text-sm text-muted-100">{deadlineLabel}</span>
        </div>
        <ProgressBar value={Number(raised)} max={Number(goal) || 1} />
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-cream-200 rounded-xl p-3"><div className="font-bold text-green-700">Yes: {pool.yes_votes}</div></div>
          <div className="bg-cream-200 rounded-xl p-3"><div className="font-bold text-red-700">No: {pool.no_votes}</div></div>
          <div className="bg-cream-200 rounded-xl p-3"><div className="font-bold">{pool.total_supporters} supporters</div></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {pool.status === 'open' && (
            <Button className="flex-1" size="lg" onClick={() => connected ? (user ? setShowDeposit(true) : setShowLoginPrompt(true)) : toast('Connect wallet first', 'error')}>
              Fund This Pool
            </Button>
          )}
          {pool.status === 'awaiting_vote' && (
            <Button className="flex-1" size="lg" onClick={() => connected ? setShowVote(true) : toast('Connect wallet first', 'error')}>
              Vote on Work
            </Button>
          )}
          {(pool.status === 'awaiting_vote' || pool.status === 'open') && (
            <Button variant="secondary" className="flex-1" size="lg" onClick={() => connected ? setShowFinalize(true) : toast('Connect wallet first', 'error')}>
              Finalize
            </Button>
          )}
          {isCreator && pool.status === 'open' && (
            <Button variant="secondary" className="flex-1" size="lg" onClick={() => setShowSubmitWork(true)}>
              <Upload size={18} /> Submit Work
            </Button>
          )}
          {isCreator && pool.status === 'open' && (
            <Button variant="danger" className="flex-1" size="lg" onClick={handleCancel}>
              Cancel Pool
            </Button>
          )}
          {(pool.status === 'awaiting_vote' || pool.status === 'expired') && (
            <Button variant="secondary" className="flex-1" size="lg" onClick={() => connected ? setShowDispute(true) : toast('Connect wallet first', 'error')}>
              <AlertTriangle size={18} /> Raise Dispute
            </Button>
          )}
          {pool.status === 'expired' && (
            <Button variant="secondary" className="flex-1" size="lg" onClick={handleClaimRefund}>
              Claim Refund
            </Button>
          )}
        </div>
      </Card>

      {pool.work_hash && (
        <Card className="space-y-2">
          <h3 className="font-semibold">Submitted Work</h3>
          <p className="text-sm text-muted-100 break-all">Hash: {pool.work_hash}</p>
          {pool.vote_deadline && (
            <p className="text-sm text-muted-100">Voting ends: {new Date(pool.vote_deadline * 1000).toLocaleDateString()}</p>
          )}
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Supporters ({supporters.length})</h2>
        {supporters.length === 0 ? (
          <p className="text-muted-100 text-sm">No supporters yet.</p>
        ) : (
          <div className="space-y-2">
            {supporters.map((s) => (
              <div key={s.address} className="flex items-center justify-between py-2 px-4 bg-cream-200 rounded-xl">
                <span className="text-sm font-mono">{`${s.address.slice(0, 8)}...${s.address.slice(-4)}`}</span>
                <span className="text-sm text-muted-100">{s.amount} units</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showDeposit} onClose={() => setShowDeposit(false)} title="Fund Pool">
        <div className="space-y-4">
          <Input
            label="Amount (USDC)"
            type="number"
            min={1}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount in USDC"
          />
          <Button className="w-full" onClick={handleDeposit} loading={submitting} disabled={!depositAmount || Number(depositAmount) <= 0}>
            Deposit {depositAmount || '0'} USDC
          </Button>
        </div>
      </Modal>

      <Modal open={showVote} onClose={() => setShowVote(false)} title="Vote on Work">
        <div className="space-y-4 text-center">
          <p className="text-muted-100">Does this work meet the quality you expected?</p>
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1" onClick={() => handleVote(true)} loading={submitting}>
              <Check size={18} /> Approve
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => handleVote(false)} loading={submitting}>
              <X size={18} /> Reject
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={showFinalize} onClose={() => setShowFinalize(false)} title="Finalize Pool">
        <div className="space-y-4 text-center">
          <p className="text-muted-100">Settle this pool. Goal met + approved → creator paid. Otherwise supporters refunded.</p>
          <Button className="w-full" onClick={handleFinalize} loading={submitting}>Finalize Pool</Button>
        </div>
      </Modal>

      <RaiseDisputeModal
        open={showDispute}
        onClose={() => setShowDispute(false)}
        poolTitle={`Pool #${pool.id}`}
        goalAmount={pool.goal}
        poolStatus={pool.status}
        poolId={pool.id}
      />

      <Modal open={showSubmitWork} onClose={() => setShowSubmitWork(false)} title="Submit Work">
        <div className="space-y-4">
          <p className="text-sm text-muted-100">Submit the completed work hash for supporter review.</p>
          <Button className="w-full" onClick={handleSubmitWork} loading={submitting}>Submit for Review</Button>
        </div>
      </Modal>

      <LoginPrompt open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </motion.div>
  )
}
