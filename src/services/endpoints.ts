import { z, type ZodType } from 'zod'
import { conversationSchema } from '../types/conversation'
import { messageSchema } from '../types/message'
import { userSchema } from '../types/user'

// API contract: the only endpoints the app is allowed to call

export interface QueryEndpoint<TParams extends unknown[], TOutput> {
  path: (...params: TParams) => string
  output: ZodType<TOutput>
}

export interface MutationEndpoint<TInput, TOutput> {
  method: 'POST'
  path: (input: TInput) => string
  input: ZodType<TInput>
  output: ZodType<TOutput>
}

// Helpers so TypeScript infers the params / input types of each endpoint
const defineQuery = <TParams extends unknown[], TOutput>(endpoint: QueryEndpoint<TParams, TOutput>) => endpoint
const defineMutation = <TInput, TOutput>(endpoint: MutationEndpoint<TInput, TOutput>) => endpoint

export const queries = {
  conversations: defineQuery({
    path: ({ userId }: { userId: number }) => `/conversations/${userId}`,
    output: z.array(conversationSchema),
  }),
  messages: defineQuery({
    path: ({ conversationId }: { conversationId: number }) => `/messages/${conversationId}`,
    output: z.array(messageSchema),
  }),
  users: defineQuery({
    path: () => '/users',
    output: z.array(userSchema),
  }),
}

// json-server ignores the id in the path, so the body must contain every field of the created item
export const mutations = {
  sendMessage: defineMutation({
    method: 'POST',
    path: ({ conversationId }) => `/messages/${conversationId}`,
    input: messageSchema.omit({ id: true }).extend({ body: z.string().trim().min(1).max(1000) }),
    output: z.object({ id: z.number() }),
  }),
  createConversation: defineMutation({
    method: 'POST',
    path: ({ senderId }) => `/conversations/${senderId}`,
    input: conversationSchema.omit({ id: true }),
    output: z.object({ id: z.number() }),
  }),
}
