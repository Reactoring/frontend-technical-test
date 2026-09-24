import { useRouter } from 'next/router'
import { ConversationDetail } from '../../components/conversations/ConversationDetail/ConversationDetail'
import { t } from '../../i18n'

export default function ConversationPage() {
  const router = useRouter()

  // The page is static: the id is only known once the router is ready
  if (!router.isReady) return <p>{t('common.loading')}</p>

  return <ConversationDetail conversationId={Number(router.query.id)} />
}
