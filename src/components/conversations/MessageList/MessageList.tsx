import type { Message } from '../../../types/message'
import type { User } from '../../../types/user'
import { sortByOldest } from '../../../utils/message'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  userId: User['id']
  interlocutorNickname: string
}

export function MessageList({ messages, userId, interlocutorNickname }: MessageListProps) {
  const sortedMessages = sortByOldest(messages)

  return (
    <ol className={styles.list}>
      {sortedMessages.map((message) => {
        const isMine = message.authorId === userId

        return (
          <li key={message.id} className={isMine ? styles.mine : styles.theirs}>
            {!isMine ? <span className={styles.author}>{interlocutorNickname}</span> : null}
            <p className={styles.bubble}>{message.body}</p>
          </li>
        )
      })}
    </ol>
  )
}
