import { t } from '../../../i18n'
import styles from './EmptyConversation.module.css'

export function EmptyConversation({ interlocutorNickname }: { interlocutorNickname: string }) {
  return (
    <div className={styles.empty}>
      <svg width="120" height="90" viewBox="0 0 96 72" aria-hidden="true">
        <path
          className={styles.back}
          d="M8 10a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H28l-10 9v-9h-2a8 8 0 0 1-8-8z"
        />
        <path
          className={styles.front}
          d="M36 30a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-2v9l-10-9H44a8 8 0 0 1-8-8z"
        />
        <circle className={styles.dot} cx="52" cy="40" r="3" />
        <circle className={styles.dot} cx="62" cy="40" r="3" />
        <circle className={styles.dot} cx="72" cy="40" r="3" />
      </svg>
      <p className={styles.title}>{t('messages.empty')}</p>
      <p className={styles.hint}>{t('messages.emptyHint', { name: interlocutorNickname })}</p>
    </div>
  )
}
