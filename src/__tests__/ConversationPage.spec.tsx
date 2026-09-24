import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

    expect(await screen.findByText('Conversation introuvable')).toBeInTheDocument()
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

describe('Message form', () => {
  const sendMessage = async (text: string) => {
    const field = await screen.findByRole('textbox', { name: 'Votre message' })
    fireEvent.change(field, { target: { value: text } })
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer' }))
    return field
  }

  it('should send the message, clear the field and reload the messages', async () => {
    openConversation('1')
    const newMessage = { id: 3, conversationId: 1, authorId: 1, timestamp: 1625650000, body: 'Tu es dispo ?' }
    apiRequestMock
      .mockResolvedValueOnce(conversations)
      .mockResolvedValueOnce(messages)
      .mockResolvedValueOnce({ id: 3 })
      .mockResolvedValueOnce([...messages, newMessage])

    render(<ConversationPage />, { wrapper })
    const field = await sendMessage('  Tu es dispo ?  ')

    expect(await screen.findByText('Tu es dispo ?')).toBeInTheDocument()
    expect(field).toHaveValue('')
    expect(apiRequestMock).toHaveBeenCalledWith('/messages/1', {
      method: 'POST',
      body: { conversationId: 1, authorId: 1, timestamp: expect.any(Number), body: 'Tu es dispo ?' },
      schema: expect.anything(),
    })
  })

  it('should disable the send button and not send an empty message', async () => {
    openConversation('1')
    apiRequestMock.mockResolvedValueOnce(conversations).mockResolvedValueOnce(messages)

    render(<ConversationPage />, { wrapper })
    await screen.findByText('Bonjour Jeremie')
    await sendMessage('   ')

    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeDisabled()
    expect(apiRequestMock).toHaveBeenCalledTimes(2)
  })

  it('should keep the text and show an error when the message cannot be sent', async () => {
    openConversation('1')
    apiRequestMock
      .mockResolvedValueOnce(conversations)
      .mockResolvedValueOnce(messages)
      .mockRejectedValueOnce(new Error('Server unreachable'))

    render(<ConversationPage />, { wrapper })
    const field = await sendMessage('Tu es dispo ?')

    expect(await screen.findByRole('alert')).toHaveTextContent("Votre message n'a pas pu être envoyé. Réessayez.")
    expect(field).toHaveValue('Tu es dispo ?')
  })

  it('should keep the messages visible when reloading them fails', async () => {
    openConversation('1')
    apiRequestMock
      .mockResolvedValueOnce(conversations)
      .mockResolvedValueOnce(messages)
      .mockResolvedValueOnce({ id: 3 })
      .mockRejectedValueOnce(new Error('Server unreachable'))

    render(<ConversationPage />, { wrapper })
    await sendMessage('Tu es dispo ?')

    await waitFor(() => expect(apiRequestMock).toHaveBeenCalledTimes(4))
    expect(screen.getByText('Bonjour Jeremie')).toBeInTheDocument()
    expect(screen.queryByText('Le serveur fait une sieste')).not.toBeInTheDocument()
  })
})
