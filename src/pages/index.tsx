import { ConversationListHeader } from '../components/conversations/ConversationListHeader/ConversationListHeader'
import { UserConversations } from '../components/conversations/UserConversations/UserConversations'

export default function Home() {
  return (
    <>
      <ConversationListHeader />
      <UserConversations />
    </>
  )
}
