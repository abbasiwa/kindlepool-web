import { useMeta } from '../lib/seo'
import { Card } from '../components/ui'

const values = [
  { title: 'Fund specific work', desc: 'Money goes to the project you believe in, not a vague promise.' },
  { title: 'Trustless by design', desc: 'Pools live on Stellar Soroban — no middleman holds your funds.' },
  { title: 'Community vetted', desc: 'Supporters vote on quality; funds release only on approval.' },
  { title: 'Refunds by default', desc: 'Missed goals and rejected work auto-refund to supporters.' },
]

export function About() {
  useMeta({ title: 'About', description: 'KindlePool helps creators fund specific work with trustless micro-sponsor pools on Stellar.', path: '/about' })
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">About KindlePool</h1>
        <p className="text-lg text-text-muted leading-relaxed">
          KindlePool is a creator-funding platform on Stellar Soroban. Creators raise micro-sponsor pools for specific pieces of work — a video, a song, a feature, an article. Supporters fund the work, not the creator. If the goal isn't met or the work is rejected, funds automatically return.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {values.map((v) => (
          <Card key={v.title} className="space-y-2">
            <h3 className="font-semibold text-text-primary">{v.title}</h3>
            <p className="text-sm text-text-muted">{v.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
