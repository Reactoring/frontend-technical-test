import { ConversationList } from '../components/ConversationList/ConversationList'
import { useLoggedUserId } from '../contexts/LoggedUserContext'
import { useTypedQuery } from '../hooks/useTypedQuery'
import { t } from '../i18n'
import { queries } from '../services/endpoints'

export default function Home() {
  return (
    <>
      <h1>{t('conversations.title')}</h1>
      <Conversations />
    </>
  )
}

function Conversations() {
  const userId = useLoggedUserId()
  const { data, isPending, isError } = useTypedQuery(queries.conversations, { userId })

  if (isPending) return <p>{t('common.loading')}</p>
  if (isError) return <p role="alert">{t('conversations.error')}</p>
  if (data.length === 0) return <p>{t('conversations.empty')}</p>

  return <ConversationList conversations={data} userId={userId} />
}
