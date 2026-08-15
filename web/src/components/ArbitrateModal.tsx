import { useState } from 'react'
import { Button, Input, Modal } from './ui'
import { useToast } from '../lib/toast'
import { useWallet } from '../lib/wallet'
import { contract, walletSigner } from '../lib/contract'
import { Scale, ThumbsUp, ThumbsDown, Check } from 'lucide-react'

interface ArbitrateModalProps {
  open: boolean
  onClose: () => void
  poolId: number
  disputeId: number
  poolTitle: string
  onVoteCast: () => void
}

export function ArbitrateModal({ open, onClose, poolId, disputeId, poolTitle, onVoteCast }: ArbitrateModalProps) {
  const { connected, address, signAndSubmit } = useWallet()
  const { toast } = useToast()
  const [voteForCreator, setVoteForCreator] = useState<boolean | null>(null)
  const [reasonHash, setReasonHash] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!connected || !address) { toast('Connect wallet first', 'error'); return }
    if (voteForCreator === null) { toast('Cast your vote first', 'error'); return }
    setSubmitting(true)
    try {
      const reason = reasonHash
        ? (reasonHash.startsWith('0x') ? reasonHash.slice(2) : Array.from(new TextEncoder().encode(reasonHash)).map((b) => b.toString(16).padStart(2, '0')).join('')).padEnd(64, '0').slice(0, 64)
        : '0000000000000000000000000000000000000000000000000000000000000000'
      await contract().resolveDispute(
        { pool_id: poolId, caller: address, dispute_id: disputeId, vote_for_creator: voteForCreator, reason_hash: reason },
        address,
        walletSigner(signAndSubmit),
      )
      toast(voteForCreator ? 'Voted in favor of creator' : 'Voted in favor of supporters', 'success')
      onVoteCast()
      onClose()
    } catch (err: any) {
      console.error('arbitration vote failed', err)
      toast(err?.message ?? 'Failed to cast vote', 'error')
    } finally { setSubmitting(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Arbitrate Dispute">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-2 border border-accent-primary/30">
          <Scale className="text-accent-primary shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium">Dispute #{disputeId} — {poolTitle}</p>
            <p className="text-xs text-text-muted">Review the evidence and cast your vote as an arbitrator.</p>
          </div>
        </div>

        <p className="text-sm text-text-muted font-medium">Your Verdict</p>
        <div className="flex gap-3">
          <button onClick={() => setVoteForCreator(true)}
            className={`flex-1 p-4 rounded-xl text-center transition-all ${
              voteForCreator === true ? 'bg-success/20 border-2 border-success' : 'bg-surface-2 hover:bg-surface-hover border-2 border-transparent'
            }`}>
            <ThumbsUp size={24} className={`mx-auto mb-1 ${voteForCreator === true ? 'text-success' : 'text-text-muted'}`} />
            <p className={`text-sm font-medium ${voteForCreator === true ? 'text-success' : ''}`}>For Creator</p>
            <p className="text-xs text-text-muted mt-0.5">Work meets quality standards</p>
          </button>
          <button onClick={() => setVoteForCreator(false)}
            className={`flex-1 p-4 rounded-xl text-center transition-all ${
              voteForCreator === false ? 'bg-error/20 border-2 border-error' : 'bg-surface-2 hover:bg-surface-hover border-2 border-transparent'
            }`}>
            <ThumbsDown size={24} className={`mx-auto mb-1 ${voteForCreator === false ? 'text-error' : 'text-text-muted'}`} />
            <p className={`text-sm font-medium ${voteForCreator === false ? 'text-error' : ''}`}>For Supporters</p>
            <p className="text-xs text-text-muted mt-0.5">Work fails quality standards</p>
          </button>
        </div>

        <Input label="Vote Reason (optional hash)" value={reasonHash}
          onChange={(e) => setReasonHash(e.target.value)} placeholder="IPFS hash of your rationale..." />

        <Button className="w-full" onClick={handleSubmit} loading={submitting} disabled={voteForCreator === null}>
          {submitting ? 'Casting Vote...' : <><Check size={16} /> Cast Vote</>}
        </Button>
      </div>
    </Modal>
  )
}
