import type { ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { LoggedUserProvider, useLoggedUserId } from '../LoggedUserContext'

describe('useLoggedUserId', () => {
  it('should return the id given to the provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LoggedUserProvider userId={2}>{children}</LoggedUserProvider>
    )

    const { result } = renderHook(() => useLoggedUserId(), { wrapper })

    expect(result.current).toBe(2)
  })

  it('should throw when used outside the provider', () => {
    expect(() => renderHook(() => useLoggedUserId())).toThrow('useLoggedUserId must be used inside LoggedUserProvider')
  })
})
