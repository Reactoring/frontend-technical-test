import { t } from '../../../i18n'
import { Skeleton } from '../../ui/Skeleton/Skeleton'
import styles from './MessageList.module.css'

// Same layout as the message list, so nothing moves when the data arrives
export function MessageListSkeleton() {
  return (
    <div role="status">
      <span className="visually-hidden">{t('common.loading')}</span>
      <ol className={styles.list} aria-hidden="true">
        <li className={styles.theirs}>
          <Skeleton width="55%" height={42} />
        </li>
        <li className={styles.mine}>
          <Skeleton width="45%" height={42} />
        </li>
        <li className={styles.theirs}>
          <Skeleton width="35%" height={42} />
        </li>
      </ol>
    </div>
  )
}
