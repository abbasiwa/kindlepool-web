import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { ReactNode } from 'react'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24" role="status" aria-label="Checking session">
        <div className="w-10 h-10 rounded-full border-4 border-accent-primary/20 border-t-accent-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    sessionStorage.setItem('kindlepool_return', location.pathname + location.search)
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
