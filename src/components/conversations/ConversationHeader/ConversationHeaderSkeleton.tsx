import { Skeleton } from '../../ui/Skeleton/Skeleton'
import styles from './ConversationHeader.module.css'

// Same size as the conversation header, so nothing moves when it is replaced
export function ConversationHeaderSkeleton() {
  return (
    <div className={styles.header} aria-hidden="true">
      <Skeleton width={40} height={40} round />
      <span className={styles.skeletonText}>
        <Skeleton width={120} height={18} />
        <Skeleton width={160} height={12} />
      </span>
    </div>
  )
}
