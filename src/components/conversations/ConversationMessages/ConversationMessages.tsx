import { useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { queries } from '../../../services/endpoints'
import type { User } from '../../../types/user'
import { EmptyConversation } from '../EmptyConversation/EmptyConversation'
import { MessageList } from '../MessageList/MessageList'

interface ConversationMessagesProps {
  conversationId: number
  userId: User['id']
  interlocutorNickname: string
}

export function ConversationMessages({ conversationId, userId, interlocutorNickname }: ConversationMessagesProps) {
  const { data, isPending, isError } = useTypedQuery(queries.messages, { conversationId })

  if (isPending) return <p>{t('common.loading')}</p>
  if (isError) return <p role="alert">{t('messages.error')}</p>
  if (data.length === 0) return <EmptyConversation interlocutorNickname={interlocutorNickname} />

  return <MessageList messages={data} userId={userId} interlocutorNickname={interlocutorNickname} />
}
