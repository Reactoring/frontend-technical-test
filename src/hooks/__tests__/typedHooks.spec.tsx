import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { apiRequest } from '../../services/apiClient'
import { mutations, queries } from '../../services/endpoints'
import { useTypedMutation } from '../useTypedMutation'
import { useTypedQuery } from '../useTypedQuery'

jest.mock('../../services/apiClient')
const apiRequestMock = jest.mocked(apiRequest)

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

const message = { conversationId: 7, authorId: 3, timestamp: 1700000000, body: 'Hello' }

beforeEach(() => apiRequestMock.mockReset())

describe('useTypedQuery', () => {
  it('should call the endpoint path with its schema and return the data', async () => {
    apiRequestMock.mockResolvedValue([{ id: 1, ...message }])

    const { result } = renderHook(() => useTypedQuery(queries.messages, { conversationId: 7 }), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual([{ id: 1, ...message }]))
    expect(apiRequestMock).toHaveBeenCalledWith('/messages/7', { schema: queries.messages.output })
  })
})

describe('useTypedMutation', () => {
  it('should post the validated input', async () => {
    apiRequestMock.mockResolvedValue({ id: 1 })

    const { result } = renderHook(() => useTypedMutation(mutations.sendMessage), { wrapper })
    result.current.mutate({ ...message, body: '  Hello  ' })

    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }))
    expect(apiRequestMock).toHaveBeenCalledWith(
      '/messages/7',
      expect.objectContaining({ method: 'POST', body: message }),
    )
  })

  it('should not call the api when the input is invalid', async () => {
    const { result } = renderHook(() => useTypedMutation(mutations.sendMessage), { wrapper })
    result.current.mutate({ ...message, body: '   ' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(apiRequestMock).not.toHaveBeenCalled()
  })
})

// Never executed: `npm run typecheck` fails if the contract stops rejecting these calls
export function useContractTypeChecks() {
  // @ts-expect-error unknown endpoint
  useTypedQuery(queries.unknown)
  // @ts-expect-error wrong params
  useTypedQuery(queries.messages, { id: 7 })
  // @ts-expect-error missing input fields
  useTypedMutation(mutations.sendMessage).mutate({ body: 'Hello' })
}
