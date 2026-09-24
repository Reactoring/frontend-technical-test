import Link from 'next/link'
import { useLoggedUserId } from '../../../contexts/LoggedUserContext'
import { useTypedQuery } from '../../../hooks/useTypedQuery'
import { t } from '../../../i18n'
import { queries } from '../../../services/endpoints'
import { getInterlocutorNickname } from '../../../utils/conversation'
import { ConversationHeader } from '../ConversationHeader/ConversationHeader'
import { ConversationMessages } from '../ConversationMessages/ConversationMessages'
import { MessageForm } from '../MessageForm/MessageForm'
import styles from './ConversationDetail.module.css'

export function ConversationDetail({ conversationId }: { conversationId: number }) {
  const userId = useLoggedUserId()
  const { data, isPending, isError } = useTypedQuery(queries.conversations, { userId })

  if (isPending) return <p>{t('common.loading')}</p>
  if (isError) return <p role="alert">{t('conversation.error')}</p>

  // GET /conversation/:id is not usable (see README): the conversation is read from the user's list,
  // so an invalid id or a conversation of another user is never opened
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
