import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { useRouter, type NextRouter } from 'next/router'
import { LoggedUserProvider } from '../contexts/LoggedUserContext'
import ConversationPage from '../pages/conversations/[id]'
import { apiRequest } from '../services/apiClient'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('../services/apiClient')
const useRouterMock = jest.mocked(useRouter)
const apiRequestMock = jest.mocked(apiRequest)

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <LoggedUserProvider userId={1}>{children}</LoggedUserProvider>
  </QueryClientProvider>
)

const openConversation = (id: string) =>
  useRouterMock.mockReturnValue({ isReady: true, query: { id } } as unknown as NextRouter)

const conversations = [
  {
    id: 1,
    senderId: 1,
    senderNickname: 'Elodie',
    recipientId: 2,
    recipientNickname: 'Jeremie',
    lastMessageTimestamp: 1625648667,
  },
]

const messages = [
  { id: 2, conversationId: 1, authorId: 2, timestamp: 1625648667, body: 'Salut Elodie' },
  { id: 1, conversationId: 1, authorId: 1, timestamp: 1625637849, body: 'Bonjour Jeremie' },
]

beforeEach(() => apiRequestMock.mockReset())

describe('Conversation page', () => {
  it('should show the interlocutor and the messages, oldest first', async () => {
    openConversation('1')
    apiRequestMock.mockResolvedValueOnce(conversations).mockResolvedValueOnce(messages)

    render(<ConversationPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Jeremie' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retour à mes conversations' })).toHaveAttribute('href', '/')
    const items = await screen.findAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Bonjour Jeremie', 'JeremieSalut Elodie'])
    expect(apiRequestMock).toHaveBeenLastCalledWith('/messages/1', expect.anything())
  })

  it('should not load the messages of a conversation outside the user list', async () => {
    openConversation('99')
    apiRequestMock.mockResolvedValueOnce(conversations)

    render(<ConversationPage />, { wrapper })

    expect(await screen.findByText('Conversation introuvable.')).toBeInTheDocument()
    expect(apiRequestMock).toHaveBeenCalledTimes(1)
  })

  it('should show a message when the conversation is empty', async () => {
    openConversation('1')
    apiRequestMock.mockResolvedValueOnce(conversations).mockResolvedValueOnce([])

    render(<ConversationPage />, { wrapper })

    expect(await screen.findByText("Aucun message pour l'instant")).toBeInTheDocument()
    expect(screen.getByText('Envoyez le premier message à Jeremie.')).toBeInTheDocument()
  })
})
