import type { User } from '../types/user'

const STORAGE_KEY = 'loggedUserId'

// Default way to use a logged user
// Feel free to update the user ID for your tests
// or enhance it with better data source, or better user management
// The demo panel can log in as another user, saved in the browser
export const getLoggedUserId = (): User['id'] => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 1
  } catch {
    // No localStorage on the server, or blocked by the browser
    return 1
  }
}

export const setLoggedUserId = (userId: User['id']) => localStorage.setItem(STORAGE_KEY, String(userId))
