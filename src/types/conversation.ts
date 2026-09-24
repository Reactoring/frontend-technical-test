import { z } from 'zod'

export const conversationSchema = z.object({
  id: z.number(),
  recipientId: z.number(),
  recipientNickname: z.string(),
  senderId: z.number(),
  senderNickname: z.string(),
  lastMessageTimestamp: z.number(),
})

export type Conversation = z.infer<typeof conversationSchema>
