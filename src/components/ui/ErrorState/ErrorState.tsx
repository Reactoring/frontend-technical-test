import styles from './ErrorState.module.css'

interface ErrorStateProps {
  title: string
  message: string
  retryLabel: string
  onRetry: () => unknown
}

export function ErrorState({ title, message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.error} role="alert">
      {/* A sleeping cloud: "It's not you, it's me" */}
      <svg width="120" height="72" viewBox="0 0 120 72" aria-hidden="true">
        <path className={styles.cloud} d="M30 58a16 16 0 0 1 2-32 22 22 0 0 1 42-4 18 18 0 0 1 14 36z" />
        <path className={styles.face} d="M46 40q4 4 8 0M64 40q4 4 8 0M58 49q2 2 4 0" />
        <text className={styles.z} x="90" y="20" fontSize="12">
          z
        </text>
        <text className={styles.z} x="98" y="12" fontSize="9">
          z
        </text>
      </svg>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.retry} onClick={() => onRetry()}>
        {retryLabel}
      </button>
    </div>
  )
}
