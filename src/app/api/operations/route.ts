import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { createOperationSchema } from '@/lib/validation'
import { calculate, CalculationError } from '@/lib/calculations'
import { ApiResponse } from '@/types'

/**
 * POST /api/operations
 * Create a new operation (reply) on a discussion or another operation
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
    const validation = createOperationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Validation failed',
        },
        { status: 400 }
      )
    }

    const { discussionId, parentId, operationType, rightOperand } = validation.data

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

    // Determine left operand (either starting number or parent operation result)
    let leftOperand: number

    if (parentId) {
      // Operation on another operation
      const parentOperation = await prisma.operation.findUnique({
        where: { id: parentId },
      })

      if (!parentOperation) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Parent operation not found',
          },
          { status: 404 }
        )
      }

      if (parentOperation.discussionId !== discussionId) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Parent operation does not belong to this discussion',
          },
          { status: 400 }
        )
      }

      leftOperand = parentOperation.result
    } else {
      // Operation on starting number
      leftOperand = discussion.startNumber
    }

    // Calculate result
    let result: number
    try {
      result = calculate(leftOperand, operationType, rightOperand)
    } catch (error) {
      if (error instanceof CalculationError) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: error.message,
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Create operation
    const operation = await prisma.operation.create({
      data: {
        discussionId,
        parentId: parentId || null,
        operationType,
        rightOperand,
        result,
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
        message: 'Operation created successfully',
        data: operation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create operation error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to create operation',
      },
      { status: 500 }
    )
  }
}