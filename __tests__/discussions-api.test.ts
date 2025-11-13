import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/discussions/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock the auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    discussion: {
      findMany: vi.fn(),
    },
  },
}))

describe('Discussions API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return discussions successfully when no authentication required', async () => {
    const mockDiscussions = [
      {
        id: '1',
        startNumber: 42,
        author: {
          id: 'user1',
          username: 'testuser',
        },
        createdAt: new Date().toISOString(),
        operations: [],
      },
    ]

    ;(prisma.discussion.findMany as vi.Mock).mockResolvedValue(mockDiscussions)

    // Create a mock request
    const mockRequest = {
      nextUrl: new URL('http://localhost/api/discussions'),
    } as unknown as NextRequest

    const response = await GET(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.success).toBe(true)
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.data).toEqual(mockDiscussions)
    expect(prisma.discussion.findMany).toHaveBeenCalled()
  })

  it('should return empty array when no discussions exist', async () => {
    ;(prisma.discussion.findMany as vi.Mock).mockResolvedValue([])

    const mockRequest = {
      nextUrl: new URL('http://localhost/api/discussions'),
    } as unknown as NextRequest

    const response = await GET(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.success).toBe(true)
    expect(result.data).toEqual([])
  })

  it('should handle errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    ;(prisma.discussion.findMany as vi.Mock).mockRejectedValue(new Error('Database error'))

    const mockRequest = {
      nextUrl: new URL('http://localhost/api/discussions'),
    } as unknown as NextRequest

    const response = await GET(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to fetch discussions')
    expect(consoleSpy).toHaveBeenCalledWith('Get discussions error:', expect.any(Error))

    consoleSpy.mockRestore()
  })
})