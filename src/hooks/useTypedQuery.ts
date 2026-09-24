import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/apiClient'
import type { QueryEndpoint } from '../services/endpoints'

// The path is unique per resource, so it is also the cache key (used to invalidate a query after a mutation)
export function getQueryKey<TParams extends unknown[], TOutput>(
  endpoint: QueryEndpoint<TParams, TOutput>,
  ...params: TParams
) {
  return [endpoint.path(...params)]
}

// Usage: useTypedQuery(queries.messages, { conversationId }) → data: Message[]
export function useTypedQuery<TParams extends unknown[], TOutput>(
  endpoint: QueryEndpoint<TParams, TOutput>,
  ...params: TParams
) {
  const queryKey = getQueryKey(endpoint, ...params)

  return useQuery({ queryKey, queryFn: () => apiRequest(queryKey[0], { schema: endpoint.output }) })
}
