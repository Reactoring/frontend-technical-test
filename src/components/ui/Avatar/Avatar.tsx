import styles from './Avatar.module.css'

// Decorative: the nickname is always written next to the avatar
export function Avatar({ nickname }: { nickname: string }) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {nickname.charAt(0)}
    </span>
  )
}
