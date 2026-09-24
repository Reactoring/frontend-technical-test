import { useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { queries } from '../../../services/endpoints'
import type { User } from '../../../types/user'
import { ErrorState } from '../../ui/ErrorState/ErrorState'
import { EmptyConversation } from '../EmptyConversation/EmptyConversation'
import { MessageList } from '../MessageList/MessageList'
import { MessageListSkeleton } from '../MessageList/MessageListSkeleton'

interface ConversationMessagesProps {
  conversationId: number
  userId: User['id']
  interlocutorNickname: string
}

export function ConversationMessages({ conversationId, userId, interlocutorNickname }: ConversationMessagesProps) {
  const { data, isPending, refetch } = useTypedQuery(queries.messages, { conversationId })

  if (isPending) return <MessageListSkeleton />
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
  if (data.length === 0) return <EmptyConversation interlocutorNickname={interlocutorNickname} />

  return <MessageList messages={data} userId={userId} interlocutorNickname={interlocutorNickname} />
}
