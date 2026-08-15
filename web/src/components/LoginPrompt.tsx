import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Input } from './ui'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { Mail } from 'lucide-react'

/**
 * Shown when a user attempts a write action while not logged in.
 * Collects an email to send a magic link.
 */
export function LoginPrompt({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!email) { toast('Enter your email', 'error'); return }
    setSending(true)
    const result = await login(email)
    setSending(false)
    if (result.ok) {
      toast('Magic link sent — check your email', 'success')
      onClose()
    } else {
      toast(result.error ?? 'Failed to send', 'error')
    }
  }

  // Already logged in → no prompt needed
  if (user) return null

  return (
    <Modal open={open} onClose={onClose} title="Sign in to continue">
      <div className="space-y-4">
        <p className="text-sm text-text-muted">Connect your wallet or sign in with email to make transactions.</p>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Button className="w-full" onClick={handleSend} loading={sending}>
          <Mail size={16} /> Send Magic Link
        </Button>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="flex-1 h-px bg-surface-2" />
          or
          <span className="flex-1 h-px bg-surface-2" />
        </div>
        <Button variant="secondary" className="w-full" onClick={() => navigate('/login')}>Sign In Page</Button>
      </div>
    </Modal>
  )
}
