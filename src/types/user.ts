import { z } from 'zod'

// `token` is sent by the API but deliberately left out: zod strips unknown keys,
// so user tokens never end up in the client state.
export const userSchema = z.object({
  id: z.number(),
  nickname: z.string(),
})

export type User = z.infer<typeof userSchema>
