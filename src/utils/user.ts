import type { User } from '../types/user'

// Case and accent insensitive, so "Elo" finds "Élodie"
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export function searchUsers(users: User[], search: string) {
  return users.filter(({ nickname }) => normalize(nickname).includes(normalize(search.trim())))
}
