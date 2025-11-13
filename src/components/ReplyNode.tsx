import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ReplyWithChildren } from '@/types'
import ReplyForm from './ReplyForm'

interface ReplyNodeProps {
  reply: ReplyWithChildren
  discussionId: string
  level: number
}

export default async function ReplyNode({
  reply,
  discussionId,
  level,
}: ReplyNodeProps) {
  const session = await getServerSession(authOptions)

  const indentClass = `ml-${Math.min(level * 6, 24)}`

  return (
    <div className={`${indentClass}`}>
      <div className="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-indigo-300">
        <div className="prose max-w-none text-gray-700 mb-2">
          {reply.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <span className="font-medium text-gray-600">
            {reply.author.username}
          </span>
          <span className="mx-2">•</span>
          <span>
            {new Date(reply.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {session && (
          <div className="mt-3">
            <ReplyForm discussionId={discussionId} parentId={reply.id} />
          </div>
        )}
      </div>

      {reply.children && reply.children.length > 0 && (
        <div className="space-y-3 mt-2 border-l-2 border-gray-200 pl-4">
          {reply.children.map((child) => (
            <ReplyNode
              key={child.id}
              reply={child}
              discussionId={discussionId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}