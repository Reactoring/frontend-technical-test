import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
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

  it('should show a message when there is no conversation', async () => {
    apiRequestMock.mockResolvedValue([])

    render(<Home />, { wrapper })

    expect(await screen.findByText('Aucune conversation pour le moment.')).toBeInTheDocument()
  })

  it('should show an error when the conversations cannot be loaded', async () => {
    apiRequestMock.mockRejectedValue(new Error('Server unreachable'))

    render(<Home />, { wrapper })

    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger vos conversations.')
  })
})
