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

// Discussion with nested replies (recursive type)
export interface DiscussionWithReplies {
  id: string
  title: string
  content: string
  author: {
    id: string
    username: string
  }
  createdAt: Date | string  // Prisma returns Date, but we might want string for API
  replies: ReplyWithChildren[]
}

// Simplified discussion type for list view (without full reply tree)
export interface DiscussionSummary {
  id: string
  title: string
  content: string
  author: {
    id: string
    username: string
  }
  createdAt: Date | string
  replies: { id: string }[] // Just reply IDs for count
}

export interface ReplyWithChildren {
  id: string
  content: string
  author: {
    id: string
    username: string
  }
  createdAt: Date | string  // Prisma returns Date, but we might want string for API
  children: ReplyWithChildren[]
}
