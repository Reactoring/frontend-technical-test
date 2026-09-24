import { createContext, useContext, type ReactNode } from 'react'
import type { User } from '../types/user'

const LoggedUserContext = createContext<User['id'] | null>(null)

export function LoggedUserProvider({ userId, children }: { userId: User['id']; children: ReactNode }) {
  return <LoggedUserContext.Provider value={userId}>{children}</LoggedUserContext.Provider>
}

export function useLoggedUserId() {
  const userId = useContext(LoggedUserContext)
  if (userId === null) throw new Error('useLoggedUserId must be used inside LoggedUserProvider')
  return userId
}
