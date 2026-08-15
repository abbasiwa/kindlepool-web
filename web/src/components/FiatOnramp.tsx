import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, Input } from './ui'
import { useToast } from '../lib/toast'
import { useWallet } from '../lib/wallet'
import { useAuth } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Wallet, Mail, Check } from 'lucide-react'

type OnrampStep = 'select' | 'amount' | 'done'

/**
 * Fiat on-ramp. Card purchases require a licensed provider (MoonPay/Banxa)
 * which is a mainnet feature; the beta clearly communicates that. The email
 * path uses the real email magic-link auth instead of a fake custodial wallet.
 */
export function FiatOnramp() {
  const { connected, connect } = useWallet()
  const { login, user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState<OnrampStep>('select')
  const [method, setMethod] = useState<'email' | 'existing' | null>(null)
  const [email, setEmail] = useState('')
  const [fiatAmount, setFiatAmount] = useState('25')
  const [sending, setSending] = useState(false)

  const handleEmailSignin = useCallback(async () => {
    if (!email || !email.includes('@')) { toast('Enter a valid email', 'error'); return }
    setSending(true)
    const result = await login(email)
    setSending(false)
    if (result.ok) { setStep('done'); toast('Magic link sent — check your email', 'success') }
    else toast(result.error ?? 'Failed to send magic link', 'error')
  }, [email, login, toast])

  const handleCardPurchase = useCallback(() => {
    // Card on-ramp requires a licensed provider — mainnet feature.
    navigate('/login')
    toast('Card purchases arrive with the mainnet launch', 'info')
  }, [navigate, toast])

  const reset = useCallback(() => {
    setStep('select')
    setMethod(null)
    setEmail('')
    setFiatAmount('25')
  }, [])

  if (step === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <Check className="text-success" size={32} />
        </div>
        <h3 className="text-xl font-display font-semibold text-text-primary tracking-tight">Check your email</h3>
        <p className="text-sm text-text-muted">We sent a login link to {email || user?.email}. Open it to continue.</p>
        <Button onClick={reset} variant="secondary">Done</Button>
      </motion.div>
    )
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center">
          <CreditCard className="text-accent-primary" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-text-primary">Add Funds</h3>
          <p className="text-sm text-text-muted">Top up your wallet to fund pools. Testnet beta — no real money.</p>
        </div>
      </div>

      {step === 'select' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <button onClick={() => { setMethod('existing'); setStep('amount') }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface-2 hover:bg-surface-hover transition-colors text-left">
            <Wallet size={20} className="text-accent-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">Use my wallet</p>
              <p className="text-xs text-text-muted">Connect Freighter and fund directly on testnet.</p>
            </div>
          </button>
          <button onClick={() => { setMethod('email'); setStep('amount') }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface-2 hover:bg-surface-hover transition-colors text-left">
            <Mail size={20} className="text-accent-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">Sign in with email</p>
              <p className="text-xs text-text-muted">Create a KindlePool account with a magic link.</p>
            </div>
          </button>
        </motion.div>
      )}

      {step === 'amount' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {method === 'email' && (
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" />
          )}

          {method === 'email' ? (
            <Button className="w-full" onClick={handleEmailSignin} loading={sending}>
              {sending ? 'Sending…' : 'Send Magic Link'}
            </Button>
          ) : !connected ? (
            <Button className="w-full" size="lg" onClick={connect}>Connect Wallet</Button>
          ) : (
            <>
              <Input label="Amount (USD)" type="number" min={10} max={1000} value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)} placeholder="25" />
              <div className="flex gap-2">
                {[10, 25, 50, 100].map((a) => (
                  <button key={a} onClick={() => setFiatAmount(String(a))}
                    className={`flex-1 py-2 text-sm rounded-xl font-medium transition-colors ${
                      fiatAmount === String(a) ? 'bg-accent-primary text-accent-foreground' : 'bg-surface-2 hover:bg-surface-hover'
                    }`}>${a}</button>
                ))}
              </div>
              <Button className="w-full" size="lg" onClick={handleCardPurchase}>Buy ${fiatAmount} USDC</Button>
              <p className="text-xs text-text-muted text-center">Card purchases require a licensed provider — available at mainnet launch.</p>
            </>
          )}
          <button onClick={() => setStep('select')} className="text-sm text-text-muted hover:text-text-primary mx-auto block">
            ← Change
          </button>
        </motion.div>
      )}
    </Card>
  )
}
