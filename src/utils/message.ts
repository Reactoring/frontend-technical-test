import type { Message } from '../types/message'

// The API does not guarantee any order: oldest messages first, without mutating the cached data
export function sortByOldest(messages: Message[]) {
  return [...messages].sort((a, b) => a.timestamp - b.timestamp)
}
