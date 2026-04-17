'use client'

import { useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface AuthModalProps {
  onClose: () => void
}

type Tab = 'signin' | 'signup'

export default function AuthModal({ onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (tab === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl p-8">
        {/* Tab switcher */}
        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => { setTab('signin'); setError(null) }}
            className="flex-1 py-2 text-sm font-semibold transition-colors"
            style={tab === 'signin'
              ? { backgroundColor: '#209dd7', color: '#fff' }
              : { backgroundColor: '#fff', color: '#888888' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(null) }}
            className="flex-1 py-2 text-sm font-semibold transition-colors"
            style={tab === 'signup'
              ? { backgroundColor: '#209dd7', color: '#fff' }
              : { backgroundColor: '#fff', color: '#888888' }}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-lg font-bold mb-5" style={{ color: '#032147' }}>
          {tab === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#888888' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#888888' }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="••••••••"
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 rounded-md bg-red-50 px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#753991' }}
          >
            {isLoading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
