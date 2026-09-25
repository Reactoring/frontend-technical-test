import { useEffect, useId, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLoggedUserId } from '../../../contexts/LoggedUserContext'
import { getQueryKey, useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { API_URL } from '../../../services/apiClient'
import { queries } from '../../../services/endpoints'
import { setLoggedUserId } from '../../../utils/getLoggedUserId'
import { Avatar } from '../../ui/Avatar/Avatar'
import styles from './DemoPanel.module.css'

const OUTAGE_SECONDS = 20

// Resolves to false when the server cannot be reached
const callDemoApi = (path: string) =>
  fetch(`${API_URL}/demo/${path}`, { method: 'POST' }).then(
    (response) => response.ok,
    () => false,
  )

// Testing tools for the online demo, shown when NEXT_PUBLIC_DEMO is true
export function DemoPanel() {
  const userId = useLoggedUserId()
  const queryClient = useQueryClient()
  const users = useTypedQuery(queries.users)
  const [isOpen, setIsOpen] = useState(false)
  const [outageSecondsLeft, setOutageSecondsLeft] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const usersLabelId = useId()

  useEffect(() => {
    if (outageSecondsLeft === 0) return
    const timer = setTimeout(() => {
      setOutageSecondsLeft(outageSecondsLeft - 1)
      // Server back: reloads the users shown in the header and this panel. The page keeps its retry button
      if (outageSecondsLeft === 1) queryClient.refetchQueries({ queryKey: getQueryKey(queries.users) })
    }, 1000)
    return () => clearTimeout(timer)
  }, [outageSecondsLeft, queryClient])

  const close = () => {
    setIsOpen(false)
  }

  const logInAs = (id: number) => {
    setLoggedUserId(id)
    // Reloads the app on the conversation list, with an empty cache
    window.location.assign('/')
  }

  const startOutage = async () => {
    if (!(await callDemoApi(`outage?seconds=${OUTAGE_SECONDS}`))) return
    setOutageSecondsLeft(OUTAGE_SECONDS)
    // Drops the cached data, so the page reloads it and shows the error screen
    return queryClient.resetQueries()
  }

  const resetData = async () => {
    if (!(await callDemoApi('reset'))) return
    return queryClient.resetQueries()
  }

  return (
    <div className={styles.demo} onKeyDown={(event) => event.key === 'Escape' && isOpen && close()}>
      {isOpen ? (
        <div className={styles.panel}>
          <span className={styles.tag}>{t('demo.button')}</span>
          <p className={styles.title}>{t('demo.title')}</p>
          <p className={styles.hint}>{t('demo.hint')}</p>

          <p id={usersLabelId} className={styles.label}>
            {t('demo.logInAs')}
          </p>
          <ul className={styles.users} aria-labelledby={usersLabelId}>
            {users.data?.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className={styles.user}
                  aria-label={user.nickname}
                  aria-pressed={user.id === userId}
                  onClick={() => logInAs(user.id)}
                >
                  <Avatar nickname={user.nickname} small />
                </button>
              </li>
            ))}
          </ul>

          <button type="button" className={styles.action} disabled={outageSecondsLeft > 0} onClick={startOutage}>
            <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3l18 18" />
              <path d="M18 18H7c-2.6 0-4.7-2-4.7-4.5S4.4 9 7 9c.1-.5.3-1 .6-1.4m2-1.9c.4-.2.7-.4 1.1-.5 1.9-.6 4-.2 5.5 1 1.5 1.2 2.2 3 1.8 4.8h1c1.9 0 3.5 1.6 3.5 3.5 0 .7-.2 1.3-.5 1.9" />
            </svg>
            {outageSecondsLeft > 0
              ? t('demo.outageRunning', { seconds: String(outageSecondsLeft) })
              : t('demo.outage', { seconds: String(OUTAGE_SECONDS) })}
          </button>
          <button type="button" className={styles.action} disabled={outageSecondsLeft > 0} onClick={resetData}>
            <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            </svg>
            {t('demo.reset')}
          </button>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
      >
        <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 3h6M10 9h4M10 3v6L6 20a.7.7 0 0 0 .5 1h11a.7.7 0 0 0 .5-1L14 9V3" />
        </svg>
        {t('demo.button')}
      </button>
    </div>
  )
}
