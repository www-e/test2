import { prisma } from '@/lib/db'
import { DiscussionSummary } from '@/types'
import DiscussionNode from './DiscussionNode'

export default async function DiscussionTree() {
  const discussions = await prisma.discussion.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      replies: {
        // Only count replies, not include the full tree structure for performance
        select: {
          id: true,
        },
        where: {
          parentId: null, // Only direct replies, not nested ones
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (discussions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No discussions yet.</p>
        <p className="text-gray-400 text-sm mt-2">
          Be the first to start a discussion!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {discussions.map((discussion: DiscussionSummary) => (
        <DiscussionNode key={discussion.id} discussion={discussion} />
      ))}
    </div>
  )
}