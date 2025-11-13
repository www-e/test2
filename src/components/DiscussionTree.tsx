import { prisma } from '@/lib/db'
import { DiscussionWithOperations } from '@/types'
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
operations: {
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
orderBy: {
createdAt: 'asc',
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
Be the first to start a calculation tree!
</p>
</div>
)
}

return (
<div className="space-y-6">
{discussions.map((discussion: DiscussionWithOperations) => (
<DiscussionNode key={discussion.id} discussion={discussion} />
))}
</div>
)
}