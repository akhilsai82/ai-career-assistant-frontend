import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <Card className="w-full max-w-sm">
        <p className="font-display text-2xl font-semibold text-mist-100">
          Career<span className="text-amber-400">Assistant</span>
        </p>
        <p className="mt-1 mb-6 text-sm text-mist-400">Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-mist-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-mist-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-400">
          No account?{' '}
          <Link to="/register" className="text-amber-400 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  )
}
