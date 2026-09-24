import styles from './Skeleton.module.css'

interface SkeletonProps {
  width: number | string
  height: number
  round?: boolean
}

// Placeholder shape shown while the content loads, with the size of the future content
export function Skeleton({ width, height, round = false }: SkeletonProps) {
  return <span className={styles.skeleton} style={{ width, height, borderRadius: round ? '50%' : height / 2 }} />
}
