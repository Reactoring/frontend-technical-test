import { useRouter } from 'next/router'
import { ConversationDetail } from '../../components/conversations/ConversationDetail/ConversationDetail'
import { ConversationDetailSkeleton } from '../../components/conversations/ConversationDetail/ConversationDetailSkeleton'

export default function ConversationPage() {
  const router = useRouter()

  if (!router.isReady) return <ConversationDetailSkeleton />

  return <ConversationDetail conversationId={Number(router.query.id)} />
}
