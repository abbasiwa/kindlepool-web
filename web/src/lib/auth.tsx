import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  email: string
  displayName?: string
  walletAddress?: string | null
  linkedWallets?: string[]
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  verifyToken: (token: string) => Promise<{ ok: boolean; error?: string }>
  requestWalletChallenge: () => Promise<{ ok: boolean; challenge?: string; error?: string }>
  linkWallet: (wallet: string, challenge: string, signature: string) => Promise<{ ok: boolean; error?: string }>
  refresh: () => Promise<void>
}

const TOKEN_KEY = 'kindlepool_session'
const USER_KEY = 'kindlepool_user'

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, loading: true,
  login: async () => ({ ok: false }), logout: async () => {},
  verifyToken: async () => ({ ok: false }),
  requestWalletChallenge: async () => ({ ok: false }),
  linkWallet: async () => ({ ok: false }), refresh: async () => {},
})

function authHeaders(token: string): Record<string, string> {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = import.meta.env.VITE_INDEXER_URL ?? 'https://kindlepool-api.herokuapp.com'
  return fetch(`${base}/api/v1${path}`, init)
}

function loadCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadCachedUser())
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const persist = (t: string | null, u: AuthUser | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  }

  const refresh = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY)
    if (!t) { setUser(null); setLoading(false); return }
    try {
      const res = await apiFetch('/auth/me', { headers: authHeaders(t) })
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      } else {
        const data = await res.json()
        persist(t, data.user)
        setToken(t)
        setUser(data.user)
      }
    } catch {
      // Backend unreachable — keep cached session (user already loaded from cache).
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const login = useCallback(async (email: string) => {
    try {
      const res = await apiFetch('/auth/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      return res.ok ? { ok: true } : { ok: false, error: data.error ?? 'Failed to send magic link' }
    } catch {
      return { ok: false, error: 'Network error — check connection and try again' }
    }
  }, [])

  const verifyToken = useCallback(async (magicToken: string) => {
    try {
      const res = await apiFetch(`/auth/verify?token=${encodeURIComponent(magicToken)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.token) return { ok: false, error: data.error ?? 'Invalid magic link' }
      persist(data.token, data.user)
      setToken(data.token)
      setUser(data.user)
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error — please try the link again' }
    }
  }, [])

  const logout = useCallback(async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }) } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const requestWalletChallenge = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY)
    if (!t) return { ok: false, error: 'Not logged in' }
    try {
      const res = await apiFetch('/auth/request-wallet-challenge', { method: 'POST', headers: authHeaders(t) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.challenge) return { ok: false, error: data.error ?? 'Failed to get challenge' }
      return { ok: true, challenge: data.challenge }
    } catch {
      return { ok: false, error: 'Network error' }
    }
  }, [])

  const linkWallet = useCallback(async (wallet: string, challenge: string, signature: string) => {
    const t = localStorage.getItem(TOKEN_KEY)
    if (!t) return { ok: false, error: 'Not logged in' }
    try {
      const res = await apiFetch('/auth/link-wallet', {
        method: 'POST',
        headers: authHeaders(t),
        body: JSON.stringify({ wallet, challenge, signature }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return { ok: false, error: data.error ?? 'Failed to link wallet' }
      await refresh()
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error' }
    }
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, verifyToken, requestWalletChallenge, linkWallet, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
