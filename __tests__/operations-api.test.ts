import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/operations/route'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { calculate } from '@/lib/calculations'

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    discussion: {
      findUnique: vi.fn(),
    },
    operation: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/calculations', () => ({
  calculate: vi.fn(),
  CalculationError: class extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'CalculationError'
    }
  },
}))

describe('Operations API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new operation successfully', async () => {
    const mockSession = { user: { id: 'user1', name: 'testuser' } }
    const mockDiscussion = { id: 'discussion1', startNumber: 10 }
    const mockOperation = {
      id: 'operation1',
      discussionId: 'discussion1',
      parentId: null,
      operationType: 'ADD',
      rightOperand: 5,
      result: 15,
      author: {
        id: 'user1',
        username: 'testuser',
      },
    }

    ;(getServerSession as vi.Mock).mockResolvedValue(mockSession)
    ;(prisma.discussion.findUnique as vi.Mock).mockResolvedValue(mockDiscussion)
    ;(calculate as vi.Mock).mockReturnValue(15)
    ;(prisma.operation.create as vi.Mock).mockResolvedValue(mockOperation)

    const request = {
      json: vi.fn().mockResolvedValue({
        discussionId: 'ckp4m6n890123abcdef456789', // Valid cuid format
        operationType: 'ADD',
        rightOperand: 5,
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(201)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Operation created successfully')
    expect(result.data).toEqual(mockOperation)
  })

  it('should return 401 error when not authenticated', async () => {
    ;(getServerSession as vi.Mock).mockResolvedValue(null)

    const request = {
      json: vi.fn().mockResolvedValue({
        discussionId: 'discussion1',
        operationType: 'ADD',
        rightOperand: 5,
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(401)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Authentication required')
  })

  it('should return 400 error for invalid calculation', async () => {
    const mockSession = { user: { id: 'user1', name: 'testuser' } }
    const { CalculationError } = await import('@/lib/calculations')

    ;(getServerSession as vi.Mock).mockResolvedValue(mockSession)
    ;(prisma.discussion.findUnique as vi.Mock).mockResolvedValue({ id: 'discussion1', startNumber: 10 })
    ;(calculate as vi.Mock).mockImplementation(() => {
      throw new CalculationError('Division by zero is not allowed')
    })

    const request = {
      json: vi.fn().mockResolvedValue({
        discussionId: 'ckp4m6n890123abcdef456789', // Valid cuid format
        operationType: 'DIVIDE',
        rightOperand: 0,
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Division by zero is not allowed')
  })
})