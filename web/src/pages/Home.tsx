import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Button, ProgressBar } from '../components/ui'
import { useWallet } from '../lib/wallet'
import { getApi } from '../lib/sdk'
import { Sparkles, Users, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PoolData } from '@mikwansa/kindlepool-sdk'

const features = [
  {
    icon: <Sparkles size={24} />,
    title: 'Fund Specific Work',
    desc: 'Support a particular project, not a creator. Your money goes to the work you believe in.',
  },
  {
    icon: <Users size={24} />,
    title: 'Community Voted',
    desc: 'Supporters vote on quality. Funds release only if the work meets the community standard.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Automated Refunds',
    desc: 'If the goal isn\'t met or work is rejected, funds automatically return to supporters.',
  },
]

function fmt(n: string): string {
  const big = BigInt(n || '0')
  return big >= 1_000_000n ? `${Number(big) / 1_000_000} USDC` : `${big} units`
}

function daysLeft(deadline: number): string {
  if (!deadline) return 'Ending soon'
  const days = Math.ceil((deadline * 1000 - Date.now()) / 86400000)
  return days > 0 ? `${days} days left` : 'Ending soon'
}

export function Home() {
  const navigate = useNavigate()
  const { connected } = useWallet()
  const [featured, setFeatured] = useState<PoolData[]>([])

  useEffect(() => {
    let cancelled = false
    getApi().listPools({ limit: 3, sort: 'most_funded' })
      .then((r) => { if (!cancelled) setFeatured(r.data ?? []) })
      .catch(() => { /* backend may be down; keep empty */ })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 space-y-6"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-light leading-tight max-w-2xl mx-auto">
          Fund the <span className="text-warm-300">work</span>,<br />
          not the creator
        </h1>
        <p className="text-lg text-muted-100 max-w-xl mx-auto leading-relaxed">
          Micro-sponsor pools for creators. Money pools trustlessly on Stellar, 
          releases only if quality thresholds are met, and auto-refunds otherwise.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => navigate('/explore')}>Explore Pools</Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/create')}>Create a Pool</Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {features.map((f, i) => (
          <Card key={i} hover className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-warm-100/50 flex items-center justify-center mx-auto text-warm-300">
              {f.icon}
            </div>
            <h3 className="font-bold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-100 leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trending Pools</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>View all →</Button>
        </div>
        {featured.length === 0 ? (
          <p className="text-center text-muted-100 py-8">No pools yet. Be the first to create one!</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((pool, i) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div onClick={() => navigate(`/pool/${pool.id}`)}>
                  <Card hover className="space-y-4">
                    <div>
                      <h3 className="font-bold text-base">Pool #{pool.id}</h3>
                      <p className="text-sm text-muted-100 font-mono">{`${pool.creator.slice(0, 8)}...${pool.creator.slice(-4)}`}</p>
                    </div>
                    <ProgressBar value={Number(pool.total_deposited || '0')} max={Number(pool.goal || '1')} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-100">{fmt(pool.total_deposited)} / {fmt(pool.goal)}</span>
                      <span className="text-warm-300 font-medium">{pool.total_supporters} supporters</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-100">
                      <span>{daysLeft(pool.deadline)}</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/pool/${pool.id}`) }}>
                        {connected ? 'Fund' : 'View'}
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}
