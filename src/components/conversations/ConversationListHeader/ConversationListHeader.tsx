import { useRef, useState } from 'react'
import { t } from '../../../i18n'
import { NewConversation } from '../NewConversation/NewConversation'
import styles from './ConversationListHeader.module.css'

export function ConversationListHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const closeSearch = () => {
    setIsSearchOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{t('conversations.title')}</h1>
      <button
        ref={buttonRef}
        type="button"
        className={styles.new}
        aria-label={t('newConversation.button')}
        aria-expanded={isSearchOpen}
        onClick={() => setIsSearchOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
          <path d="M20.4 6.6a2.1 2.1 0 0 0-3-3L9 12v3h3z" />
          <path d="m16 5 3 3" />
        </svg>
      </button>
      {isSearchOpen ? <NewConversation onClose={closeSearch} /> : null}
    </header>
  )
}
