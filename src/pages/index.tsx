import { UserConversations } from '../components/conversations/UserConversations/UserConversations'
import { t } from '../i18n'

export default function Home() {
  return (
    <>
      <h1>{t('conversations.title')}</h1>
      <UserConversations />
    </>
  )
}
