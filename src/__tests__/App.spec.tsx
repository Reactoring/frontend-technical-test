import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { LoggedUserProvider } from '../contexts/LoggedUserContext'
import Home from '../pages'
import { apiRequest } from '../services/apiClient'

jest.mock('../services/apiClient')
const apiRequestMock = jest.mocked(apiRequest)

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <LoggedUserProvider userId={1}>{children}</LoggedUserProvider>
  </QueryClientProvider>
)

const conversations = [
  {
    id: 1,
    senderId: 1,
    senderNickname: 'Elodie',
    recipientId: 2,
    recipientNickname: 'Jeremie',
    lastMessageTimestamp: 1620000000,
  },
  {
    id: 2,
    senderId: 3,
    senderNickname: 'Patrick',
    recipientId: 1,
    recipientNickname: 'Elodie',
    lastMessageTimestamp: 1625000000,
  },
]

beforeEach(() => apiRequestMock.mockReset())

describe('Conversations page', () => {
  it('should list the conversations of the logged user, most recent first', async () => {
    apiRequestMock.mockResolvedValue(conversations)

    render(<Home />, { wrapper })

    expect(screen.getByRole('heading', { name: 'Mes conversations' })).toBeInTheDocument()
    const items = await screen.findAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining('Patrick'),
      expect.stringContaining('Jeremie'),
    ])
    expect(within(items[0]).getByRole('link')).toHaveAttribute('href', '/conversations/2')
    expect(apiRequestMock).toHaveBeenCalledWith('/conversations/1', expect.anything())
  })

  it('should load the messages when a conversation is hovered', async () => {
    apiRequestMock.mockResolvedValueOnce(conversations).mockResolvedValueOnce([])

    render(<Home />, { wrapper })
    fireEvent.mouseEnter(await screen.findByRole('link', { name: /Patrick/ }))

    expect(apiRequestMock).toHaveBeenLastCalledWith('/messages/2', expect.anything())
  })

  it('should show a message when there is no conversation', async () => {
    apiRequestMock.mockResolvedValue([])

    render(<Home />, { wrapper })

    expect(await screen.findByText('Aucune conversation pour le moment.')).toBeInTheDocument()
  })

  it('should show an error when the server is down and load the conversations on retry', async () => {
    apiRequestMock.mockRejectedValueOnce(new Error('Server unreachable')).mockResolvedValueOnce(conversations)

    render(<Home />, { wrapper })

    expect(await screen.findByRole('alert')).toHaveTextContent('Le serveur fait une sieste')
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(await screen.findByText('Patrick')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
