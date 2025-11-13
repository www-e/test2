import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { createDiscussionSchema } from '@/lib/validation'
import { ApiResponse, DiscussionWithOperations } from '@/types'

/**

GET /api/discussions

Fetch all discussions with nested operations (tree structure)

Public endpoint - no auth required
*/
export async function GET(_request: NextRequest) {
try {
// Fetch all discussions with nested operations
const discussions = await prisma.discussion.findMany({
include: {
author: {
select: {
id: true,
username: true,
},
},
operations: {
where: {
parentId: null, // Only root-level operations
},
include: {
author: {
select: {
id: true,
username: true,
},
},
children: {
include: {
author: {
select: {
id: true,
username: true,
},
},
children: {
include: {
author: {
select: {
id: true,
username: true,
},
},
children: {
include: {
author: {
select: {
id: true,
username: true,
},
},
children: true, // Continue nesting (limited by Prisma to reasonable depth)
},
},
},
},
},
},
},
orderBy: {
createdAt: 'asc',
},
},
},
orderBy: {
createdAt: 'desc',
},
})

return NextResponse.json<ApiResponse<DiscussionWithOperations[]>>(
{
success: true,
data: discussions,
},
{ status: 200 }
)
} catch (error) {
console.error('Get discussions error:', error)
return NextResponse.json<ApiResponse>(
{
success: false,
error: 'Failed to fetch discussions',
},
{ status: 500 }
)
}
}

/**

POST /api/discussions

Create a new discussion with starting number

Requires authentication
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
const validation = createDiscussionSchema.safeParse(body)

if (!validation.success) {
return NextResponse.json<ApiResponse>(
{
success: false,
error: validation.error.issues.map((issue: any) => issue.message).join(', '),
},
{ status: 400 }
)
}

const { startNumber } = validation.data

// Create discussion
const discussion = await prisma.discussion.create({
data: {
startNumber,
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
message: 'Discussion created successfully',
data: discussion,
},
{ status: 201 }
)
} catch (error) {
console.error('Create discussion error:', error)
return NextResponse.json<ApiResponse>(
{
success: false,
error: 'Failed to create discussion',
},
{ status: 500 }
)
}
}