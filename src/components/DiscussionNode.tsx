import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DiscussionWithReplies } from '@/types'
import ReplyNode from './ReplyNode'
import ReplyForm from './ReplyForm'

interface DiscussionNodeProps {
  discussion: DiscussionWithReplies
}

export default async function DiscussionNode({ discussion }: DiscussionNodeProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{discussion.title}</h3>
        <div className="prose max-w-none text-gray-700 mb-4">
          {discussion.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {discussion.author.username}
          </span>
          <span className="mx-2">•</span>
          <span>
            {new Date(discussion.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {discussion.replies.length > 0 && (
        <div className="mt-6 space-y-4">
          {discussion.replies.map((reply) => (
            <ReplyNode
              key={reply.id}
              reply={reply}
              discussionId={discussion.id}
              level={1}
            />
          ))}
        </div>
      )}

      {session && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <ReplyForm discussionId={discussion.id} parentId={null} />
        </div>
      )}
    </div>
  )
}