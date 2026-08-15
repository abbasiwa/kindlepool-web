import { useState } from 'react'
import { useMeta } from '../lib/seo'
import { Card } from '../components/ui'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'What is KindlePool?', a: 'A creator-funding platform where supporters fund specific work through micro-sponsor pools on Stellar Soroban.' },
  { q: 'What happens if a goal is not met?', a: 'Supporters are refunded automatically — funds never sit with a middleman.' },
  { q: 'Who decides if work is good enough?', a: 'Supporters vote. If the community approves, the creator is paid; if rejected, supporters are refunded.' },
  { q: 'Does it cost anything to use?', a: 'A small platform fee applies on successful payouts. Refunds are free.' },
  { q: 'Is this real money?', a: 'The beta runs on Stellar testnet — no real funds. Launch on mainnet will use real USDC.' },
  { q: 'Do I need a crypto wallet?', a: 'No. Sign in with your email. You can optionally link a Stellar wallet in Settings to view your pool activity.' },
  { q: 'Can I dispute a decision?', a: 'Disputed pools are resolved by community arbitrators.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  useMeta({ title: 'FAQ', description: 'Frequently asked questions about KindlePool, micro-sponsor pools, refunds, and disputes.', path: '/faq' })
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight text-text-primary">Frequently Asked Questions</h1>
        <p className="text-text-muted mt-2">Everything you need to know about funding and creating pools.</p>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <Card key={i} className="!p-0 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left"
            >
              <span className="font-medium text-text-primary">{f.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-text-muted leading-relaxed">{f.a}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}
