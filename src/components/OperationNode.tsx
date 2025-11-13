import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOperationSymbol } from '@/lib/calculations'
import { OperationWithChildren } from '@/types'
import ReplyForm from './ReplyForm'

interface OperationNodeProps {
  operation: OperationWithChildren
  discussionId: string
  level: number
}

export default async function OperationNode({
  operation,
  discussionId,
  level,
}: OperationNodeProps) {
  const session = await getServerSession(authOptions)
  const operationType = operation.operationType as string
  const symbol = getOperationSymbol(operationType as any as 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE')

  const indentClass = `ml-${Math.min(level * 6, 12)}`

  return (
    <div className={`${indentClass} border-l-2 border-indigo-200 pl-4`}>
      <div className="bg-gray-50 rounded-lg p-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-lg font-semibold text-gray-700">
            {symbol} {operation.rightOperand}
          </span>
          <span className="text-gray-400">=</span>
          <span className="font-mono text-lg font-bold text-indigo-600">
            {operation.result}
          </span>
          <div className="text-xs text-gray-500 ml-auto">
            <span className="font-medium text-gray-600">
              {operation.author.username}
            </span>
            <span className="mx-1">- </span>
            <span>
              {new Date(operation.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {session && (
          <div className="mt-2">
            <ReplyForm discussionId={discussionId} parentId={operation.id} />
          </div>
        )}
      </div>

      {operation.children && operation.children.length > 0 && (
        <div className="space-y-2">
          {operation.children.map((child) => (
            <OperationNode
              key={child.id}
              operation={child}
              discussionId={discussionId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}