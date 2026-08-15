import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { useMeta } from '../lib/seo'
import { Mail, CheckCircle2 } from 'lucide-react'

export function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  useMeta({ title: 'Sign In', description: 'Sign in to KindlePool with your email.', path: '/login' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast('Enter your email', 'error'); return }
    setSending(true)
    const result = await login(email)
    setSending(false)
    if (result.ok) {
      setSent(true)
      toast('Magic link sent — check your email', 'success')
    } else {
      toast(result.error ?? 'Failed to send magic link', 'error')
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <CheckCircle2 size={40} className="mx-auto text-success" />
        <h1 className="text-2xl font-bold text-text-primary">Check your email</h1>
        <p className="text-text-muted">We sent a login link to <strong>{email}</strong>. It expires in 10 minutes.</p>
        <button onClick={() => navigate('/')} className="text-accent-primary hover:underline text-sm">← Back home</button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">Sign in to KindlePool</h1>
        <p className="text-text-muted">Email magic-link — no password needed.</p>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Button className="w-full" type="submit" loading={sending}>
            <Mail size={16} /> Send Magic Link
          </Button>
        </form>
      </Card>
      <p className="text-xs text-text-muted text-center">
        In development (no email provider configured) the link is printed to the backend logs.
      </p>
    </div>
  )
}
