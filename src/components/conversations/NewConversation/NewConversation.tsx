import { useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { useLoggedUserId } from '../../../contexts/LoggedUserContext'
import { useTypedMutation } from '../../../hooks/useTypedMutation'
import { getQueryKey, useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { mutations, queries } from '../../../services/endpoints'
import type { User } from '../../../types/user'
import { findConversationWith } from '../../../utils/conversation'
import { searchUsers } from '../../../utils/user'
import { ErrorState } from '../../ui/ErrorState/ErrorState'
import { Skeleton } from '../../ui/Skeleton/Skeleton'
import { RecipientList } from '../RecipientList/RecipientList'
import styles from './NewConversation.module.css'

export function NewConversation({ onClose }: { onClose: () => void }) {
  const userId = useLoggedUserId()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const users = useTypedQuery(queries.users)
  const conversations = useTypedQuery(queries.conversations, { userId })
  const { mutate, isPending, isError } = useTypedMutation(mutations.createConversation)

  const loggedUser = users.data?.find(({ id }) => id === userId)
  const recipients = searchUsers(users.data?.filter(({ id }) => id !== userId) ?? [], search)

  const openConversationWith = (recipient: User) => {
    if (!conversations.data) return
    // A conversation already exists with this user: open it instead of creating a duplicate
    const existing = findConversationWith(conversations.data, userId, recipient.id)
    if (existing) return router.push(`/conversations/${existing.id}`)
    if (!loggedUser || isPending) return

    const conversation = {
      senderId: userId,
      senderNickname: loggedUser.nickname,
      recipientId: recipient.id,
      recipientNickname: recipient.nickname,
      lastMessageTimestamp: Math.floor(Date.now() / 1000),
    }
    mutate(conversation, {
      onSuccess: async ({ id }) => {
        await queryClient.invalidateQueries({ queryKey: getQueryKey(queries.conversations, { userId }) })
        return router.push(`/conversations/${id}`)
      },
    })
  }

  // Enter picks the first suggestion, Escape closes the search
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && recipients[0]) openConversationWith(recipients[0])
    if (event.key === 'Escape') onClose()
  }

  const renderSuggestions = () => {
    if (users.isPending || conversations.isPending) {
      return (
        <div role="status" className={styles.loading}>
          <span className="visually-hidden">{t('common.loading')}</span>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={14} />
        </div>
      )
    }
    if (!users.data || !conversations.data) {
      return (
        <ErrorState
          title={t('error.title')}
          message={t('error.message')}
          retryLabel={t('error.retry')}
          onRetry={() => Promise.all([users.refetch(), conversations.refetch()])}
        />
      )
    }
    if (recipients.length === 0) return <p className={styles.noResult}>{t('newConversation.noResult')}</p>

    return <RecipientList users={recipients} onSelect={openConversationWith} disabled={isPending} />
  }

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <input
          className={styles.search}
          type="search"
          aria-label={t('newConversation.search')}
          placeholder={t('newConversation.search')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button type="button" className={styles.close} aria-label={t('newConversation.close')} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className={styles.suggestions}>{renderSuggestions()}</div>
      {isError ? (
        <p role="alert" className={styles.error}>
          {t('newConversation.error')}
        </p>
      ) : null}
    </div>
  )
}
