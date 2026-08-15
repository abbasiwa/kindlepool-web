import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../lib/wallet'
import { DisputePanel } from '../components/DisputePanel'
import { ArrowLeft } from 'lucide-react'

export function Disputes() {
  const navigate = useNavigate()
  const { connected } = useWallet()

  if (!connected) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight mb-4">Disputes</h1>
        <p className="text-text-muted">Connect your wallet to view and vote on disputes.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-hover transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight">Disputes</h1>
          <p className="text-text-muted mt-1">Community arbitration for contested pools</p>
        </div>
      </div>
      <DisputePanel />
    </motion.div>
  )
}
