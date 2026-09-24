import { ConversationHeaderSkeleton } from '../ConversationHeader/ConversationHeaderSkeleton'
import { MessageListSkeleton } from '../MessageList/MessageListSkeleton'
import styles from './ConversationDetail.module.css'

// Same layout as the conversation: the header and the bubbles don't move when the data arrives
export function ConversationDetailSkeleton() {
  return (
    <div className={styles.detail}>
      <ConversationHeaderSkeleton />
      <div className={styles.messages}>
        <MessageListSkeleton />
      </div>
    </div>
  )
}
