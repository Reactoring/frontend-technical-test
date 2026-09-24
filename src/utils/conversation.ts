import type { Conversation } from '../types/conversation'
import type { User } from '../types/user'

// The logged user can be the sender or the recipient: return the other participant
export function getInterlocutorNickname(conversation: Conversation, userId: User['id']) {
  return conversation.senderId === userId ? conversation.recipientNickname : conversation.senderNickname
}

// The API has no sorting: most recent conversations first, without mutating the cached data
export function sortByMostRecent(conversations: Conversation[]) {
  return [...conversations].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp)
}
