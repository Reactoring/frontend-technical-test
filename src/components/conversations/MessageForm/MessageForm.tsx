import { useState, type KeyboardEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTypedMutation } from '../../../hooks/useTypedMutation'
import { getQueryKey } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { mutations, queries } from '../../../services/endpoints'
import type { User } from '../../../types/user'
import styles from './MessageForm.module.css'

interface MessageFormProps {
  conversationId: number
  userId: User['id']
}

export function MessageForm({ conversationId, userId }: MessageFormProps) {
  const [body, setBody] = useState('')
  const queryClient = useQueryClient()
  const { mutate, isPending, isError } = useTypedMutation(mutations.sendMessage)

  const send = () => {
    // Nothing to send, or a message is already being sent (avoids duplicates)
    if (!body.trim() || isPending) return

    const message = { conversationId, authorId: userId, timestamp: Math.floor(Date.now() / 1000), body }
    mutate(message, {
      onSuccess: () => {
        setBody('')
        return queryClient.invalidateQueries({ queryKey: getQueryKey(queries.messages, { conversationId }) })
      },
    })
  }

  // Enter sends the message, Shift + Enter adds a new line
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <div className={styles.field}>
        <textarea
          className={styles.input}
          aria-label={t('messageForm.label')}
          placeholder={t('messageForm.placeholder')}
          rows={1}
          maxLength={1000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className={styles.send} aria-label={t('messageForm.send')}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
          </svg>
        </button>
      </div>
      {isError ? (
        <p role="alert" className={styles.error}>
          {t('messageForm.error')}
        </p>
      ) : null}
    </form>
  )
}
