import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { verifyToken } = useAuth()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); return }
    ;(async () => {
      const result = await verifyToken(token)
      if (result.ok) {
        setStatus('ok')
        const backTo = sessionStorage.getItem('kindlepool_return')
        sessionStorage.removeItem('kindlepool_return')
        setTimeout(() => navigate(backTo ?? '/settings', { replace: true }), 1200)
      }
      else setStatus('error')
    })()
  }, [params, verifyToken, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <Loader2 className="animate-spin" size={28} />
          <span>Verifying your link…</span>
        </div>
      )}
      {status === 'ok' && (
        <div className="flex flex-col items-center gap-3 text-text-primary">
          <CheckCircle2 size={32} className="text-success" />
          <span>Signed in! Redirecting…</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 text-text-primary">
          <XCircle size={32} className="text-error" />
          <span>Invalid or expired magic link.</span>
        </div>
      )}
    </div>
  )
}
