import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DiscussionWithReplies, DiscussionSummary } from '@/types'
import Link from 'next/link'
import ReplyForm from './ReplyForm'

interface DiscussionNodeProps {
  discussion: DiscussionWithReplies | DiscussionSummary
}

export default async function DiscussionNode({ discussion }: DiscussionNodeProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <Link
        href={`/discussions/${discussion.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded-lg"
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-700 transition-colors">
            {discussion.title}
          </h3>
          <div className="prose max-w-none text-gray-700 mb-4 line-clamp-3">
            {discussion.content.split('\n').map((paragraph: string, index: number) => (
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
          <div className="mt-2 text-sm text-gray-500">
            {discussion.replies.length} {discussion.replies.length === 1 ? 'reply' : 'replies'}
          </div>
        </div>
      </Link>

      {session && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ReplyForm discussionId={discussion.id} parentId={null} />
        </div>
      )}
    </div>
  )
}