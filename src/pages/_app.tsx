import { useState } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '../components/Layout/Layout'
import { LoggedUserProvider } from '../contexts/LoggedUserContext'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import '@fontsource-variable/mona-sans'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  // One client per app instance, so the cache is never shared between server renders
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <LoggedUserProvider userId={getLoggedUserId()}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoggedUserProvider>
    </QueryClientProvider>
  )
}
