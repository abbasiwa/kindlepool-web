import { motion } from 'framer-motion'
import { Card } from './ui'
import { Check, Sparkles } from 'lucide-react'

const FEATURES = [
  'Create unlimited pools',
  'Community voting & disputes',
  'Automatic refunds',
  'Basic discoverability',
]

export function PricingSection() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-semibold text-text-primary tracking-tight">Simple Pricing</h2>
        <p className="text-text-muted mt-2 max-w-lg mx-auto">
          One flat fee on successful pools. No hidden costs, no monthly subscriptions.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card elevated className="relative h-full p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-primary text-text-inverse flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Platform fee</h3>
              <p className="text-sm text-text-muted">Applied only on successful pools</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-display font-semibold text-text-primary tracking-tight">0.5%</span>
            <span className="text-sm text-text-muted">per successful pool</span>
          </div>

          <ul className="space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-success shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-text-muted leading-relaxed">
            Fees are charged in the pool currency when a pool is finalized successfully. Refunded or cancelled pools incur no fee.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
