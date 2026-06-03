import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import toast from 'react-hot-toast'
import { BookOpen } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    })
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm text-center">
          <BookOpen className="mx-auto h-10 w-10 text-indigo-500" />
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a password reset link to <strong>{email}</strong>.
          </p>
          <Link to="/auth/login" className="mt-6 inline-block text-sm text-indigo-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-indigo-500" />
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/auth/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
