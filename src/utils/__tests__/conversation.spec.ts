import { findConversationWith, getInterlocutorNickname, sortByMostRecent } from '../conversation'

const conversation = {
  id: 1,
  senderId: 1,
  senderNickname: 'Elodie',
  recipientId: 2,
  recipientNickname: 'Jeremie',
  lastMessageTimestamp: 1625637849,
}

describe('getInterlocutorNickname', () => {
  it('should return the recipient when the logged user is the sender', () => {
    expect(getInterlocutorNickname(conversation, 1)).toBe('Jeremie')
  })

  it('should return the sender when the logged user is the recipient', () => {
    expect(getInterlocutorNickname(conversation, 2)).toBe('Elodie')
  })
})

describe('sortByMostRecent', () => {
  it('should sort the conversations from the most recent without mutating the input', () => {
    const older = { ...conversation, id: 2, lastMessageTimestamp: 1620000000 }
    const conversations = [older, conversation]

    expect(sortByMostRecent(conversations)).toEqual([conversation, older])
    expect(conversations).toEqual([older, conversation])
  })
})

describe('findConversationWith', () => {
  it('should find the conversation whoever started it', () => {
    expect(findConversationWith([conversation], 1, 2)).toBe(conversation)
    expect(findConversationWith([conversation], 2, 1)).toBe(conversation)
  })

  it('should return undefined when the users have no conversation', () => {
    expect(findConversationWith([conversation], 1, 3)).toBeUndefined()
  })
})
