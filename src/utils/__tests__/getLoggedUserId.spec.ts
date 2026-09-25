import { getLoggedUserId, setLoggedUserId } from '../getLoggedUserId'

afterEach(() => localStorage.clear())

describe('getLoggedUserId', () => {
  it('should return logged user id', () => {
    const expected = 1

    expect(getLoggedUserId()).toEqual(expected)
  })

  it('should return the user chosen in the demo panel', () => {
    setLoggedUserId(2)

    expect(getLoggedUserId()).toEqual(2)
  })
})
