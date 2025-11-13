import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DiscussionTree from '@/components/DiscussionTree'
import CreateDiscussionForm from '@/components/CreateDiscussion'

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-16 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Calculation Discussions
        </h1>
        <p className="text-gray-600">
          Explore and participate in numeric conversation trees
        </p>
      </div>

      {session && <CreateDiscussionForm />}

      <Suspense fallback={<LoadingSkeleton />}>
        <DiscussionTree />
      </Suspense>
    </div>
  )
}