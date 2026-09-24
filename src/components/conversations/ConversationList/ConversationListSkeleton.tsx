import { t } from '../../../i18n'
import { Skeleton } from '../../ui/Skeleton/Skeleton'
import styles from './ConversationList.module.css'

// Same layout as the conversation list, so nothing moves when the data arrives
export function ConversationListSkeleton() {
  return (
    <div role="status">
      <span className="visually-hidden">{t('common.loading')}</span>
      <ul className={styles.list} aria-hidden="true">
        {[140, 100, 120].map((width) => (
          <li key={width} className={styles.item}>
            <Skeleton width={48} height={48} round />
            <span className={styles.skeletonText}>
              <Skeleton width={width} height={14} />
              <Skeleton width={80} height={12} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
