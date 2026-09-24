import Link from 'next/link'
import type { Conversation } from '../../types/conversation'
import type { User } from '../../types/user'
import { getInterlocutorNickname, sortByMostRecent } from '../../utils/conversation'
import { formatDate } from '../../utils/formatDate'
import styles from './ConversationList.module.css'

interface ConversationListProps {
  conversations: Conversation[]
  userId: User['id']
}

export function ConversationList({ conversations, userId }: ConversationListProps) {
  const sortedConversations = sortByMostRecent(conversations)

  return (
    <ul className={styles.list}>
      {sortedConversations.map((conversation) => {
        const nickname = getInterlocutorNickname(conversation, userId)

        return (
          <li key={conversation.id}>
            <Link href={`/conversations/${conversation.id}`} className={styles.item}>
              <span className={styles.avatar} aria-hidden="true">
                {nickname.charAt(0)}
              </span>
              <span className={styles.nickname}>{nickname}</span>
              <span className={styles.date}>{formatDate(conversation.lastMessageTimestamp)}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
