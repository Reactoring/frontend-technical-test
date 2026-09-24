import styles from './Avatar.module.css'

// Decorative: the nickname is always written next to the avatar
export function Avatar({ nickname, small = false }: { nickname: string; small?: boolean }) {
  return (
    <span className={small ? `${styles.avatar} ${styles.small}` : styles.avatar} aria-hidden="true">
      {nickname.charAt(0)}
    </span>
  )
}
