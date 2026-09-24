import { searchUsers } from '../user'

const users = [
  { id: 1, nickname: 'Élodie' },
  { id: 2, nickname: 'Jeremie' },
]

describe('searchUsers', () => {
  it('should find users ignoring case and accents', () => {
    expect(searchUsers(users, ' ELO ')).toEqual([users[0]])
  })

  it('should return every user for an empty search', () => {
    expect(searchUsers(users, '')).toEqual(users)
  })
})
