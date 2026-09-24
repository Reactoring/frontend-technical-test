import { useState } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import '../styles/globals.css'

// Default way to get a logged user
export const loggedUserId = getLoggedUserId()

export default function App({ Component, pageProps }: AppProps) {
  // One client per app instance, so the cache is never shared between server renders
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
