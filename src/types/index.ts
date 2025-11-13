import { DefaultSession } from 'next-auth'

// Augment NextAuth types to include user ID
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    name: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
  }
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Discussion with nested operations (recursive type)
export interface DiscussionWithOperations {
  id: string
  startNumber: number
  author: {
    id: string
    username: string
  }
  createdAt: string
  operations: OperationWithChildren[]
}

export interface OperationWithChildren {
  id: string
  operationType: string
  rightOperand: number
  result: number
  author: {
    id: string
    username: string
  }
  createdAt: string
  children: OperationWithChildren[]
}
