import { useLoggedUserId } from '../../../contexts/LoggedUserContext'
import { useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { queries } from '../../../services/endpoints'
import { ErrorState } from '../../ui/ErrorState/ErrorState'
import { ConversationList } from '../ConversationList/ConversationList'
import { ConversationListSkeleton } from '../ConversationList/ConversationListSkeleton'

export function UserConversations() {
  const userId = useLoggedUserId()
  const { data, isPending, refetch } = useTypedQuery(queries.conversations, { userId })

  if (isPending) return <ConversationListSkeleton />
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
  if (data.length === 0) return <p>{t('conversations.empty')}</p>

  return <ConversationList conversations={data} userId={userId} />
}
