import type { ReactNode } from 'react'
import Link from 'next/link'
import styles from './StatusMessage.module.css'

type Action = { label: string; href: string } | { label: string; onClick: () => unknown }

interface StatusMessageProps {
  illustration: ReactNode
  title: string
  message: string
  action?: Action
  role?: 'alert'
  // When the message replaces the whole page, its title is the page heading
  isPageTitle?: boolean
}

// Illustrated message shared by the empty, error and not found states
export function StatusMessage({ illustration, title, message, action, role, isPageTitle = false }: StatusMessageProps) {
  const Title = isPageTitle ? 'h1' : 'p'

  return (
    <div className={styles.status} role={role}>
      {illustration}
      <Title className={styles.title}>{title}</Title>
      <p className={styles.message}>{message}</p>
      {action && 'href' in action ? (
        <Link href={action.href} className={styles.action}>
          {action.label}
        </Link>
      ) : null}
      {action && 'onClick' in action ? (
        <button type="button" className={styles.action} onClick={() => action.onClick()}>
          {action.label}
        </button>
      ) : null}
    </div>
  )
}
