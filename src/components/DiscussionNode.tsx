import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DiscussionWithOperations } from '@/types'
import OperationNode from './OperationNode'
import ReplyForm from './ReplyForm'

interface DiscussionNodeProps {
  discussion: DiscussionWithOperations
}

export default async function DiscussionNode({ discussion }: DiscussionNodeProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-bold text-2xl">
              {discussion.startNumber}
            </div>
            <div className="text-sm text-gray-500">
              <div className="font-medium text-gray-700">
                {discussion.author.username}
              </div>
              <div>
                {new Date(discussion.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {discussion.operations.length > 0 && (
        <div className="mt-4 space-y-2">
          {discussion.operations.map((operation) => (
            <OperationNode
              key={operation.id}
              operation={operation}
              discussionId={discussion.id}
              level={1}
            />
          ))}
        </div>
      )}

      {session && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ReplyForm discussionId={discussion.id} parentId={null} />
        </div>
      )}
    </div>
  )
}