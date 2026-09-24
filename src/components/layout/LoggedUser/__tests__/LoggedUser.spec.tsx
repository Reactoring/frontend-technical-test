import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { LoggedUserProvider } from '../../../../contexts/LoggedUserContext'
import { apiRequest } from '../../../../services/apiClient'
import { LoggedUser } from '../LoggedUser'

jest.mock('../../../../services/apiClient')
const apiRequestMock = jest.mocked(apiRequest)

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <LoggedUserProvider userId={2}>{children}</LoggedUserProvider>
  </QueryClientProvider>
)

beforeEach(() => apiRequestMock.mockReset())

describe('LoggedUser', () => {
  it('should show the nickname of the logged user', async () => {
    apiRequestMock.mockResolvedValueOnce([
      { id: 1, nickname: 'Elodie' },
      { id: 2, nickname: 'Jeremie' },
    ])

    render(<LoggedUser />, { wrapper })

    expect(await screen.findByText('Jeremie')).toBeInTheDocument()
    expect(screen.queryByText('Elodie')).not.toBeInTheDocument()
  })

  it('should show nothing when the users cannot be loaded', async () => {
    apiRequestMock.mockRejectedValueOnce(new Error('Server unreachable'))

    const { container } = render(<LoggedUser />, { wrapper })

    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })
})
