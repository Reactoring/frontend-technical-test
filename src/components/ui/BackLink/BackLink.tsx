import Link from 'next/link'
import styles from './BackLink.module.css'

// Icon-only link: the label is read by screen readers
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={styles.back} aria-label={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
    </Link>
  )
}
