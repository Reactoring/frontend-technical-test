import { t } from '../../../i18n'
import { formatDate } from '../../../utils/formatDate'
import { BackLink } from '../../ui/BackLink/BackLink'
import styles from './ConversationHeader.module.css'

interface ConversationHeaderProps {
  interlocutorNickname: string
  lastMessageTimestamp: number
}

export function ConversationHeader({ interlocutorNickname, lastMessageTimestamp }: ConversationHeaderProps) {
  return (
    <header className={styles.header}>
      <BackLink href="/" label={t('conversation.back')} />
      <div>
        <h1 className={styles.title}>{interlocutorNickname}</h1>
        <p className={styles.lastMessage}>
          {t('conversation.lastMessage')} {formatDate(lastMessageTimestamp)}
        </p>
      </div>
    </header>
  )
}
