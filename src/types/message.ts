import { z } from 'zod'

export const messageSchema = z.object({
  id: z.number(),
  conversationId: z.number(),
  authorId: z.number(),
  // The swagger documents a string, but the API returns a unix timestamp in seconds
  timestamp: z.number(),
  body: z.string(),
})

export type Message = z.infer<typeof messageSchema>
