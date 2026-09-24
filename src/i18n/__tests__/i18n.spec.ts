import { t } from '..'

describe('t', () => {
  it('should return the french text of a key', () => {
    expect(t('conversations.title')).toBe('Mes conversations')
  })

  it('should replace the placeholders with the params', () => {
    expect(t('messages.emptyHint', { name: 'Elodie' })).toBe('Envoyez le premier message à Elodie.')
  })
})
