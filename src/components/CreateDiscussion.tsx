'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiResponse } from '@/types'

export default function CreateDiscussionForm() {
const router = useRouter()
const [startNumber, setStartNumber] = useState('')
const [error, setError] = useState('')
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setError('')

const numberValue = parseFloat(startNumber)

if (isNaN(numberValue) || !isFinite(numberValue)) {
  setError('Please enter a valid number')
  return
}

setIsLoading(true)

try {
  const response = await fetch('/api/discussions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startNumber: numberValue }),
  })

  const data: ApiResponse = await response.json()

  if (!response.ok || !data.success) {
    setError(data.error || 'Failed to create discussion')
    setIsLoading(false)
    return
  }

  // Reset form and refresh page to show new discussion
  setStartNumber('')
  router.refresh()
} catch (err) {
  setError('An unexpected error occurred')
  setIsLoading(false)
}
}

return (
<div className="bg-white rounded-lg shadow-md p-6 mb-8">
<h2 className="text-2xl font-bold text-gray-900 mb-4">
Start a New Discussion
</h2>
<form onSubmit={handleSubmit} className="space-y-4">
{error && (
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
{error}
</div>
)}

text
    <div>
      <label
        htmlFor="startNumber"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Starting Number
      </label>
      <input
        id="startNumber"
        type="number"
        step="any"
        value={startNumber}
        onChange={(e) => setStartNumber(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        placeholder="Enter any number (e.g., 42)"
        required
        disabled={isLoading}
      />
      <p className="text-xs text-gray-500 mt-1">
        This will be the root of your calculation tree
      </p>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isLoading ? 'Creating...' : 'Create Discussion'}
    </button>
  </form>
</div>
)
}