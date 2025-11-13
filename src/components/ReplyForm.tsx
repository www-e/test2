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
  const [operationType, setOperationType] = useState<string>('ADD')
  const [rightOperand, setRightOperand] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const numberValue = parseFloat(rightOperand)

    if (isNaN(numberValue) || !isFinite(numberValue)) {
      setError('Please enter a valid number')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discussionId,
          parentId: parentId || null,
          operationType,
          rightOperand: numberValue,
        }),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to create operation')
        setIsLoading(false)
        return
      }

      // Reset form and refresh page to show new operation
      setRightOperand('')
      setOperationType('ADD')
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

        <div className="flex gap-2">
          <select
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            disabled={isLoading}
          >
            <option value="ADD">+ Add</option>
            <option value="SUBTRACT">- Subtract</option>
            <option value="MULTIPLY">× Multiply</option>
            <option value="DIVIDE">÷ Divide</option>
          </select>

          <input
            type="number"
            step="any"
            value={rightOperand}
            onChange={(e) => setRightOperand(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="Enter number"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Adding...' : 'Add Operation'}
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