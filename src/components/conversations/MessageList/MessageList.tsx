import { useEffect, useRef } from 'react'
import { t } from '../../../i18n'
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
  const listRef = useRef<HTMLOListElement>(null)

  // Show the latest message when the conversation opens and when a message arrives
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length])

  return (
    <ol ref={listRef} className={styles.list}>
      {sortedMessages.map((message) => {
        const isMine = message.authorId === userId

        return (
          <li key={message.id} className={isMine ? styles.mine : styles.theirs}>
            {isMine ? (
              <span className="visually-hidden">{t('messages.you')}</span>
            ) : (
              <span className={styles.author}>{interlocutorNickname}</span>
            )}
            <p className={styles.bubble}>{message.body}</p>
          </li>
        )
      })}
    </ol>
  )
}
