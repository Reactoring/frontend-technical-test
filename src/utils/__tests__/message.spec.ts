import { sortByOldest } from '../message'

const message = { id: 1, conversationId: 1, authorId: 1, timestamp: 1625637849, body: 'Bonjour' }

describe('sortByOldest', () => {
  it('should sort the messages from the oldest without mutating the input', () => {
    const newer = { ...message, id: 2, timestamp: 1625648667 }
    const messages = [newer, message]

    expect(sortByOldest(messages)).toEqual([message, newer])
    expect(messages).toEqual([newer, message])
  })
})
