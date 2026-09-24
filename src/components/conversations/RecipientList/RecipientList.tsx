import type { User } from '../../../types/user'
import { Avatar } from '../../ui/Avatar/Avatar'
import styles from './RecipientList.module.css'

interface RecipientListProps {
  users: User[]
  onSelect: (user: User) => void
  disabled: boolean
}

export function RecipientList({ users, onSelect, disabled }: RecipientListProps) {
  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <li key={user.id}>
          <button type="button" className={styles.item} onClick={() => onSelect(user)} disabled={disabled}>
            <Avatar nickname={user.nickname} />
            <span className={styles.nickname}>{user.nickname}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
