import { Link } from 'react-router-dom'
import { useMeta } from '../../lib/seo'
import { Card } from '../../components/ui'
import { Sparkles, Wallet, BookOpen, CircleHelp, ShieldCheck, FileText, CreditCard, ArrowRight } from 'lucide-react'

const docs = [
  { slug: 'overview', title: 'What is KindlePool?', desc: 'A simple creator-funding platform — support specific work, not vague promises.', icon: <Sparkles size={20} /> },
  { slug: 'getting-started', title: 'Getting Started', desc: 'Sign in, create a pool or fund one, and get paid — in minutes.', icon: <Wallet size={20} /> },
  { slug: 'how-funding-works', title: 'How Funding Works', desc: 'The full flow: create, fund, deliver, review, settle.', icon: <BookOpen size={20} /> },
  { slug: 'refunds', title: 'Refunds', desc: 'Automatic refunds when goals aren\u2019t met or work is rejected.', icon: <CircleHelp size={20} /> },
  { slug: 'security', title: 'Security', desc: 'How KindlePool keeps funds safe — escrow, checks, and disclosure.', icon: <ShieldCheck size={20} /> },
]

const legal = [
  { to: '/legal/privacy', label: 'Privacy Policy', icon: <FileText size={18} /> },
  { to: '/legal/terms', label: 'Terms of Service', icon: <FileText size={18} /> },
  { to: '/legal/bounty', label: 'Bug Bounty', icon: <CreditCard size={18} /> },
]

export function Docs() {
  useMeta({ title: 'Documentation', description: 'KindlePool documentation — learn how to fund specific work, how refunds work, and how the platform keeps funds safe.', path: '/docs' })

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">Documentation</h1>
        <p className="text-text-muted mt-3 text-lg">
          Everything you need to know about funding specific work on KindlePool — simple, clear, and helpful.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {docs.map((d) => (
          <Link key={d.slug} to={`/docs/${d.slug}`} className="group">
            <Card hover className="h-full p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-accent-soft text-accent-primary flex items-center justify-center">{d.icon}</span>
                <ArrowRight size={16} className="text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-lg text-text-primary">{d.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{d.desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-text-primary tracking-tight">Legal</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {legal.map((l) => (
            <Link key={l.to} to={l.to}>
              <Card hover className="p-5 flex items-center gap-3">
                <span className="text-accent-primary shrink-0">{l.icon}</span>
                <span className="text-sm font-medium text-text-primary">{l.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
