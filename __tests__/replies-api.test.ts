import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/replies/route'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

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
    reply: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

describe('Replies API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new reply successfully', async () => {
    const mockSession = { user: { id: 'user1', name: 'testuser' } }
    const mockDiscussion = { id: 'discussion1' }
    const mockReply = {
      id: 'reply1',
      discussionId: 'discussion1',
      parentId: null,
      content: 'This is a test reply',
      author: {
        id: 'user1',
        username: 'testuser',
      },
    }

    ;(getServerSession as vi.Mock).mockResolvedValue(mockSession)
    ;(prisma.discussion.findUnique as vi.Mock).mockResolvedValue(mockDiscussion)
    ;(prisma.reply.create as vi.Mock).mockResolvedValue(mockReply)

    const request = {
      json: vi.fn().mockResolvedValue({
        discussionId: 'ckp4m6n890123abcdef456789', // Valid cuid format
        content: 'This is a test reply',
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(201)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Reply created successfully')
    expect(result.data).toEqual(mockReply)
  })

  it('should return 401 error when not authenticated', async () => {
    ;(getServerSession as vi.Mock).mockResolvedValue(null)

    const request = {
      json: vi.fn().mockResolvedValue({
        discussionId: 'discussion1',
        content: 'This is a test reply',
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(401)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Authentication required')
  })

  it('should return 404 error when discussion is not found', async () => {
    const mockSession = { user: { id: 'user1', name: 'testuser' } }

    ;(getServerSession as vi.Mock).mockResolvedValue(mockSession)
    ;(prisma.discussion.findUnique as vi.Mock).mockResolvedValue(null)

    const request = {
      json: vi.fn().mockResolvedValue({
        discussionId: 'nonexistent',
        content: 'This is a test reply',
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(404)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Discussion not found')
  })
})