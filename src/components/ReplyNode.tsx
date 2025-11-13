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
  const borderClass = `border-l-${Math.min(2 + level, 8)} border-indigo-${Math.min(300 + level * 100, 500)}`

  return (
    <div className={`${indentClass}`} role="listitem">
      <div className={`bg-white rounded-lg p-4 mb-3 ${borderClass} border-l-solid shadow-sm hover:shadow-md transition-shadow`}>
        <div className="prose max-w-none text-gray-700 mb-2">
          {reply.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <div>
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
        </div>

        {session && (
          <div className="mt-3 flex justify-end">
            <ReplyForm discussionId={discussionId} parentId={reply.id} />
          </div>
        )}
      </div>

      {reply.children && reply.children.length > 0 && (
        <div className="space-y-3 mt-2 pl-4" role="list">
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