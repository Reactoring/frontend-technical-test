import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '../services/apiClient'
import type { MutationEndpoint } from '../services/endpoints'

// Usage: useTypedMutation(mutations.sendMessage).mutate({ conversationId, authorId, body, timestamp })
export function useTypedMutation<TInput, TOutput>(endpoint: MutationEndpoint<TInput, TOutput>) {
  return useMutation({
    // The input is validated before being sent, the output when it comes back
    mutationFn: (input: TInput) =>
      apiRequest(endpoint.path(input), {
        method: endpoint.method,
        body: endpoint.input.parse(input),
        schema: endpoint.output,
      }),
  })
}
