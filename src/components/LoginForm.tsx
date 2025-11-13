'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
const router = useRouter()
const [formData, setFormData] = useState({
username: '',
password: '',
})
const [error, setError] = useState('')
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setError('')
setIsLoading(true)

try {
  const result = await signIn('credentials', {
    username: formData.username,
    password: formData.password,
    redirect: false,
  })

  if (result?.error) {
    setError('Invalid username or password')
    setIsLoading(false)
    return
  }

  // Redirect to home on success
  router.push('/')
  router.refresh()
} catch (err) {
  setError('An unexpected error occurred')
  setIsLoading(false)
}
}

return (
<div className="bg-white rounded-lg shadow-xl p-8">
<form onSubmit={handleSubmit} className="space-y-6">
{error && (
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
{error}
</div>
)}

text
    <div>
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Username
      </label>
      <input
        id="username"
        type="text"
        value={formData.username}
        onChange={(e) =>
          setFormData({ ...formData, username: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        placeholder="Enter your username"
        required
        disabled={isLoading}
      />
    </div>

    <div>
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Password
      </label>
      <input
        id="password"
        type="password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        placeholder="Enter your password"
        required
        disabled={isLoading}
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isLoading ? 'Logging in...' : 'Login'}
    </button>

    <div className="text-center text-sm text-gray-600">
      Do not have an account?{' '}
      <Link
        href="/register"
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        Register here
      </Link>
    </div>
  </form>
</div>
)
}