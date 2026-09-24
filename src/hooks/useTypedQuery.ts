import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/apiClient'
import type { QueryEndpoint } from '../services/endpoints'

// Usage: useTypedQuery(queries.messages, { conversationId }) → data: Message[]
export function useTypedQuery<TParams extends unknown[], TOutput>(
  endpoint: QueryEndpoint<TParams, TOutput>,
  ...params: TParams
) {
  const path = endpoint.path(...params)

  // The path is unique per resource, so it is also the cache key
  return useQuery({ queryKey: [path], queryFn: () => apiRequest(path, { schema: endpoint.output }) })
}
