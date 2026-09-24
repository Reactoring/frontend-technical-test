import Link from 'next/link'
import { useLoggedUserId } from '../../../contexts/LoggedUserContext'
import { useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { queries } from '../../../services/endpoints'
import { getInterlocutorNickname } from '../../../utils/conversation'
import { ErrorState } from '../../ui/ErrorState/ErrorState'
import { ConversationHeader } from '../ConversationHeader/ConversationHeader'
import { ConversationMessages } from '../ConversationMessages/ConversationMessages'
import { MessageForm } from '../MessageForm/MessageForm'
import { ConversationDetailSkeleton } from './ConversationDetailSkeleton'
import styles from './ConversationDetail.module.css'

export function ConversationDetail({ conversationId }: { conversationId: number }) {
  const userId = useLoggedUserId()
  const { data, isPending, refetch } = useTypedQuery(queries.conversations, { userId })

  if (isPending) return <ConversationDetailSkeleton />
  // Not loading and no data: the request failed. If only a refresh fails, the cached data stays visible
  if (!data) {
    return (
      <ErrorState
        title={t('error.title')}
        message={t('error.message')}
        retryLabel={t('error.retry')}
        onRetry={refetch}
      />
    )
  }

  // The API can't return a single conversation (GET /conversation/:id always returns [], see README),
  // so we look for it in the user's own list. This also acts as a guard: an unknown id or a conversation
  // between other users is shown as "not found" and its messages are never requested
  const conversation = data.find(({ id }) => id === conversationId)
  if (!conversation) {
    return (
      <p>
        {t('conversation.notFound')}{' '}
        <Link href="/" className={styles.link}>
          {t('conversation.back')}
        </Link>
      </p>
    )
  }

  const interlocutorNickname = getInterlocutorNickname(conversation, userId)

  return (
    <div className={styles.detail}>
      <ConversationHeader
        interlocutorNickname={interlocutorNickname}
        lastMessageTimestamp={conversation.lastMessageTimestamp}
      />
      <div className={styles.messages}>
        <ConversationMessages
          conversationId={conversation.id}
          userId={userId}
          interlocutorNickname={interlocutorNickname}
        />
      </div>
      <MessageForm conversationId={conversation.id} userId={userId} />
    </div>
  )
}
