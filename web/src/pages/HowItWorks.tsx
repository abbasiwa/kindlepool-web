import { useMeta } from '../lib/seo'
import { Card } from '../components/ui'

const steps = [
  { n: 1, title: 'Create a pool', desc: 'A creator posts a specific piece of work with a funding goal and deadline.' },
  { n: 2, title: 'Supporters fund it', desc: 'Supporters deposit into the pool. No middleman — funds sit in a Soroban contract.' },
  { n: 3, title: 'Creator delivers', desc: 'Work is submitted for review once the goal is met.' },
  { n: 4, title: 'Community votes', desc: 'Supporters approve or reject. Approval releases funds; rejection refunds everyone.' },
  { n: 5, title: 'Settlement', desc: 'Creator is paid minus a small fee, or supporters are refunded automatically.' },
]

export function HowItWorks() {
  useMeta({ title: 'How It Works', description: 'How KindlePool micro-sponsor pools work — create, fund, deliver, vote, settle.', path: '/how-it-works' })
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight text-text-primary">How It Works</h1>
        <p className="text-text-muted mt-2">A simple, trustless loop: create → fund → deliver → vote → settle.</p>
      </div>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-accent-primary text-accent-foreground flex items-center justify-center font-medium shrink-0">{s.n}</div>
            <Card className="flex-1 space-y-1">
              <h3 className="font-semibold text-text-primary">{s.title}</h3>
              <p className="text-sm text-text-muted">{s.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
