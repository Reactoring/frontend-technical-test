import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter, type NextRouter } from 'next/router'
import { LoggedUserProvider } from '../../../../contexts/LoggedUserContext'
import { apiRequest } from '../../../../services/apiClient'
import { ConversationListHeader } from '../ConversationListHeader'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('../../../../services/apiClient')
const apiRequestMock = jest.mocked(apiRequest)
const push = jest.fn()
jest.mocked(useRouter).mockReturnValue({ push } as unknown as NextRouter)

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <LoggedUserProvider userId={1}>{children}</LoggedUserProvider>
  </QueryClientProvider>
)

const users = [
  { id: 1, nickname: 'Elodie' },
  { id: 2, nickname: 'Jeremie' },
  { id: 3, nickname: 'Patrick' },
]

const conversations = [
  {
    id: 1,
    senderId: 2,
    senderNickname: 'Jeremie',
    recipientId: 1,
    recipientNickname: 'Elodie',
    lastMessageTimestamp: 1625637849,
  },
]

const openSearch = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Nouvelle conversation' }))
  return screen.findByRole('searchbox', { name: 'Rechercher un destinataire' })
}

beforeEach(() => {
  apiRequestMock.mockReset()
  push.mockReset()
})

describe('New conversation search', () => {
  it('should suggest the other users and filter them while typing', async () => {
    apiRequestMock.mockResolvedValueOnce(users).mockResolvedValueOnce(conversations)

    render(<ConversationListHeader />, { wrapper })
    const search = await openSearch()

    expect(await screen.findByRole('button', { name: 'Jeremie' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Elodie' })).not.toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'pat' } })
    expect(screen.queryByRole('button', { name: 'Jeremie' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Patrick' })).toBeInTheDocument()
  })

  it('should open the existing conversation instead of creating a duplicate', async () => {
    apiRequestMock.mockResolvedValueOnce(users).mockResolvedValueOnce(conversations)

    render(<ConversationListHeader />, { wrapper })
    await openSearch()
    fireEvent.click(await screen.findByRole('button', { name: 'Jeremie' }))

    expect(push).toHaveBeenCalledWith('/conversations/1')
    expect(apiRequestMock).toHaveBeenCalledTimes(2)
  })

  it('should create the conversation and open it', async () => {
    apiRequestMock
      .mockResolvedValueOnce(users)
      .mockResolvedValueOnce(conversations)
      .mockResolvedValueOnce({ id: 4 })
      .mockResolvedValueOnce(conversations)

    render(<ConversationListHeader />, { wrapper })
    await openSearch()
    fireEvent.click(await screen.findByRole('button', { name: 'Patrick' }))

    await waitFor(() => expect(push).toHaveBeenCalledWith('/conversations/4'))
    expect(apiRequestMock).toHaveBeenCalledWith('/conversations/1', {
      method: 'POST',
      body: {
        senderId: 1,
        senderNickname: 'Elodie',
        recipientId: 3,
        recipientNickname: 'Patrick',
        lastMessageTimestamp: expect.any(Number),
      },
      schema: expect.anything(),
    })
  })

  it('should close the search with Escape and give the focus back to the button', async () => {
    apiRequestMock.mockResolvedValueOnce(users).mockResolvedValueOnce(conversations)

    render(<ConversationListHeader />, { wrapper })
    const search = await openSearch()
    fireEvent.keyDown(search, { key: 'Escape' })

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nouvelle conversation' })).toHaveFocus()
  })
})
