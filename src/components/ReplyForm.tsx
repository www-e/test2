'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiResponse } from '@/types'

interface ReplyFormProps {
  discussionId: string
  parentId?: string | null
}

export default function ReplyForm({ discussionId, parentId }: ReplyFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Reply content is required')
      return
    }

    if (content.length > 5000) {
      setError('Content must be 5000 characters or less')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discussionId,
          parentId: parentId || null,
          content: content.trim(),
        }),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to create reply')
        setIsLoading(false)
        return
      }

      // Reset form and refresh page to show new reply
      setContent('')
      setIsOpen(false)
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
      >
        + Reply
      </button>
    )
  }

  return (
    <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
            {error}
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          placeholder="Write your reply..."
          required
          disabled={isLoading}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Posting...' : 'Post Reply'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setError('')
            }}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}