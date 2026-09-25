import Link from 'next/link'
import type { Conversation } from '../../../types/conversation'
import type { User } from '../../../types/user'
import { getInterlocutorNickname, sortByMostRecent } from '../../../utils/conversation'
import { formatDate } from '../../../utils/formatDate'
import { Avatar } from '../../ui/Avatar/Avatar'
import styles from './ConversationList.module.css'

interface ConversationListProps {
  conversations: Conversation[]
  userId: User['id']
  onConversationHover: (conversationId: number) => void
}

export function ConversationList({ conversations, userId, onConversationHover }: ConversationListProps) {
  const sortedConversations = sortByMostRecent(conversations)

  return (
    <ul className={styles.list}>
      {sortedConversations.map((conversation) => {
        const nickname = getInterlocutorNickname(conversation, userId)

        return (
          <li key={conversation.id}>
            <Link
              href={`/conversations/${conversation.id}`}
              className={styles.item}
              onMouseEnter={() => onConversationHover(conversation.id)}
            >
              <Avatar nickname={nickname} />
              <span className={styles.text}>
                <span className={styles.nickname}>{nickname}</span>
                <span className={styles.date}>{formatDate(conversation.lastMessageTimestamp)}</span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
