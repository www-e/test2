import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { createReplySchema } from '@/lib/validation'
import { ApiResponse } from '@/types'

/**
 * POST /api/replies
 * Create a new reply to a discussion or another reply
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = createReplySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Validation failed',
        },
        { status: 400 }
      )
    }

    const { discussionId, parentId, content } = validation.data

    // Verify discussion exists
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    })

    if (!discussion) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Discussion not found',
        },
        { status: 404 }
      )
    }

    // If parentId is provided, verify it exists and belongs to the same discussion
    if (parentId) {
      const parentReply = await prisma.reply.findUnique({
        where: { id: parentId },
      })

      if (!parentReply) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Parent reply not found',
          },
          { status: 404 }
        )
      }

      if (parentReply.discussionId !== discussionId) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Parent reply does not belong to this discussion',
          },
          { status: 400 }
        )
      }
    }

    // Create reply
    const reply = await prisma.reply.create({
      data: {
        discussionId,
        parentId: parentId || null,
        content,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Reply created successfully',
        data: reply,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create reply error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to create reply',
      },
      { status: 500 }
    )
  }
}