import { useLoggedUserId } from '../../../contexts/LoggedUserContext'
import { useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { queries } from '../../../services/endpoints'
import { Avatar } from '../../ui/Avatar/Avatar'
import { Skeleton } from '../../ui/Skeleton/Skeleton'
import styles from './LoggedUser.module.css'

export function LoggedUser() {
  const userId = useLoggedUserId()
  const { data, isPending } = useTypedQuery(queries.users)

  if (isPending) return <Skeleton width={36} height={36} round />
  // Not essential: if the users can't be loaded, the header simply doesn't show the user
  const user = data?.find(({ id }) => id === userId)
  if (!user) return null

  return (
    <span className={styles.user}>
      <Avatar nickname={user.nickname} small />
      <span className={styles.nickname}>
        <span className="visually-hidden">{t('loggedUser.label')} </span>
        {user.nickname}
      </span>
    </span>
  )
}
