import { StatusMessage } from '../StatusMessage/StatusMessage'
import styles from './NotFoundState.module.css'

interface NotFoundStateProps {
  title: string
  message: string
  backLabel: string
  backHref: string
}

export function NotFoundState({ title, message, backLabel, backHref }: NotFoundStateProps) {
  return (
    <StatusMessage
      isPageTitle
      title={title}
      message={message}
      action={{ label: backLabel, href: backHref }}
      illustration={
        <svg width="110" height="82" viewBox="0 0 96 72" aria-hidden="true">
          <path
            className={styles.bubble}
            d="M20 10a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H44l-12 11V48h-4a8 8 0 0 1-8-8z"
          />
          <text className={styles.mark} x="52" y="36" fontSize="26" textAnchor="middle">
            ?
          </text>
        </svg>
      }
    />
  )
}
