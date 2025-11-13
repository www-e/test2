import { z } from 'zod'

// Authentication schemas
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

// Discussion schemas
export const createDiscussionSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be 5000 characters or less'),
})

// Reply schemas
export const createReplySchema = z.object({
  discussionId: z.string().cuid(),
  parentId: z.string().cuid().optional().nullable(),
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be 5000 characters or less'),
})

// Type exports for use in components
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>
export type CreateReplyInput = z.infer<typeof createReplySchema>
