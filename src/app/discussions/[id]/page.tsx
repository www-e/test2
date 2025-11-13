import { Suspense } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DiscussionWithReplies } from '@/types'
import ReplyNode from '@/components/ReplyNode'
import ReplyForm from '@/components/ReplyForm'

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

type DiscussionPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function DiscussionPage(props: DiscussionPageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  const discussion = await prisma.discussion.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      replies: {
        where: {
          parentId: null,
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
                      children: {
                        include: {
                          author: {
                            select: {
                              id: true,
                              username: true,
                            },
                          },
                          children: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!discussion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Discussion Not Found</h2>
          <p className="text-gray-600">The discussion you're looking for doesn't exist.</p>
          <Link 
            href="/" 
            className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Back to Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Forum
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{discussion.title}</h1>
        <div className="prose max-w-none text-gray-700 mb-6">
          {discussion.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
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

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Replies ({discussion.replies.length})
        </h2>
        
        {discussion.replies.length > 0 ? (
          <div className="space-y-4">
            {discussion.replies.map((reply) => (
              <ReplyNode
                key={reply.id}
                reply={reply}
                discussionId={discussion.id}
                level={1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No replies yet. Be the first to reply!</p>
          </div>
        )}
      </div>

      {session && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Post a Reply</h3>
          <ReplyForm discussionId={discussion.id} parentId={null} />
        </div>
      )}
    </div>
  )
}