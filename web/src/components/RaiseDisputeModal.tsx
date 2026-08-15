import { useState } from 'react'
import { Button, Input, Modal } from './ui'
import { useToast } from '../lib/toast'
import { useWallet } from '../lib/wallet'
import { contract, walletSigner } from '../lib/contract'
import { AlertTriangle, Send } from 'lucide-react'

interface RaiseDisputeModalProps {
  open: boolean
  onClose: () => void
  poolTitle: string
  goalAmount: string
  poolStatus: string
  poolId: number
}

export function RaiseDisputeModal({ open, onClose, poolTitle, goalAmount, poolStatus, poolId }: RaiseDisputeModalProps) {
  const { connected, address, signAndSubmit } = useWallet()
  const { toast } = useToast()
  const [reason, setReason] = useState<'rejected' | 'no_delivery'>('rejected')
  const [evidenceHash, setEvidenceHash] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Contract formula: dispute_fee = goal * 100 / 10000 (no floor — audit #22)
  const feeAmount = Math.floor(Number(goalAmount) * 100 / 10000)
  const appealFee = feeAmount * 2

  const handleSubmit = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    if (!evidenceHash) { toast('Enter evidence hash', 'error'); return }
    if (poolStatus === 'disputed' || poolStatus === 'appealed') {
      toast('This pool already has an active dispute.', 'error')
      return
    }
    setSubmitting(true)
    try {
      const reasonCode = reason === 'rejected' ? 0 : 1
      // 32-byte evidence hash from the IPFS-style input (utf8 → hex, pad/truncate to 64)
      const bytes = new TextEncoder().encode(evidenceHash)
      const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
      const hash32 = hex.padEnd(64, '0').slice(0, 64)
      const hash = await contract().raiseDispute(
        { pool_id: poolId, disputant: address, reason: reasonCode, evidence_hash: hash32 },
        address,
        walletSigner(signAndSubmit),
      )
      toast(`Dispute raised on "${poolTitle}" (fee: ${feeAmount} USDC) — tx ${hash.slice(0, 12)}…`, 'success')
      onClose()
    } catch (err: any) {
      console.error('raise dispute failed', err)
      toast(err?.message ?? 'Failed to raise dispute', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Raise Dispute">
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30">
          <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Disputing: {poolTitle}</p>
            <p className="text-xs text-text-muted mt-1">
              Raising a dispute requires a fee of <strong>{feeAmount} USDC</strong> (1% of pool goal). 
              If you win, the fee is returned. Appeals cost <strong>{appealFee} USDC</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Reason</label>
          <div className="flex gap-2">
            <button onClick={() => setReason('rejected')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                reason === 'rejected' ? 'bg-accent-primary text-text-inverse' : 'bg-surface-hover hover:bg-surface-hover'
              }`}>Work Rejected Unfairly</button>
            <button onClick={() => setReason('no_delivery')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                reason === 'no_delivery' ? 'bg-accent-primary text-text-inverse' : 'bg-surface-hover hover:bg-surface-hover'
              }`}>Work Not Delivered</button>
          </div>
        </div>

        <Input label="Evidence Hash (IPFS)" value={evidenceHash}
          onChange={(e) => setEvidenceHash(e.target.value)}
          placeholder="Qm..." />

        <div className="bg-surface-hover rounded-xl p-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">Dispute Fee</span><span>{feeAmount} USDC</span></div>
          <div className="flex justify-between">
            <span className="text-text-muted">Your Wallet</span>
            <span className="font-mono text-xs">{address ? `${address.slice(0, 8)}...${address.slice(-4)}` : 'Not connected'}</span>
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit} loading={submitting} disabled={!connected}>
          {!connected ? 'Connect Wallet First' : submitting ? 'Submitting...' : <><Send size={16} /> Raise Dispute</>}
        </Button>
      </div>
    </Modal>
  )
}
